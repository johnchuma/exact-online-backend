const path = require("path");

const getUrl = async (req) => {
  const file = req.file;
  return `http://192.168.1.182:5000/files/${file.originalname}`;
};

module.exports = { getUrl };
