"use server";

import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { aiGenerations } from "@/db/schema";
import { auth } from "@/lib/auth";

export interface GenerationRecord {
  id: string;
  type: string;
  status: string;
  inputImageUrl: string | null;
  prompt: string | null;
  model: string;
  parameters: string;
  outputImageUrls: string | null;
  creditsUsed: number;
  errorMessage: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetGenerationsResult {
  success: boolean;
  message: string;
  generations?: GenerationRecord[];
  total?: number;
}

export async function getGenerations(
  page = 1,
  limit = 20
): Promise<GetGenerationsResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, message: "Please sign in to view generations" };
    }

    const offset = (page - 1) * limit;

    // Get user's generations with pagination
    const generations = await db
      .select({
        id: aiGenerations.id,
        type: aiGenerations.type,
        status: aiGenerations.status,
        inputImageUrl: aiGenerations.inputImageUrl,
        prompt: aiGenerations.prompt,
        model: aiGenerations.model,
        parameters: aiGenerations.parameters,
        outputImageUrls: aiGenerations.outputImageUrls,
        creditsUsed: aiGenerations.creditsUsed,
        errorMessage: aiGenerations.errorMessage,
        startedAt: aiGenerations.startedAt,
        completedAt: aiGenerations.completedAt,
        createdAt: aiGenerations.createdAt,
        updatedAt: aiGenerations.updatedAt,
      })
      .from(aiGenerations)
      .where(eq(aiGenerations.userId, session.user.id))
      .orderBy(desc(aiGenerations.createdAt))
      .limit(limit)
      .offset(offset);

    // For now, we'll use the length instead of actual count for pagination
    const total = generations.length;

    return {
      success: true,
      message: "Generations retrieved successfully",
      generations: generations as GenerationRecord[],
      total,
    };
  } catch (error) {
    console.error("Error fetching generations:", error);
    return {
      success: false,
      message: "Failed to retrieve generations",
    };
  }
}

export async function getGenerationById(
  id: string
): Promise<GetGenerationsResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, message: "Please sign in to view generation" };
    }

    const [generation] = await db
      .select({
        id: aiGenerations.id,
        type: aiGenerations.type,
        status: aiGenerations.status,
        inputImageUrl: aiGenerations.inputImageUrl,
        prompt: aiGenerations.prompt,
        model: aiGenerations.model,
        parameters: aiGenerations.parameters,
        outputImageUrls: aiGenerations.outputImageUrls,
        creditsUsed: aiGenerations.creditsUsed,
        errorMessage: aiGenerations.errorMessage,
        startedAt: aiGenerations.startedAt,
        completedAt: aiGenerations.completedAt,
        createdAt: aiGenerations.createdAt,
        updatedAt: aiGenerations.updatedAt,
      })
      .from(aiGenerations)
      .where(eq(aiGenerations.id, id))
      .limit(1);

    if (!generation) {
      return { success: false, message: "Generation not found" };
    }

    // Check if the generation belongs to the current user
    if (
      generation.type === "image_to_image" ||
      generation.type === "text_to_image"
    ) {
      const [userCheck] = await db
        .select({ userId: aiGenerations.userId })
        .from(aiGenerations)
        .where(eq(aiGenerations.id, id))
        .limit(1);

      if (!userCheck || userCheck.userId !== session.user.id) {
        return { success: false, message: "Access denied" };
      }
    }

    return {
      success: true,
      message: "Generation retrieved successfully",
      generations: [generation as GenerationRecord],
    };
  } catch (error) {
    console.error("Error fetching generation:", error);
    return {
      success: false,
      message: "Failed to retrieve generation",
    };
  }
}
