const axios = require("axios");
const cheerio = require("cheerio");
const scrapeResults = async (req, res) => {
  try {
   const {url} = req.query;
 
    const { data } = await axios.get(url);
    
    const $ = cheerio.load(data);

    let results = [];
    $("table tr").each((i, row) => {
      const cols = $(row)
        .find("td")
        .map((j, col) => $(col).text().trim())
        .get();
      results.push(cols);
    });
    // clear unused arrays
    let newArrays = [];
    
    results.forEach((item, index) => {
      if (index > 5 && item.length == 5) {
        newArrays.push(item);
      }
    });
    console.log(newArrays)
    res.status(200).send({
      status: true,
      results: newArrays,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};
// const scrapeSchoolsList = async () => {
//   try {
//     const { data } = await axios.get(schoolUrl);
//     const $ = cheerio.load(data);

//     let results = [];
//     $("table tr").each((i, row) => {
//       const cols = $(row)
//         .find("td")
//         .map((j, col) => $(col).text().trim())
//         .get();
//       results.push(cols);
//     });

//     //Merge all results
//     let newList = [];
//     results.forEach((item) => {
//       if (item.length == 3) {
//         newList = [...newList, ...item];
//       }
//     });

//     //remove empty string
//     newList = newList.filter((item) => item != "");
//     // create object for database
//     let payloadList = [];
//     newList.forEach((item) => {
//       let schoolParts = item.split(" ");
//       const payload = {
//         centerNo: schoolParts[0],
//         name: `${item}`.replace(schoolParts[0], "").replace("  ", " ").trim(),
//       };
//       payloadList.push(payload);
//     });

//     return payloadList;
//   } catch (error) {
//     return error;
//   }
// };

module.exports = { scrapeResults };
