import { createLogger } from '@libs/logger';
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand, 
  HeadObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region    =   process.env.REGION || 'us-east-1';
const s3        =   new S3Client({ region });
const logger    =   createLogger('s3-logger');

/**
 * 
 * @param Bucket 
 * @param Key 
 * @returns 
 * @description Function to check if a file exists in S3
 */
async function checkFileExists(Bucket: string, Key: string): Promise<Boolean> {
  try {
    const headParams = {
      Bucket,
      Key
    };

    await s3.send(new HeadObjectCommand(headParams));
    return true;
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
}

/**
 * Generates a pre-signed URL for an S3 object
 * 
 * @param Bucket - The name of the S3 bucket
 * @param Key - The object key (path) within the bucket
 * @param expiresIn - Optional parameter specifying the URL's expiration time in seconds (default is 3600 seconds)
 * @returns A promise that resolves to the generated pre-signed URL or null if an error occurs
 */
async function generatePresignedUrl(Bucket: string, Key: string, expiresIn: number = 3600): Promise<string | null> {
  try {
    // Create a PutObjectCommand to represent uploading the object
    const command = new PutObjectCommand({
      Bucket,
      Key
    });

    // Generate a pre-signed URL with a specific expiration time
    const url = await getSignedUrl(s3, command, {
      expiresIn
    });

    return url; // Return the generated pre-signed URL
  } catch (error) {
    console.log(error); // Log any errors that occur
    return null; // Return null if an error occurs
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
      const exists = await checkFileExists(Bucket, Key)
      if (!exists) {
        throw new Error("Trying to generate a signed url for a file that does not exist");
      }
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
    const exists = await checkFileExists(Bucket, Key)
    if (!exists) {
      throw new Error("Trying to remove a file that does not exist");
    }
    const params = {
      Bucket,
      Key
    };
    await s3.send(new DeleteObjectCommand(params));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export { 
  removeFileFromS3, 
  generateSignedUrl, 
  generatePresignedUrl
};
