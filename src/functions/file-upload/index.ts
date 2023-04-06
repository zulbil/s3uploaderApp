import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.mediaProcessor`,
  events: [
    {
      s3: {
        bucket: 'media-s3-bucket',
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
