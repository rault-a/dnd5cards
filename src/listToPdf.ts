import ejs from 'ejs';
import { chunk } from 'lodash';
import { imgToBase64, mergePDFs, generatePDF } from './utils';
import { template } from './template';

export type NPCData = {
  name: string;
  role: string;
  image: string;
};

export async function listToPdf(body: NPCData[]) {
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
  
  return mergePDFs(pdfs);
}
