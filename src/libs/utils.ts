
/**
 * 
 * @param buffer 
 * @returns 
 * @description check if the file is an image
 */
function isImage(buffer: Buffer): boolean {
    const mimeType = buffer.toString('hex', 0, 4);

    switch (mimeType) {
        case '89504e47': // PNG
        case '47494638': // GIF
        case 'ffd8ffe0': // JPG, JFIF encoding
        case 'ffd8ffe1': // JPG, Exif encoding
        case 'ffd8ffe2': // JPG, Adobe encoding
        case 'ffd8ffe3': // JPG, Samsung encoding
        case 'ffd8ffe8': // JPG, SPIFF encoding
            return true;
        default:
            return false;
    }
}

export { isImage }
  