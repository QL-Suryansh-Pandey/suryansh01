const { chromium } = require('@playwright/test');

async function renderPdf(htmlPath, pdfPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`);
  await page.pdf({ path: pdfPath, printBackground: true, format: 'A4' });
  await browser.close();
}

module.exports = { renderPdf };
