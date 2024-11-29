const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text,isHtmlFormat) => {
  const msg = { from: config.email.from, to, subject,  ...(isHtmlFormat ? { html: text } : { text: text })};  
  await transport.sendMail(msg);
};

/**
 * Send contact us form to support
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const contactUsFormEmail = async ({name,phone,email,message,principal ,url}) => {
  const subject = 'Fantasy Support!';

  const text = `<div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">

          <h2 style="color: #333;">Fantasy Extreme Support Request</h2>
        <p style="color: #333;">You have received a new message from the Contact Us form.</p>

  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Phone:</strong> ${phone}</p>
  <p><strong>Principal:</strong> ${principal}</p>


  <p><strong>Message:</strong> ${message}</p>
</div>`;
  await sendEmail(config.email.from, subject, text,true);
};
module.exports = {
  transport,
  contactUsFormEmail
};
