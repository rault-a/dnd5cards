import convertHTMLToPDF from 'pdf-puppeteer';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

export async function generatePDF(html: string): Promise<Buffer> {
  return new Promise((resolve) => {
    convertHTMLToPDF(html, resolve, {
      landscape: true,
      format: 'A4',
    }, {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });
}

function b64ToBuffer(str: string): Buffer {
  return Buffer.from(str.replace(/^data:image\/[^;]+;base64,/, ''), 'base64');
}

export async function imgToBase64(img: string): Promise<string> {
  const inputBuffer = b64ToBuffer(img);
  const outputBuffer = await sharp(inputBuffer).resize(500).flatten({ background: { r: 255, g: 255, b: 255, }}).removeAlpha().webp().toBuffer();
  return 'data:image/webp;base64,' + Buffer.from(outputBuffer).toString('base64');
}

export async function mergePDFs(pdfs: Buffer[]): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  for (const pdf of pdfs) {
    const tmpPdfDoc = await PDFDocument.load(pdf);
    const [page] = await pdfDoc.copyPages(tmpPdfDoc, [0]);
    pdfDoc.addPage(page);
  }

  return Buffer.from(await pdfDoc.save());
}
