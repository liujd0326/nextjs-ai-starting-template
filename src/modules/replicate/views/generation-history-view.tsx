"use client";

import {
  AlertTriangle,
  Archive,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadImagesAsZip } from "@/lib/zip-utils";

import { GenerationRecord } from "../actions/get-generations";

interface GenerationHistoryViewProps {
  initialGenerations: GenerationRecord[];
  className?: string;
}

export const GenerationHistoryView = ({
  initialGenerations,
  className,
}: GenerationHistoryViewProps) => {
  const [generations] = useState<GenerationRecord[]>(initialGenerations);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Image carousel state for each generation
  const [imageIndices, setImageIndices] = useState<{ [key: string]: number }>(
    {}
  );

  // Download loading state for each generation
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  // Filter generations by status
  const filteredGenerations = generations.filter((gen) => {
    if (statusFilter === "all") return true;
    return gen.status === statusFilter;
  });

  // Image carousel functions
  const getImageUrls = (generation: GenerationRecord): string[] => {
    try {
      return generation.outputImageUrls
        ? JSON.parse(generation.outputImageUrls)
        : [];
    } catch {
      return [];
    }
  };

  const getCurrentImageIndex = (generationId: string) => {
    return imageIndices[generationId] || 0;
  };

  const setCurrentImageIndex = (generationId: string, index: number) => {
    setImageIndices((prev) => ({ ...prev, [generationId]: index }));
  };

  const nextImage = (generationId: string, totalImages: number) => {
    const currentIndex = getCurrentImageIndex(generationId);
    const nextIndex = (currentIndex + 1) % totalImages;
    setCurrentImageIndex(generationId, nextIndex);
  };

  const prevImage = (generationId: string, totalImages: number) => {
    const currentIndex = getCurrentImageIndex(generationId);
    const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
    setCurrentImageIndex(generationId, prevIndex);
  };

  // Download functions with improved CORS handling
  const downloadImageBlob = async (url: string, filename: string) => {
    // Check if URL is from R2 (our own domain)
    const isR2Url =
      url.includes(process.env.NEXT_PUBLIC_R2_DOMAIN || "") ||
      url.includes(".r2.dev");

    try {
      // For R2 URLs, try no-cors mode first, then cors mode
      const modes = isR2Url ? ["no-cors", "cors"] : ["cors", "no-cors"];

      for (const mode of modes) {
        try {
          const response = await fetch(url, {
            mode: mode as RequestMode,
            headers: {
              Accept: "image/*",
            },
            cache: "no-cache",
          });

          if (!response.ok && mode === "cors") {
            continue; // Try next mode
          }

          const blob = await response.blob();

          // Ensure we have a valid image blob
          if (blob.size === 0) {
            throw new Error("Empty blob received");
          }

          const blobUrl = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = filename;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up after a delay
          setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
          return; // Success, exit function
        } catch (modeError) {
          console.warn(`Download failed with ${mode} mode:`, modeError);
          continue; // Try next mode
        }
      }

      throw new Error("All fetch modes failed");
    } catch (error) {
      console.error("Fetch download failed, trying direct download:", error);

      // Fallback 1: Try proxy download for CORS issues
      if (isR2Url) {
        try {
          const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
          const link = document.createElement("a");
          link.href = proxyUrl;
          link.download = filename;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return;
        } catch (proxyError) {
          console.warn("Proxy download failed:", proxyError);
        }
      }

      // Fallback 2: Direct link download
      try {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // If this doesn't trigger a download, it will open in new tab
        console.info(
          "Attempted direct download, may open in new tab if download attribute not supported"
        );
      } catch (fallbackError) {
        console.error(
          "Direct download failed, opening in new tab:",
          fallbackError
        );
        // Final fallback: open in new tab
        window.open(url, "_blank", "noopener,noreferrer");
      }
    }
  };

  const downloadImagesAsZipFile = async (generation: GenerationRecord) => {
    const imageUrls = getImageUrls(generation);
    if (imageUrls.length === 0) return;

    // Check if already downloading
    if (downloadingIds.has(generation.id)) {
      console.log("Download already in progress for this generation");
      return;
    }

    // Set loading state
    setDownloadingIds((prev) => new Set([...prev, generation.id]));

    try {
      const filename = `generation-${generation.id}.zip`;
      console.log(`Creating ZIP file with ${imageUrls.length} images...`);

      await downloadImagesAsZip(imageUrls, filename);
      console.log("ZIP download completed successfully");
    } catch (error) {
      console.error("Error creating ZIP file:", error);

      // Fallback: try individual downloads using the blob method
      console.log("Falling back to individual downloads...");
      try {
        const parameters = JSON.parse(generation.parameters);
        const format = parameters.output_format || "png";

        for (let i = 0; i < imageUrls.length; i++) {
          const filename = `generation-${generation.id}-${i + 1}.${format}`;
          setTimeout(() => {
            downloadImageBlob(imageUrls[i], filename);
          }, i * 300);
        }
      } catch (fallbackError) {
        console.error("Fallback download also failed:", fallbackError);
      }
    } finally {
      // Clear loading state
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(generation.id);
        return next;
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default" as const;
      case "failed":
        return "destructive" as const;
      case "processing":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getCurrentImageUrl = (generation: GenerationRecord): string | null => {
    const imageUrls = getImageUrls(generation);
    if (imageUrls.length === 0) return null;

    const currentIndex = getCurrentImageIndex(generation.id);
    return imageUrls[currentIndex] || imageUrls[0];
  };

  const getParametersPreview = (generation: GenerationRecord): string => {
    try {
      const params = JSON.parse(generation.parameters);
      const parts = [];

      if (params.style && params.style !== "Random") {
        parts.push(params.style);
      }
      if (params.persona && params.persona !== "None") {
        parts.push(params.persona);
      }
      if (params.num_images && params.num_images > 1) {
        parts.push(`${params.num_images} images`);
      }

      return parts.length > 0 ? parts.join(", ") : "Default settings";
    } catch {
      return "Invalid parameters";
    }
  };

  if (generations.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-12 ${className}`}
      >
        <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Generations Yet</h3>
        <p className="text-muted-foreground text-center max-w-md">
          You haven&apos;t generated any images yet. Start creating amazing AI
          art by uploading an image and choosing your style!
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Generation History</h1>
          <p className="text-muted-foreground">
            View and manage your AI-generated images
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredGenerations.length} of {generations.length} generations
          </div>
        </div>
      </div>

      {/* Generation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGenerations.map((generation) => {
          const imageUrls = getImageUrls(generation);
          const currentImageUrl = getCurrentImageUrl(generation);

          return (
            <Card
              key={generation.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="px-4 pb-1">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={getStatusBadgeVariant(generation.status)}
                    className="text-xs"
                  >
                    {generation.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(generation.createdAt)}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="px-4">
                {/* Image Carousel */}
                <div className="relative mb-8">
                  {currentImageUrl ? (
                    <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden group">
                      <Image
                        src={currentImageUrl}
                        alt="Generated image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />

                      {/* Navigation arrows for multiple images */}
                      {imageUrls.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage(generation.id, imageUrls.length);
                            }}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage(generation.id, imageUrls.length);
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Image indicators */}
                      {imageUrls.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {imageUrls.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(generation.id, index);
                              }}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                getCurrentImageIndex(generation.id) === index
                                  ? "bg-white"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Image counter */}
                      {imageUrls.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {getCurrentImageIndex(generation.id) + 1}/
                          {imageUrls.length}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                      {generation.status === "processing" ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="text-sm">Processing...</span>
                        </div>
                      ) : generation.status === "failed" ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <AlertTriangle className="h-6 w-6" />
                          <span className="text-sm">Failed</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <ImageIcon className="h-6 w-6" />
                          <span className="text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Error message */}
                {generation.errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-2 mb-3">
                    <p className="text-xs text-red-800">
                      {generation.errorMessage}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {currentImageUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => downloadImagesAsZipFile(generation)}
                    disabled={downloadingIds.has(generation.id)}
                  >
                    {downloadingIds.has(generation.id) ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating ZIP...
                      </>
                    ) : (
                      <>
                        <Archive className="h-4 w-4 mr-2" />
                        Download{" "}
                        {imageUrls.length > 1
                          ? `(${imageUrls.length} images)`
                          : ""}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GenerationHistoryView;
