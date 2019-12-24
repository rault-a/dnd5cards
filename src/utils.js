const convertHTMLToPDF = require('pdf-puppeteer');
const sharp = require('sharp');
const { PDFDocument } = require('pdf-lib');

async function generatePDF(html) {
  return new Promise((resolve) => {
    convertHTMLToPDF(html, resolve, {
      landscape: true,
      format: 'A4',
    }, {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });
}

function b64ToBuffer(str) {
  return Buffer.from(str.replace(/^data:image\/[^;]+;base64,/, ''), 'base64');
}

async function imgToBase64(img) {
  const inputBuffer = b64ToBuffer(img);
  const outputBuffer = await sharp(inputBuffer).resize(500).flatten({ background: { r: 255, g: 255, b: 255, }}).removeAlpha().webp().toBuffer();
  return 'data:image/webp;base64,' + Buffer.from(outputBuffer).toString('base64');
}

async function mergePDFs(pdfs) {
  const pdfDoc = await PDFDocument.create();
  for (const pdf of pdfs) {
    const tmpPdfDoc = await PDFDocument.load(pdf);
    const [page] = await pdfDoc.copyPages(tmpPdfDoc, [0]);
    pdfDoc.addPage(page);
  }

  return pdfDoc.save();
}

module.exports = {
  generatePDF,
  imgToBase64,
  mergePDFs,
};
