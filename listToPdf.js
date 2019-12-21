const fs = require('fs').promises;
const ejs = require('ejs');
const path = require('path');
const convertHTMLToPDF = require('pdf-puppeteer');
const sharp = require('sharp');
const { chunk } = require('lodash');
const { PDFDocument } = require('pdf-lib');
const sade = require('sade');

const template = `<!doctype html>
<style>
  @page { margin: 1.5cm; }
  body { --margin: 1.6cm; width: calc(29.7cm - var(--margin) * 2); height: calc(21cm - var(--margin) * 2); }
  * { margin: 0; padding: 0; font-family: "Lucida Calligraphy"; }
  .list { list-style: none; display: grid; grid-template-columns: repeat(4, 6.1706cm); grid-template-rows: repeat(2, 8.5919cm); margin: 0.1cm; }
  .list img { width: 100%; height: calc(100% - 50px); object-fit: cover; object-position: 50% 0; }
  .list.gray img { filter: grayscale(100%); }
  .list p { height: 50px; text-align: center; line-height: 20px; font-size: 10pt; }
  .list.debug { outline: 1px solid black; }
  .list.debug img { border: 1px solid black; }
  .list li { outline: 1px solid black; padding: 5px; }
  .pagebreak { page-break-before: always; }
</style>
<ul class="list"><% for (const { name, role, img } of characters) { %>
  <li><img src="data:image/webp;base64,<%= img %>"><p><%= name %><br><%= role %></p></li>
<% } %></ul>`;

async function generatePDF(html) {
  return new Promise((resolve) => {
    convertHTMLToPDF(html, resolve, {
      landscape: true,
      format: 'A4',
    });
  });
}

async function imgToBase64(path) {
  const inputBuffer = await fs.readFile(path);
  const outputBuffer = await sharp(inputBuffer).resize(500).flatten({ background: { r: 255, g: 255, b: 255, }}).removeAlpha().webp().toBuffer();
  return Buffer.from(outputBuffer).toString('base64');
}

async function main({ directory, pdfOutput }) {
  function join(...rest) {
    return path.join(directory || '.', ...rest);
  }

  const npcsCSV = await fs.readFile(join('npcs.csv'), { encoding: 'utf-8' });
  const npcs = await Promise.all(npcsCSV.replace(/\r/g, '').split('\n').map(async (line) => {
    const [name, role] = line.split(';');
    return { name, role, img: await imgToBase64(join(`img/${name.toLowerCase().replace(/\s/g, '_')}.png`)) };
  }));

  const pdfs = await Promise.all(
    chunk(npcs, 8).map(async (characters) => {
      const html = await ejs.render(template, {
        characters,
      }, {
        async: true,
      });
      return generatePDF(html);
    })
  );

  const pdfDoc = await PDFDocument.create();
  for (const pdf of pdfs) {
    const tmpPdfDoc = await PDFDocument.load(pdf);
    const [page] = await pdfDoc.copyPages(tmpPdfDoc, [0]);
    pdfDoc.addPage(page);
  }
  
  await fs.writeFile(pdfOutput || join('npcCards.pdf'), await pdfDoc.save());
}

const prog = sade('dnd5cards [dir]', true);

prog
  .version('1.0.0')
  .option('-o, --output', 'Output pdf file')
  .action((directory, opts) => {
    main({
      directory,
      pdfOutput: opts.o,
    }).catch(console.error);
  })
  .parse(process.argv);
