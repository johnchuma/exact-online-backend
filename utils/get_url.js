const path = require("path");

const getUrl = async (req) => {
  const file = req.file;
  if (file) {
    return `https://api.exactonline.co.tz/files/${file.originalname}`;
  }
  return null;
};

module.exports = { getUrl };
