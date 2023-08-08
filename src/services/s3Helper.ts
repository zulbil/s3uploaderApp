import { createLogger } from '@libs/logger';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region    =   process.env.REGION || 'us-east-1';
const s3        =   new S3Client({ region });
const logger    =   createLogger('s3-logger');


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

export { generatePresignedUrl, generateSignedUrl, removeFileFromS3 };
