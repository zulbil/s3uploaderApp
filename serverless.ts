import type { AWS } from '@serverless/typescript';

import { removeFile, getSignedUrl, getPresignedUrl, getFiles } from '@functions/files';

const serverlessConfiguration: AWS = {
  service: 's3uploaderapp',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      UPLOADER_S3_BUCKET: process.env.UPLOADER_S3_BUCKET ||'uploader-s3-bucket',
      REGION: 'us-east-1'
    }
  },
  // import the function via paths
  functions: {
    removeFile : {
      ...removeFile,
      role: 'S3BucketAccessRole'
    },
    getSignedUrl : {
      ...getSignedUrl,
      role: 'S3BucketAccessRole'
    },
    getPresignedUrl : {
      ...getPresignedUrl,
      role: 'S3BucketAccessRole'
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      UploaderS3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:provider.environment.UPLOADER_S3_BUCKET}',
          CorsConfiguration : {
            CorsRules : [
              {
                AllowedOrigins: ['*'],
                AllowedHeaders: ['*'],
                AllowedMethods: [
                  'GET',
                  'PUT',
                  'POST',
                  'DELETE',
                  'HEAD'
                ],
                MaxAge: 3000
              }
            ]
          },
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
            IgnorePublicAcls: true,
            BlockPublicPolicy: true,
            RestrictPublicBuckets: true
          }
        }
      },
      S3BucketAccessRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: 'S3BucketAccessRole',
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com',
                },
                Action: 'sts:AssumeRole'
              }
            ]
          },
          Policies: [
            {
              PolicyName: 'MediaProcessorPolicy',
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
                    Resource: [
                      'arn:aws:s3:::${self:provider.environment.UPLOADER_S3_BUCKET}/*',
                    ],
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "logs:CreateLogGroup",
                      "logs:CreateLogStream",
                      "logs:PutLogEvents"
                    ],
                    Resource: ["arn:aws:logs:*:*:*"]
                }
                ]
              }
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
