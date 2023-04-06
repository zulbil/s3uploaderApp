import { S3Handler, S3Event } from 'aws-lambda';
import { getFile } from 'src/services/s3Helper';
//import { middyfy } from '@libs/lambda';

import { processImage } from 'src/services/mediaProcessor';
import { isImage } from '@libs/utils';

export const mediaProcessor: S3Handler = async (event: S3Event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    const fileContent = await getFile(bucket, key);

    if (isImage(fileContent)) {
      await processImage(fileContent);
    }
  }
};

// export const main = middyfy(mediaProcessor);
