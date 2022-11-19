const fs = require("fs");
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('./public/folders/')) {
      fs.mkdirSync('./public/folders/')
    }
    cb(null, `./public/folders/`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});

// const limits = {
//   fileSize: 1024 * 1024 * 5
// };

const upload = multer({ storage: storage, fileFilter: function (req, file, callback) {
  var ext = path.extname(file.originalname);
  // image only 
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.svg' && ext !== '.webp' && ext !== '.mp4' && ext !== '.flv' && ext !== '.m3u8' && ext !== '.wav' && ext !== '.mp3' && ext !== '.mp4' && ext !== '.m4a' && ext !== '.aac' ) {
    return callback(new Error('Only images and videos are allowed'))
  }
  callback(null, true)
}}) 
module.exports = upload;
