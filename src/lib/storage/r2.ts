import { PutObjectCommand,S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// 创建 R2 客户端的函数，延迟初始化
function createR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
    forcePathStyle: false,
    signatureVersion: 'v4',
    requestHandler: {
      requestTimeout: 60000,
      connectionTimeout: 30000,
    },
  });
}

export interface UploadResult {
  url: string;
  key: string;
}

export async function uploadToR2(
  file: File | Buffer,
  folder?: string,
  filename?: string
): Promise<UploadResult> {
  try {
    const bucketName = process.env.R2_BUCKET_NAME!;
    const publicUrl = process.env.R2_PUBLIC_URL!;
    
    // Validate required environment variables
    if (!process.env.R2_ACCOUNT_ID) {
      throw new Error('R2_ACCOUNT_ID is not set');
    }
    if (!process.env.R2_ACCESS_KEY_ID) {
      throw new Error('R2_ACCESS_KEY_ID is not set');
    }
    if (!process.env.R2_SECRET_ACCESS_KEY) {
      throw new Error('R2_SECRET_ACCESS_KEY is not set');
    }
    if (!bucketName) {
      throw new Error('R2_BUCKET_NAME is not set');
    }
    if (!publicUrl) {
      throw new Error('R2_PUBLIC_URL is not set');
    }
    
    // Generate unique filename if not provided
    const fileExtension = filename ? filename.split('.').pop() : 
      (file instanceof File ? file.name.split('.').pop() : 'bin');
    const uniqueFilename = filename || `${uuidv4()}.${fileExtension}`;
    
    // Create key with optional folder
    const key = folder ? `${folder}/${uniqueFilename}` : uniqueFilename;
    
    // Prepare file buffer
    const buffer = file instanceof File ? 
      Buffer.from(await file.arrayBuffer()) : file;
    
    // Get content type
    const contentType = file instanceof File ? 
      file.type || 'application/octet-stream' : 'application/octet-stream';
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    
    // 每次上传时创建新的客户端
    const r2Client = createR2Client();
    await r2Client.send(command);
    
    // Return public URL
    const url = `${publicUrl}/${key}`;
    
    return { url, key };
  } catch (error) {
    throw error;
  }
}