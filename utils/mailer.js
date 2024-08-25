const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8d917b39541f2e",
    pass: "e79ec48f43e968",
  },
});

module.exports = transport;
