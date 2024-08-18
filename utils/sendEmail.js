const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  // create transporter (service that will send emails like gmail...)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // define email options(like: from, to, subject, body)
  const mailOpts = {
    from: "E-shop App <emaily_gamal@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendMail;
