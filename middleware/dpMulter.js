const fs = require("fs");
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('./public/profilePics/')) {
      fs.mkdirSync('./public/profilePics/')
    }
    cb(null, `./public/profilePics/`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});
const uploadDp = multer({ storage: storage , fileFilter: function (req, file, callback) {
  var ext = path.extname(file.originalname);
  // image only 
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.svg' && ext !== '.webp'  ) {
    return callback(new Error('Only images are allowed'))
  }
  callback(null, true)
}}) 
module.exports = uploadDp;
