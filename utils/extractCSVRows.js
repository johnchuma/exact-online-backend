const fs = require("fs");
const csv = require("csv-parser");

const extractCSVRows = (req) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        let newRow = {};
        const keys = Object.keys(row).filter((item) => item != "");
        const values = Object.values(row).filter((item) => item != "");
        values
          .filter((item) => item.length > 0)
          .forEach((item, index) => {
            newRow[keys[index]] = values[index];
          });
        rows.push(newRow);
      })
      .on("end", () => {
        resolve(rows.filter((item) => Object.values(item).length > 0)); // Resolve the Promise with the rows
      })
      .on("error", (error) => {
        reject(error); // Reject the Promise if there's an error
      });
  });
};

module.exports = { extractCSVRows };
