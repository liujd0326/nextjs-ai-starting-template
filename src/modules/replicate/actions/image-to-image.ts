"use server";

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import Replicate from "replicate";

import { db } from "@/db";
import { aiGenerations, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { deductCredits } from "@/lib/credits";
import { uploadToR2 } from "@/lib/storage/r2";

import { FaceToManyKontextInput, GenerationResult } from "../types";

const MODEL_ID = "flux-kontext-apps/face-to-many-kontext";

export async function generateImageToImage(
  formData: FormData
): Promise<GenerationResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, message: "Please sign in to continue" };
    }

    // Extract form data
    const inputFile = formData.get("inputFile") as File;
    const style = formData.get("style") as FaceToManyKontextInput["style"];
    const persona = formData.get(
      "persona"
    ) as FaceToManyKontextInput["persona"];
    const numImages = parseInt(formData.get("numImages") as string);
    const aspectRatio = formData.get(
      "aspectRatio"
    ) as FaceToManyKontextInput["aspect_ratio"];
    const preserveOutfit = formData.get("preserveOutfit") === "true";
    const preserveBackground = formData.get("preserveBackground") === "true";
    const seed = formData.get("seed")
      ? parseInt(formData.get("seed") as string)
      : undefined;
    const outputFormat = formData.get(
      "outputFormat"
    ) as FaceToManyKontextInput["output_format"];
    const safetyTolerance = parseInt(
      formData.get("safetyTolerance") as string
    ) as FaceToManyKontextInput["safety_tolerance"];

    if (!inputFile) {
      return { success: false, message: "Input file is required" };
    }

    // Check if user has enough credits
    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));
    if (!userData) {
      return { success: false, message: "User not found" };
    }

    const totalCredits =
      (userData.monthlyCredits || 0) + (userData.purchasedCredits || 0);
    const requiredCredits = numImages; // 每生成一张图片消耗1积分

    if (totalCredits < requiredCredits) {
      return {
        success: false,
        message: `Insufficient credits. You need ${requiredCredits} credits but have ${totalCredits}.`,
      };
    }

    // Initialize Replicate
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error("REPLICATE_API_TOKEN not found");
      return { success: false, message: "API configuration error" };
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Upload input image to R2
    const inputImageUpload = await uploadToR2(inputFile, "generations/inputs");

    // Create generation record
    const generationId = nanoid();
    const modelParams: FaceToManyKontextInput = {
      input_image: inputImageUpload.url,
      style: style || "Random",
      persona: persona || "None",
      num_images: numImages,
      aspect_ratio: aspectRatio || "match_input_image",
      preserve_outfit: preserveOutfit,
      preserve_background: preserveBackground,
      output_format: outputFormat || "png",
      safety_tolerance: safetyTolerance || 2,
    };

    if (seed) {
      modelParams.seed = seed;
    }

    await db.insert(aiGenerations).values({
      id: generationId,
      userId: session.user.id,
      type: "image_to_image",
      status: "pending",
      inputImageUrl: inputImageUpload.url,
      model: MODEL_ID,
      parameters: JSON.stringify(modelParams),
      creditsUsed: requiredCredits,
    });

    // Start Replicate prediction
    const prediction = await replicate.predictions.create({
      model: MODEL_ID,
      input: modelParams,
    });

    // Update generation record with prediction ID
    await db
      .update(aiGenerations)
      .set({
        replicateId: prediction.id,
        status: "processing",
        startedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(aiGenerations.id, generationId));

    // Deduct credits using unified method
    const deductResult = await deductCredits(
      session.user.id,
      requiredCredits,
      `Generated ${numImages} images using ${style} style`
    );

    if (!deductResult.success) {
      // Rollback generation record if credit deduction fails
      await db.delete(aiGenerations).where(eq(aiGenerations.id, generationId));
      return {
        success: false,
        message: deductResult.error || "Failed to deduct credits",
      };
    }

    // Wait for completion (simplified version - in production you'd want to poll or use webhooks)
    let finalPrediction = prediction;
    const maxWaitTime = 300000; // 5 minutes
    const startTime = Date.now();

    while (
      finalPrediction.status === "starting" ||
      finalPrediction.status === "processing"
    ) {
      if (Date.now() - startTime > maxWaitTime) {
        await db
          .update(aiGenerations)
          .set({
            status: "failed",
            errorMessage: "Generation timed out",
            updatedAt: new Date(),
          })
          .where(eq(aiGenerations.id, generationId));

        return {
          success: false,
          message: "Generation timed out. Please try again.",
        };
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      finalPrediction = await replicate.predictions.get(prediction.id);
    }

    if (finalPrediction.status === "succeeded") {
      // Upload generated images to R2
      const outputUrls: string[] = [];
      const outputs = Array.isArray(finalPrediction.output)
        ? finalPrediction.output
        : [finalPrediction.output];

      for (const [index, outputUrl] of outputs.entries()) {
        try {
          // Fetch the image from Replicate
          const response = await fetch(outputUrl);
          const buffer = await response.arrayBuffer();
          const file = new File(
            [buffer],
            `generated-${index}.${outputFormat || "png"}`,
            {
              type: `image/${outputFormat || "png"}`,
            }
          );

          // Upload to R2
          const upload = await uploadToR2(file, "generations/outputs");
          outputUrls.push(upload.url);
        } catch (error) {
          console.error("Error uploading generated image:", error);
          // Continue with other images
        }
      }

      await db
        .update(aiGenerations)
        .set({
          status: "completed",
          outputImageUrls: JSON.stringify(outputUrls),
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(aiGenerations.id, generationId));

      return {
        success: true,
        generationId,
        message: "Images generated successfully!",
        outputUrls,
      };
    } else {
      await db
        .update(aiGenerations)
        .set({
          status: "failed",
          errorMessage: finalPrediction.error || "Unknown error",
          updatedAt: new Date(),
        })
        .where(eq(aiGenerations.id, generationId));

      return {
        success: false,
        message:
          finalPrediction.error || "Generation failed. Please try again.",
      };
    }
  } catch (error) {
    console.error("Image to image generation error:", error);
    return {
      success: false,
      message:
        "An error occurred while generating the image. Please try again.",
    };
  }
}
