const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const required = ['SMTP_HOST', 'SMTP_PORT', 'REPORT_TO'];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Missing email configuration: ${missing.join(', ')}`);
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');
const reportFiles = [
  path.join(projectRoot, 'reports', 'html', 'index.html'),
  path.join(projectRoot, 'reports', 'results.json'),
  path.join(projectRoot, 'reports', 'results.xml'),
].filter(fs.existsSync);

if (reportFiles.length === 0) {
  console.error('No test report files found. Run the Playwright tests first.');
  process.exit(1);
}

const smtpOptions = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
};

if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
  smtpOptions.auth = {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  };
}

const transporter = nodemailer.createTransport(smtpOptions);

transporter.sendMail({
  from: process.env.REPORT_FROM || process.env.SMTP_USER,
  to: process.env.REPORT_TO,
  subject: process.env.REPORT_SUBJECT || 'Playwright test report',
  text: 'The Playwright test report is attached.',
  attachments: reportFiles.map((file) => ({
    filename: path.basename(file),
    path: file,
  })),
}).then(() => {
  console.log(`Report sent to ${process.env.REPORT_TO}`);
}).catch((error) => {
  console.error('Unable to send report:', error.message);
  process.exit(1);
});
