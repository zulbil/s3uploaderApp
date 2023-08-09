import { handlerPath } from '@libs/handler-resolver';
import schema from './schema';

export const getPresignedUrl =  {
  handler: `${handlerPath(__dirname)}/handler.getPresignedUrl`,
  events: [
    {
      http: {
        method: 'post',
        path: 'files/presigned-url',
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
        path: 'files/signed-url',
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

export const removeFile = {
  handler: `${handlerPath(__dirname)}/handler.removeFile`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'files/{name}',
        request: {
          schemas: {
            'application/json': schema
          }
        },
        cors: true
      }
    }
  ]
}



