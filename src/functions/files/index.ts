import { handlerPath } from '@libs/handler-resolver';
import schema from './schema';

const bucketName = process.env.UPLOADER_S3_BUCKET || 'uploader-s3-bucket';

export const mediaProcessor =  {
  handler: `${handlerPath(__dirname)}/handler.mediaProcessor`,
  events: [
    {
      s3: {
        bucket: bucketName,
        existing: true,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'input/'
          }
        ]
      }
    }
  ],
  memorySize: 512,
  timeout: 120
};

export const getPresignedUrl =  {
  handler: `${handlerPath(__dirname)}/handler.getPresignedUrl`,
  events: [
    {
      http: {
        method: 'post',
        path: 'generate-presigned-url',
        request: {
          schemas: {
            'application/json': schema
          }
        },
        cors: true
      }
    }
  ]
};

export const getSignedUrl =  {
  handler: `${handlerPath(__dirname)}/handler.getSignedUrl`,
  events: [
    {
      http: {
        method: 'post',
        path: 'get-signed-url',
        request: {
          schemas: {
            'application/json': schema
          }
        },
        cors: true
      }
    }
  ]
};


