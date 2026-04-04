import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (base64OrBuffer, folder = 'quickhire', resourceType = 'auto') => {
  try {
    let result;
    if (Buffer.isBuffer(base64OrBuffer)) {
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, resource_type: resourceType },
          (err, res) => {
            if (err) return reject(err);
            resolve(res);
          }
        );
        uploadStream.end(base64OrBuffer);
      });
    } else {
      result = await cloudinary.uploader.upload(base64OrBuffer, { folder, resource_type: resourceType });
    }
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};
