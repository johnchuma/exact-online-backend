const nodemailer = require("nodemailer");
require("dotenv").config();
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmail SMTP server
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Add this line
  },
});
const sendOTPEmail = ({ to, username, otp, subject }) => {
  try {
    const templatePath = path.join(__dirname, "otp.ejs");
    const emailParams = {
      from: "Kwanza",
      to: to,
      subject: subject,
      html: ejs.render(fs.readFileSync(templatePath, "utf8"), {
        email: to,
        otp: otp,
        name: username,
      }),
    };
    const response = transporter.sendMail(emailParams);
    return response;
  } catch (error) {
    console.log(error);
  }
};
const sendGetStartedEmail = ({ to, subject }) => {
  try {
    const templatePath = path.join(__dirname, "getStarted.ejs");
    const emailParams = {
      from: "Kwanza",
      to: to,
      subject: subject,
      html: ejs.render(fs.readFileSync(templatePath, "utf8"), {
        email: to,
      }),
    };
    const response = transporter.sendMail(emailParams);
    return response;
  } catch (error) {
    console.log(error);
  }
};
const sendContractEmailToInfluencer = ({ to, subject, pdfUrl }) => {
  try {
    const templatePath = path.join(__dirname, "influencerContract.ejs");
    const emailParams = {
      from: "Kwanza",
      to,
      subject,
      html: ejs.render(fs.readFileSync(templatePath, "utf8"), {
        email: to,
        pdfUrl,
      }),
    };
    const response = transporter.sendMail(emailParams);
    return response;
  } catch (error) {
    console.log(error);
  }
};
const sendContractEmailToAdmin = ({ to, subject, influencer, pdfUrl }) => {
  try {
    const templatePath = path.join(__dirname, "contractFeedbackForAdmin.ejs");
    const emailParams = {
      from: "Kwanza",
      to,
      subject,
      html: ejs.render(fs.readFileSync(templatePath, "utf8"), {
        email: to,
        influencer,
        pdfUrl,
      }),
    };
    const response = transporter.sendMail(emailParams);
    return response;
  } catch (error) {
    console.log(error);
  }
};
const sendMail = ({ user, to, subject, message, status }) => {
  try {
    const templatePath = path.join(__dirname, "email_template.ejs");
    const emailParams = {
      from: "Kwanza",
      to: to || user.email,
      subject: subject,
      html: ejs.render(fs.readFileSync(templatePath, "utf8"), {
        subject: subject,
        message: message,
      }),
    };
    const response = transporter.sendMail(emailParams);
    return response;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  sendMail,
  sendOTPEmail,
  sendContractEmailToInfluencer,
  sendContractEmailToAdmin,
  sendGetStartedEmail,
};
