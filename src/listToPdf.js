const ejs = require('ejs');
const { chunk } = require('lodash');
const { imgToBase64, mergePDFs, generatePDF } = require('./utils');
const { template } = require('./template');

async function listToPdf(body) {
  const npcs = await Promise.all(
    body.map(async ({ name, role, image }) => {
      return { name, role, img: await imgToBase64(image) };
    }),
  );

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
  
  return Buffer.from(await mergePDFs(pdfs));
}

module.exports = {
  listToPdf,
};