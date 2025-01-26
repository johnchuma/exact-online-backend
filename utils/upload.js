const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure the destination directory exists
const uploadDir = "./files/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files to './files/' directory
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to prevent overwriting
  },
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
console.log("File MIME type:", file.mimetype); // Log MIME type

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    console.log("File accepted:", file.originalname); // Log if file is accepted
    cb(null, true); // Accept the file
  } else {
    console.log("File rejected:", file.originalname); // Log if file is rejected
    cb(new Error("Unsupported file type"), false); // Reject the file
  }
};

// Set up multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB size limit
});

module.exports = upload;
