import { handlerPath } from '@libs/handler-resolver';

const bucketName = process.env.UPLOADER_S3_BUCKET || 'uploader-s3-bucket';
export default {
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
};
