const cloudinary = require('cloudinary');
const { multerInstance } = require('../config/fileStorage');
const fs = require('fs');

module.exports = async (req, control, folderPath) => {
  const upload = multerInstance.single(control);
  return new Promise((resolve, reject) => {
    upload(req, null, async function(err) {
      // Check if file is found
      if (!req.file) {
        reject('No image found');
        return;
      }
      // Check if file is jpg or png only
      if (!imageMimeTypes.includes(req.file.mimetype)) {
        reject('Incorrect mimetype');
        return;
      }
      const path = req.file.path;
      const uniqueFilename = new Date().toISOString();
      console.log(uniqueFilename);
      try {
        const imageData = await uploadToCloudinary(
          path,
          folderPath,
          uniqueFilename
        );
        // remove file from server
        fs.unlinkSync(path);
        resolve(imageData);
      } catch (err) {
        reject(err);
      }
    });
  });
};

const imageMimeTypes = ['image/jpeg', 'image/png'];

function uploadToCloudinary(path, folderPath, uniqueFilename) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      path,
      { public_id: `${folderPath}/${uniqueFilename}` },
      function(err, image) {
        if (err) return reject(err);
        return resolve(image);
      }
    );
  });
}
