import { createLogger } from '@libs/logger';
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand, 
  ListObjectsCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region    =   process.env.REGION || 'us-east-1';
const s3        =   new S3Client({ region });
const logger    =   createLogger('s3-logger');

/**
 * 
 * @param bucket 
 * @param key 
 * @param fileContent 
 * @returns 
 * @description Function to upload a file to an S3 bucket
 */
async function uploadFile(Bucket: string, Key: string, fileContent: Buffer): Promise<void> {
  try {
    logger.info("Upload File start");
    const uploadParams = {
      Bucket,
      Key,
      Body: fileContent
    };
    await s3.send(new PutObjectCommand(uploadParams));
    logger.info("Upload File success...");
  } catch (error: any) {
    logger.error("Upload error ...", error.message);
    return null;
  }
}

/**
 * 
 * @param bucket 
 * @param key 
 * @param expiresIn 
 * @returns 
 * @description Function to generate a pre-signed URL for an S3 object
 */
async function generatePresignedUrl(Bucket: string, Key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new PutObjectCommand({
        Bucket,
        Key
    });
    const url = await getSignedUrl(s3, command, {
        expiresIn
    });
    return url;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * 
 * @param Bucket 
 * @param Key 
 * @param expiresIn 
 * @returns 
 */
async function generateSignedUrl(Bucket: string, Key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket,
        Key
      });
      
      const signedUrl = await getSignedUrl(s3, command, {
        expiresIn // Time in seconds until the URL expires
      });
    
      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
}

async function removeFileFromS3(Bucket: string, Key: string): Promise<Boolean> {
  try {
    const params = {
      Bucket,
      Key
    };
    await s3.send(new DeleteObjectCommand(params));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * 
 * @param Bucket 
 * @returns 
 */
async function listFilesFromS3(Bucket: string, Prefix: string = ''): Promise<any> {
  try {
    const params = {
      Bucket,
      Prefix,
      Delimiter: '/'
    };
    const data = await s3.send(new ListObjectsCommand(params));
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export { 
  uploadFile, 
  listFilesFromS3,
  removeFileFromS3, 
  generateSignedUrl, 
  generatePresignedUrl
};
