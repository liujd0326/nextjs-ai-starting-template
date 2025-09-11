"use client";

import {
  AlertTriangle,
  Archive,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { MotionDiv } from "@/components/motion-wrapper";
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
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Generations Yet</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          You haven&apos;t generated any images yet. Start creating amazing AI
          art by uploading an image and choosing your style!
        </p>
        <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-xl shadow-[0_4px_20px_rgb(5,150,105,0.3)] hover:shadow-[0_6px_25px_rgb(5,150,105,0.4)] transition-all duration-300 hover:scale-105">
          <Link href="/">
            <ImageIcon className="h-4 w-4 mr-2" />
            Create Your First Design
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-6 py-8 ${className}`}>
      {/* Header */}
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 md:p-8 lg:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                  <ImageIcon className="h-10 w-10" />
                  Generation History ✨
                </h1>
                <p className="text-lg text-emerald-100">
                  View and manage your AI-generated masterpieces
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center lg:items-center gap-4">
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <span className="text-sm font-medium text-white">Status:</span>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 bg-white/90 border-0 text-gray-900">
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

                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <span className="text-sm font-medium text-emerald-100">
                    {filteredGenerations.length} of {generations.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionDiv>

      {/* Generation Grid */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGenerations.map((generation, index) => {
            const imageUrls = getImageUrls(generation);
            const currentImageUrl = getCurrentImageUrl(generation);

            return (
              <MotionDiv
                key={generation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className="overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 group"
                >
                <CardHeader className="px-4 md:px-6 pb-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={getStatusBadgeVariant(generation.status)}
                      className="text-xs font-medium shadow-sm"
                    >
                      {generation.status}
                    </Badge>
                    <div className="bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1 rounded-full">
                      <p className="text-xs font-medium text-emerald-700">
                        {formatDate(generation.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-4 md:px-6 pb-6">
                  {/* Image Carousel */}
                  <div className="relative mb-6">
                    {currentImageUrl ? (
                      <div className="relative w-full h-48 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)] transition-all duration-300">
                        <Image
                          src={currentImageUrl}
                          alt="Generated image"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                nextImage(generation.id, imageUrls.length);
                              }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* Image indicators */}
                        {imageUrls.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {imageUrls.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex(generation.id, index);
                                }}
                                className={`w-3 h-3 rounded-full transition-all duration-300 shadow-lg ${
                                  getCurrentImageIndex(generation.id) === index
                                    ? "bg-white scale-125"
                                    : "bg-white/60 hover:bg-white/80"
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Image counter */}
                        {imageUrls.length > 1 && (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                            {getCurrentImageIndex(generation.id) + 1}/{imageUrls.length}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                        {generation.status === "processing" ? (
                          <div className="flex flex-col items-center gap-3 text-gray-600">
                            <div className="p-4 bg-blue-100 rounded-full">
                              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            </div>
                            <span className="text-sm font-medium">Processing...</span>
                          </div>
                        ) : generation.status === "failed" ? (
                          <div className="flex flex-col items-center gap-3 text-gray-600">
                            <div className="p-4 bg-red-100 rounded-full">
                              <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                            <span className="text-sm font-medium">Generation Failed</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-gray-600">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <ImageIcon className="h-8 w-8 text-gray-500" />
                            </div>
                            <span className="text-sm font-medium">No Image Available</span>
                          </div>
                        )}
                      </div>
                    )}
                </div>

                  {/* Error message */}
                  {generation.errorMessage && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-3 mb-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-800 font-medium">
                          {generation.errorMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {currentImageUrl && (
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 rounded-xl shadow-[0_4px_20px_rgb(5,150,105,0.3)] hover:shadow-[0_6px_25px_rgb(5,150,105,0.4)] transition-all duration-300 hover:scale-105"
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
                            : "Image"}
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
                </Card>
              </MotionDiv>
            );
          })}
        </div>
      </MotionDiv>
    </div>
  );
};

export default GenerationHistoryView;
