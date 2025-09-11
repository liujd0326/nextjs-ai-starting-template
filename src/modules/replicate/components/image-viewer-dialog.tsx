"use client";

import { Download, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { GenerationRecord } from "../actions/get-generations";

interface ImageViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generation: GenerationRecord | null;
}

export const ImageViewerDialog = ({
  open,
  onOpenChange,
  generation,
}: ImageViewerDialogProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!generation) return null;

  // Parse output images
  const outputImages: string[] = generation.outputImageUrls
    ? JSON.parse(generation.outputImageUrls)
    : [];

  // Parse parameters
  const parameters = generation.parameters
    ? JSON.parse(generation.parameters)
    : {};

  const downloadImage = (url: string, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `generation-${generation.id}-${index + 1}.${parameters.output_format || "png"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "failed":
        return "destructive";
      case "processing":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Generation Details</span>
            <Badge variant={getStatusBadgeVariant(generation.status)}>
              {generation.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div
          className="flex flex-col lg:flex-row gap-6 overflow-hidden"
          style={{ maxHeight: "calc(95vh - 120px)" }}
        >
          {/* Image Viewer */}
          <div className="flex-1 flex flex-col min-w-0">
            {outputImages.length > 0 ? (
              <>
                {/* Main Image */}
                <div
                  className="relative bg-muted rounded-lg overflow-hidden"
                  style={{ height: "500px" }}
                >
                  <Image
                    src={outputImages[selectedImageIndex]}
                    alt={`Generated image ${selectedImageIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={() =>
                      downloadImage(
                        outputImages[selectedImageIndex],
                        selectedImageIndex
                      )
                    }
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>

                {/* Image Thumbnails */}
                {outputImages.length > 1 && (
                  <div className="flex gap-2 mt-4">
                    {outputImages.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index
                            ? "border-primary"
                            : "border-transparent hover:border-muted-foreground"
                        }`}
                      >
                        <Image
                          src={url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center text-muted-foreground">
                  <X className="h-12 w-12 mx-auto mb-2" />
                  <p>No generated images</p>
                  {generation.errorMessage && (
                    <p className="text-sm mt-2">{generation.errorMessage}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Generation Info */}
          <div className="lg:w-80 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-4">
                {/* Basic Info */}
                <div>
                  <h3 className="font-semibold mb-2">Generation Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">
                        {generation.type.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model:</span>
                      <span className="text-right break-all text-xs">
                        {generation.model}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Credits Used:
                      </span>
                      <span>{generation.creditsUsed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="text-right text-xs">
                        {formatDate(generation.createdAt)}
                      </span>
                    </div>
                    {generation.completedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Completed:
                        </span>
                        <span className="text-right text-xs">
                          {formatDate(generation.completedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Input Image */}
                {generation.inputImageUrl && (
                  <div>
                    <h3 className="font-semibold mb-2">Input Image</h3>
                    <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={generation.inputImageUrl}
                        alt="Input image"
                        fill
                        className="object-cover"
                        sizes="320px"
                      />
                    </div>
                  </div>
                )}

                {/* Text Prompt */}
                {generation.prompt && (
                  <div>
                    <h3 className="font-semibold mb-2">Prompt</h3>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {generation.prompt}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Parameters */}
                <div>
                  <h3 className="font-semibold mb-2">Parameters</h3>
                  <div className="space-y-2 text-sm">
                    {parameters.style && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Style:</span>
                        <span>{parameters.style}</span>
                      </div>
                    )}
                    {parameters.persona && parameters.persona !== "None" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Persona:</span>
                        <span>{parameters.persona}</span>
                      </div>
                    )}
                    {parameters.aspect_ratio && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Aspect Ratio:
                        </span>
                        <span>{parameters.aspect_ratio}</span>
                      </div>
                    )}
                    {parameters.num_images && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Images:</span>
                        <span>{parameters.num_images}</span>
                      </div>
                    )}
                    {parameters.output_format && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span className="uppercase">
                          {parameters.output_format}
                        </span>
                      </div>
                    )}
                    {parameters.preserve_outfit && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Preserve Outfit:
                        </span>
                        <span>Yes</span>
                      </div>
                    )}
                    {parameters.preserve_background && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Preserve Background:
                        </span>
                        <span>Yes</span>
                      </div>
                    )}
                    {parameters.seed && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Seed:</span>
                        <span>{parameters.seed}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bulk Download */}
                {outputImages.length > 1 && (
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        outputImages.forEach((url, index) => {
                          setTimeout(
                            () => downloadImage(url, index),
                            index * 100
                          );
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download All ({outputImages.length})
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewerDialog;
