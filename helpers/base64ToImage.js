const fileType = require('file-type');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
module.exports = {
  storeIamgeLocal: async (baseImage, dir) => {
    // Get base64 image
    const realImage = Buffer.from(baseImage, 'base64');
    // get image extinsion from buffer
    const imageExtinsion = (await fileType.fromBuffer(realImage)).ext;

    // generate image name with full path
    const newName = `${uuidv4()}.${imageExtinsion}`;
    return new Promise((resolve, reject) => {
      // check dir if existing or not
      if (!fs.existsSync(dir)) {
        // create dir only if not exist
        fs.mkdirSync(dir);
      }
      // check image if existing or not
      if (!fs.existsSync(dir + newName)) {
        // save image to local path
        fs.writeFileSync(dir + newName, realImage, (err) => {
          if (err) reject(err);
        });
        resolve(newName);
      } else {
        reject({
          success: false,
          error: 'image is existing',
        });
      }
    });
  },
  updateIamgeLocal: async (baseImage, imageName, dir) => {
    // Get base64 image
    const realImage = Buffer.from(baseImage, 'base64');
    // get image extinsion from buffer
    const imageExtinsion = (await fileType.fromBuffer(realImage)).ext;

    // generate image name with full path
    const newName = `${uuidv4()}.${imageExtinsion}`;
    return new Promise((resolve, reject) => {
      // check image if existing or not
      if (fs.existsSync(dir + imageName)) {
        // delete image from local path
        fs.unlinkSync(dir + imageName);
        // save image to local path
        fs.writeFileSync(dir + newName, realImage, (err) => {
          if (err) reject(err);
        });
        resolve(newName);
      } else {
        // save image to local path
        fs.writeFileSync(dir + newName, realImage, (err) => {
          if (err) reject(err);
        });
        resolve(newName);
      }
    });
  },
  deleteIamge: async (logoName, dir) => {
    if (fs.existsSync(dir + logoName)) {
      // delete image from local path
      fs.unlinkSync(dir + logoName);
    }
  },
};
