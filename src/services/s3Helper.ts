import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3: any = new XAWS.S3({ signatureVersion: 'v4' });


/**
 * 
 * @param bucket 
 * @param key 
 * @param fileContent 
 * @returns 
 * @description Function to upload a file to an S3 bucket
 */
async function uploadFile(bucket: string, key: string, fileContent: Buffer): Promise<void> {
    try {
        const uploadParams = {
            Bucket: bucket,
            Key: key,
            Body: fileContent
        };
        await s3.putObject(uploadParams).promise();
    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * 
 * @param bucket 
 * @param key 
 * @returns 
 * @description Function to retrieve a file from an S3 bucket
 */
async function getFile(bucket: string, key: string): Promise<Buffer> {
    try {
        const params = {
            Bucket: bucket,
            Key: key
        };
        const response = await s3.getObject(params).promise();
        return response.Body as Buffer;
    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * 
 * @param bucket 
 * @param key 
 * @param expiresIn 
 * @returns 
 * @description Function to generate a pre-signed URL for an S3 object
 */
async function generatePresignedUrl(bucket: string, key: string, expiresIn: number = 3600): Promise<string> {
    try {
        const params = {
            Bucket: bucket,
            Key: key,
            Expires: expiresIn
        };
        return s3.getSignedUrlPromise('getObject', params);   
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { uploadFile, getFile, generatePresignedUrl };
