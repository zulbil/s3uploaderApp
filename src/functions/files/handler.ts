import { S3Handler, S3Event, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

import { processImage } from 'src/services/mediaProcessor';
import { getFile, generatePresignedUrl, generateSignedUrl } from 'src/services/s3Helper';
import { isImage } from '@libs/utils';
import { formatJSONResponse } from '@libs/api-gateway';
import { createLogger } from '@libs/logger';

const bucketName = process.env.UPLOADER_S3_BUCKET || 'uploader-s3-bucket';
const logger = createLogger('mediaProcessor');


export const mediaProcessor: S3Handler = async (event: S3Event) => {
  logger.info('Processing S3 event', { event });
  try {
    for (const record of event.Records) {
      logger.info('Processing S3 record', { record });
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
  
      const fileContent = await getFile(bucket, key);
      logger.info('Processing S3 file', { fileContent: JSON.parse(fileContent.toString()) });
  
      if (isImage(fileContent)) {
        await processImage(fileContent);
      }
    }
    return formatJSONResponse({
      'message': 'Image processed successfully'
    });
  } catch (error) {
    return formatJSONResponse({
      message : error.message
    }, 500); 
  }
  
};


export const getPresignedUrl = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logger.info('Generating presigned URL', { body : event.body });

    const name = event.body?.name;
    logger.info('Generating presigned URL', { name });

    const key = `input/${name}`;

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

    const key = `input/${name}`;

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
