const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_TRANSPORT_SERVICE,
  auth: {
    user: process.env.MAIL_TRANSPORT_USER,
    pass: process.env.MAIL_TRANSPORT_PASS,
  },
});

const sendEmail = ({ from, to, subject, html }) => {
  return transporter.sendMail({ from, to, subject, html });
};

module.exports = {
  sendEmail,
};
