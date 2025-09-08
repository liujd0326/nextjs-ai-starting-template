/**
 * Lightweight ZIP utility for browser environments
 * Compatible with Cloudflare Workers deployment
 */

interface ZipFile {
  name: string;
  data: Uint8Array;
  date?: Date;
}

class SimpleZip {
  private files: ZipFile[] = [];

  addFile(name: string, data: Uint8Array, date?: Date) {
    this.files.push({ name, data, date: date || new Date() });
  }

  async addFromUrl(url: string, filename: string) {
    try {
      // Always use proxy for consistent behavior and avoid CORS issues
      const proxyUrl = `/api/download-proxy?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Proxy download failed: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      // Ensure we have valid data
      if (arrayBuffer.byteLength === 0) {
        throw new Error('Empty response received from proxy');
      }
      
      this.addFile(filename, new Uint8Array(arrayBuffer));
      console.log(`Successfully downloaded: ${filename} (${arrayBuffer.byteLength} bytes)`);
      
    } catch (error) {
      console.error(`Failed to download ${url} as ${filename}:`, error);
      throw error;
    }
  }

  generate(): Uint8Array {
    const centralDirectory: Uint8Array[] = [];
    let offset = 0;
    const fileData: Uint8Array[] = [];

    for (const file of this.files) {
      const { localHeader, fileHeader } = this.createFileEntry(file, offset);
      
      fileData.push(localHeader);
      fileData.push(file.data);
      centralDirectory.push(fileHeader);
      
      offset += localHeader.length + file.data.length;
    }

    // Central directory
    const centralDirData = this.concatenateArrays(centralDirectory);
    
    // End of central directory record
    const endRecord = this.createEndRecord(centralDirData.length, offset);
    
    // Combine all parts
    const allData = [...fileData, centralDirData, endRecord];
    return this.concatenateArrays(allData);
  }

  private createFileEntry(file: ZipFile, offset: number) {
    const nameBytes = new TextEncoder().encode(file.name);
    const date = this.dosDateTime(file.date || new Date());
    const crc32 = this.calculateCRC32(file.data);

    // Local file header
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    
    localView.setUint32(0, 0x04034b50, true); // Local file header signature
    localView.setUint16(4, 20, true); // Version needed to extract
    localView.setUint16(6, 0, true); // General purpose bit flag
    localView.setUint16(8, 0, true); // Compression method (stored)
    localView.setUint32(10, date, true); // File modification time/date
    localView.setUint32(14, crc32, true); // CRC-32
    localView.setUint32(18, file.data.length, true); // Compressed size
    localView.setUint32(22, file.data.length, true); // Uncompressed size
    localView.setUint16(26, nameBytes.length, true); // File name length
    localView.setUint16(28, 0, true); // Extra field length
    
    localHeader.set(nameBytes, 30);

    // Central directory file header
    const fileHeader = new Uint8Array(46 + nameBytes.length);
    const fileView = new DataView(fileHeader.buffer);
    
    fileView.setUint32(0, 0x02014b50, true); // Central directory file header signature
    fileView.setUint16(4, 20, true); // Version made by
    fileView.setUint16(6, 20, true); // Version needed to extract
    fileView.setUint16(8, 0, true); // General purpose bit flag
    fileView.setUint16(10, 0, true); // Compression method
    fileView.setUint32(12, date, true); // File modification time/date
    fileView.setUint32(16, crc32, true); // CRC-32
    fileView.setUint32(20, file.data.length, true); // Compressed size
    fileView.setUint32(24, file.data.length, true); // Uncompressed size
    fileView.setUint16(28, nameBytes.length, true); // File name length
    fileView.setUint16(30, 0, true); // Extra field length
    fileView.setUint16(32, 0, true); // File comment length
    fileView.setUint16(34, 0, true); // Disk number start
    fileView.setUint16(36, 0, true); // Internal file attributes
    fileView.setUint32(38, 0, true); // External file attributes
    fileView.setUint32(42, offset, true); // Relative offset of local header
    
    fileHeader.set(nameBytes, 46);

    return { localHeader, fileHeader };
  }

  private createEndRecord(centralDirSize: number, centralDirOffset: number): Uint8Array {
    const endRecord = new Uint8Array(22);
    const view = new DataView(endRecord.buffer);
    
    view.setUint32(0, 0x06054b50, true); // End of central directory signature
    view.setUint16(4, 0, true); // Number of this disk
    view.setUint16(6, 0, true); // Disk where central directory starts
    view.setUint16(8, this.files.length, true); // Number of central directory records on this disk
    view.setUint16(10, this.files.length, true); // Total number of central directory records
    view.setUint32(12, centralDirSize, true); // Size of central directory
    view.setUint32(16, centralDirOffset, true); // Offset of start of central directory
    view.setUint16(20, 0, true); // ZIP file comment length
    
    return endRecord;
  }

  private dosDateTime(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = Math.floor(date.getSeconds() / 2);

    const dosDate = ((year - 1980) << 9) | (month << 5) | day;
    const dosTime = (hours << 11) | (minutes << 5) | seconds;
    
    return (dosDate << 16) | dosTime;
  }

  private calculateCRC32(data: Uint8Array): number {
    const crcTable = this.makeCRCTable();
    let crc = 0 ^ (-1);

    for (let i = 0; i < data.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
  }

  private makeCRCTable(): number[] {
    const crcTable: number[] = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      crcTable[n] = c;
    }
    return crcTable;
  }

  private concatenateArrays(arrays: Uint8Array[]): Uint8Array {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    
    return result;
  }
}

/**
 * Create a ZIP file from multiple image URLs
 */
export async function createZipFromImages(
  imageUrls: string[],
  baseName: string = 'images'
): Promise<Uint8Array> {
  const zip = new SimpleZip();
  
  console.log(`Starting ZIP creation with ${imageUrls.length} images...`);
  
  // Download images one by one to avoid overwhelming the browser and CORS issues
  let successCount = 0;
  const errors: string[] = [];
  
  for (let index = 0; index < imageUrls.length; index++) {
    const url = imageUrls[index];
    
    try {
      // Extract file extension from URL or default to jpg
      const urlParts = url.split('.');
      let extension = 'jpg';
      if (urlParts.length > 1) {
        const lastPart = urlParts.pop() || '';
        // Handle query parameters
        const cleanExtension = lastPart.split('?')[0].split('&')[0];
        if (cleanExtension.length <= 4 && /^[a-zA-Z]+$/.test(cleanExtension)) {
          extension = cleanExtension;
        }
      }
      
      const filename = `${baseName}-${index + 1}.${extension}`;
      
      console.log(`Downloading image ${index + 1}/${imageUrls.length}: ${filename}`);
      await zip.addFromUrl(url, filename);
      successCount++;
      
    } catch (error) {
      const errorMsg = `Image ${index + 1}: ${error}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
  }
  
  console.log(`ZIP creation completed: ${successCount} successful, ${errors.length} failed`);
  
  if (errors.length > 0) {
    console.warn('Failed downloads:', errors);
  }

  if (successCount === 0) {
    throw new Error('No images could be downloaded for ZIP creation');
  }

  return zip.generate();
}

/**
 * Download a ZIP file containing multiple images
 */
export async function downloadImagesAsZip(
  imageUrls: string[],
  filename: string = 'images.zip'
): Promise<void> {
  if (!imageUrls || imageUrls.length === 0) {
    throw new Error('No image URLs provided');
  }

  try {
    console.log(`Starting ZIP download for ${imageUrls.length} images...`);
    const baseName = filename.replace('.zip', '');
    const zipData = await createZipFromImages(imageUrls, baseName);
    
    console.log(`ZIP created successfully, size: ${zipData.byteLength} bytes`);
    
    // Create download link
    const blob = new Blob([zipData], { 
      type: 'application/zip' 
    });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`ZIP download initiated: ${filename}`);
    
    // Clean up after a delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
      console.log('ZIP blob URL cleaned up');
    }, 1000);
    
  } catch (error) {
    console.error('Failed to create/download ZIP:', error);
    throw error;
  }
}