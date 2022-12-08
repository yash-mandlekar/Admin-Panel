const fs = require("fs");
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('./public/shorts/')) {
      fs.mkdirSync('./public/shorts/')
    }
    cb(null, `./public/shorts/`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});

const limits = {
  //set file limt to 12mb
  fileSize: 1024 * 1024 * 1024
};

const UploadShorts = multer({ storage: storage, limits:limits, fileFilter: function (req, file, callback) {
  var ext = path.extname(file.originalname);
  // video only
    if (ext !== '.mp4' && ext !== '.flv' && ext !== '.m3u8' && ext !== '.wav' && ext !== '.mp3' && ext !== '.mp4' && ext !== '.m4a' && ext !== '.aac' ) {
    return callback(new Error('Only videos are allowed'))
    }
  callback(null, true)
}}) 
module.exports = UploadShorts;
