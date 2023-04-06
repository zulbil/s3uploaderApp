import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import mediaProcessor from '@functions/file-upload';

const serverlessConfiguration: AWS = {
  service: 's3uploaderapp',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      MEDIA_S3_BUCKET: 'media-upload-bucket'
    }
  },
  // import the function via paths
  functions: { 
    hello,
    mediaProcessor
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      'MediaS3Bucket': {
        'Type': 'AWS::S3::Bucket',
        'Properties': {
          'BucketName': '${self:provider.environment.MEDIA_S3_BUCKET}',
          'CorsConfiguration' : {
            'CorsRules' : [
              {
                'AllowedOrigins': ['*'],
                'AllowedHeaders': ['*'],
                'AllowedMethods': [
                  'GET',
                  'PUT',
                  'POST',
                  'DELETE',
                  'HEAD'
                ],
                'MaxAge': 3000
              }
            ]
          }
        }
      },
      'BuckePoliciy': {
        'Type': 'AWS::S3::BucketPolicy',
        'Properties': {
          'PolicyDocument': {
            'Id': 'MyPolicy',
            'Version': "2012-10-17",
            'Statement': [
              {
                "Sid": "PublicReadForGetBucketObjects",
                "Effect": "Allow",
                "Principal": '*',
                "Action": 's3:GetObject',
                "Resource": 'arn:aws:s3:::${self:provider.environment.MEDIA_S3_BUCKET}/*'
              }
            ]
          },
          "Bucket": {
            "Ref": "MediaS3Bucket"
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;