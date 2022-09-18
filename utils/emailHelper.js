const nodemailer = require("nodemailer");

exports.mailHelper = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_HOST,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    // auth: {
    //   user: process.env.SMTP_USER, // generated ethereal user
    //   pass: process.env.SMTP_PASS, // generated ethereal password
    // },
  });

  const message = {
    from: process.env.SMTP_USER, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };

  await transporter.sendMail(message);
};
