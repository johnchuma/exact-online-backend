const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const generatePDF = async ({ url }) => {
  const baseUrl = "https://kwanza-contracts.vercel.app";
  //   const baseUrl = "http://localhost:3000"
  const templateUrl = `${baseUrl}/${url}`;
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(templateUrl, { waitUntil: "networkidle0" });
    const margins = { top: 50, bottom: 50, right: 50, left: 50 };
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: margins,
      printBackground: true,
    });
    await browser.close();
    const rootDir = path.resolve(__dirname, "../");
    const fileName = `${Date.now()}.pdf`;
    const filePath = path.join(rootDir, "files", fileName);
    const filesDir = path.join(rootDir, "files");
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir, { recursive: true });
    }
    fs.writeFileSync(filePath, pdfBuffer);
    const pdfUrl = `https://api.kwanza.io/files/${fileName}`;
    return pdfUrl;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { generatePDF };
