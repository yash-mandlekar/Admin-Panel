const fs = require("fs");
const multer = require('multer')

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
const upload = multer({ storage: storage })
module.exports = upload;
