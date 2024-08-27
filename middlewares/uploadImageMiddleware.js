const multer = require("multer");
const ApiError = require("../utils/apiError");


const multerOptions =()=>{
    //1- Disk Storage engine
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     // category-${id}-Date.now()-$jpeg
//     const extention = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.-${extention}`;
//     cb(null, filename);
//   },
// });

  const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images is allowed", 400), false);
    console.log(file.mimetype);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
return upload;
}

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName)

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields)
