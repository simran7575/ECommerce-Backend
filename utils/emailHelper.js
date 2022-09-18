const nodemailer = require("nodemailer");

exports.mailHelper = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: "simranbedi7575@gmail.com",
      pass: "ecvkmrwhmonfukqq",
    },
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    // auth: {
    //   user: process.env.SMTP_USER, // generated ethereal user
    //   pass: process.env.SMTP_PASS, // generated ethereal password
    // },
  });

  const message = {
    from: "simranbedi7575@gmail.com", // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };

  await transporter.sendMail(message);
};
