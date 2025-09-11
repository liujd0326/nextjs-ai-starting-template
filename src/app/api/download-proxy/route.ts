import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const filename = searchParams.get("filename") || "download";

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Validate URL is from allowed domains (R2, etc.)
    const allowedDomains = [
      ".r2.dev",
      process.env.R2_PUBLIC_URL?.replace(/^https?:\/\//, ""),
    ].filter(Boolean);

    const urlDomain = new URL(url).hostname;
    const isAllowed = allowedDomains.some(
      (domain) =>
        urlDomain.includes(domain as string) ||
        urlDomain.endsWith(domain as string)
    );

    if (!isAllowed) {
      return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
    }

    // Fetch the image
    const response = await fetch(url, {
      headers: {
        Accept: "image/*",
        "User-Agent": "NextJS-Download-Proxy/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();

    // Get content type from response or guess from URL
    let contentType =
      response.headers.get("content-type") || "application/octet-stream";
    if (contentType === "application/octet-stream") {
      // Try to guess content type from filename
      if (filename.includes(".jpg") || filename.includes(".jpeg")) {
        contentType = "image/jpeg";
      } else if (filename.includes(".png")) {
        contentType = "image/png";
      } else if (filename.includes(".webp")) {
        contentType = "image/webp";
      }
    }

    // Return the image with appropriate headers for download
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Download proxy error:", error);
    return NextResponse.json(
      { error: "Failed to download image" },
      { status: 500 }
    );
  }
}
