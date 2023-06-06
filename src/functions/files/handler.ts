import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

import { generatePresignedUrl, generateSignedUrl, removeFileFromS3 } from 'src/services/s3Helper';
import { formatJSONResponse } from '@libs/api-gateway';
import { createLogger } from '@libs/logger';

const bucketName = process.env.UPLOADER_S3_BUCKET || 'uploader-s3-bucket';
const logger = createLogger('mediaProcessor');


export const getPresignedUrl = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logger.info('Generating presigned URL', { body : event.body });

    const name = event.body?.name;
    logger.info('Generating presigned URL', { name });

    const key = `${name}`;

    const uploadURL = await generatePresignedUrl(bucketName, key);
    logger.info('Presigned URL generated', { uploadURL });

    return formatJSONResponse({
      uploadURL
    }); 

  } catch (error) {
    return formatJSONResponse({
      message : error.message
    }, 500); 
  }
})

export const getSignedUrl = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => { 
  try {

    logger.info('Generating signed URL', { body : event.body });

    const name = event.body?.name;
    logger.info('Generating signed URL', { name });

    const key = `${name}`;

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

    const name = event.body?.name;

    const key = `${name}`;

    const fileUrl = await removeFileFromS3(bucketName, key);

    return formatJSONResponse({
      message : `File ${name} removed`
    }); 

  } catch (error) {
    return formatJSONResponse({
      message : error.message
    }, 500);
  }
})
