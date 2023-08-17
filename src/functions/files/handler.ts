import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

import { 
  generatePresignedUrl, 
  generateSignedUrl, 
  removeFileFromS3
} from 'src/services/s3Helper';
import { formatJSONResponse } from '@libs/api-gateway';
import { createLogger } from '@libs/logger';

// Set the default bucket name for uploading files to S3
const bucketName = process.env.UPLOADER_S3_BUCKET || 'uploader-s3-bucket';

// Create a logger instance for logging
const logger = createLogger('mediaProcessor');

// Define the structure of the expected request body
interface FileRequest {
  name : string;
}

// Define the Lambda function that generates a signed URL for file upload
export const getPresignedUrl = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Log the start of generating a signed URL
    logger.info('Generating presigned URL', { body : event.body });

    // Parse the request body to extract the file name
    const request : FileRequest = event.body;

    // Create a key for the S3 object using the file name
    const { name } = request;

     // Log the file name being processed
    logger.info('Generating presigned URL', { name });

    const key = `media/${name}`;

    // Generate a signed URL for uploading the file to S3
    const uploadURL = await generatePresignedUrl(bucketName, key);

    // Log the generated signed URL
    logger.info('Presigned URL generated', { uploadURL });

    // Return a JSON response with the generated signed URL
    return formatJSONResponse({
      uploadURL
    }); 

  } catch (error) {
    // If an error occurs, return an error JSON response
    return formatJSONResponse({
      message : error.message
    }, 500); 
  }
})

export const getSignedUrl = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => { 
  try {

    logger.info('Generating signed URL', { body : event.body });

    const request : FileRequest = event.body;
    const { name } = request;

    logger.info('Generating signed URL', { name });

    const key = `media/${name}`;

    const fileUrl = await generateSignedUrl(bucketName, key);
    logger.info('Signed URL generated', { fileUrl });

    return formatJSONResponse({
      fileUrl
    }); 

  } catch (error) {
    return formatJSONResponse({
      message : error.message
    }, 500);
  }
})

export const removeFile = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => { 
  try {
    const name = event.pathParameters.name;

    logger.info('Remove file with name', { name });

    const key = `media/${name}`;

    const isRemoved = await removeFileFromS3(bucketName, key);

    if (!isRemoved) {
      throw new Error("Trying to remove a file that does not exist");
    }

    return formatJSONResponse({
      message : `File ${name} removed`
    }); 

  } catch (error) {
    return formatJSONResponse({
      message : error.message
    }, 500);
  }
})

