import { S3 } from 'aws-sdk';
import Jimp from 'jimp';
// import ffmpeg from 'fluent-ffmpeg';
// import { Writable } from 'stream';

const s3 = new S3();

async function processImage(fileContent: Buffer): Promise<Buffer> {
  // Read the image using Jimp
  const image = await Jimp.read(fileContent);

  // Resize the image
  image.resize(300, Jimp.AUTO);

  // Add a watermark to the image
  const watermark = await Jimp.read('path/to/your/watermark.png');
  image.composite(watermark, image.getWidth() - watermark.getWidth() - 10, image.getHeight() - watermark.getHeight() - 10);

  // Crop the image to a desired size
  image.crop(10, 10, 280, 280);

  // Get the processed image buffer
  const processedImage = await image.getBufferAsync(Jimp.MIME_JPEG);

  return processedImage;
}

async function processVideo(fileContent: Buffer): Promise<void> {
  // Video processing logic goes here
  // For example, transcode the video using the 'fluent-ffmpeg' library
  // const transcodedVideo = await new Promise<Buffer>((resolve, reject) => {
  //   ffmpeg(fileContent)
  //     .outputFormat('mp4')
  //     .outputOptions('-vf', 'scale=1280:720')
  //     .on('end', () => console.log('Video transcoding completed'))
  //     .on('error', (error) => reject(error))
  //     .pipe(
  //       new Writable({
  //         write(chunk: any, _encoding: string, callback: (error?: Error) => void) {
  //           resolve(chunk);
  //           callback();
  //         },
  //       })
  //     );
  // });

  // Upload the transcoded video back to the S3 bucket
  // const uploadParams = {
  //   Bucket: 'your-bucket-name',
  //   Key: 'output/transcoded-video.mp4',
  //   Body: transcodedVideo,
  // };
  // await s3.putObject(uploadParams).promise();
}

export { processImage, processVideo };
