import { handlerPath } from '@libs/handler-resolver';
import schema from './schema';

export const getFiles =  {
  handler: `${handlerPath(__dirname)}/handler.getFiles`,
  events: [
    {
      http: {
        method: 'get',
        path: 'files',
        cors: true
      }
    }
  ]
};

export const getPresignedUrl =  {
  handler: `${handlerPath(__dirname)}/handler.getPresignedUrl`,
  events: [
    {
      http: {
        method: 'post',
        path: 'files/upload-url',
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
        method: 'post',
        path: 'files/remove-file',
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



