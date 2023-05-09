import { createLogger } from '@libs/logger';
import Jimp from 'jimp';

const logger = createLogger('processImage');

async function processImage(fileContent: Buffer): Promise<Buffer> {
  try {
    logger.info("Starting processing file ...");
    // Read the image using Jimp
    const image = await Jimp.read(fileContent);

    logger.info("Resize and crop the image ...");

    // Resize the image
    image.resize(300, Jimp.AUTO);

    // Crop the image to a desired size
    image.crop(10, 10, 280, 280);

    logger.info("Convert the image to greyscale ...");

    // Get the processed image buffer
    const processedImage = await image.getBufferAsync(Jimp.MIME_JPEG);

    logger.info("Return the processed image ...");

    return processedImage;
  } catch (error: any) {
    logger.error("Error when processing image ...", error.message);
    return null
  }
}

export { processImage };
