const cloudinary = require('cloudinary');
const { multerInstance } = require('../config/fileStorage');
const fs = require('fs');

module.exports = async (req, control, folderPath) => {
  const upload = multerInstance.single(control);
  return new Promise((resolve, reject) => {
    upload(req, null, async function(err) {
      if (err) {
        reject(err);
      }

      const path = req.file.path;
      const uniqueFilename = new Date().toISOString();

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

function uploadToCloudinary(path, folderPath, uniqueFilename) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      path,
      { public_id: `${folderPath}/${uniqueFilename}`, tags: `blog` },
      function(err, image) {
        if (err) return reject(err);
        return resolve(image);
      }
    );
  });
}
