"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_puppeteer_1 = __importDefault(require("pdf-puppeteer"));
const sharp_1 = __importDefault(require("sharp"));
const pdf_lib_1 = require("pdf-lib");
async function generatePDF(html) {
    return new Promise((resolve) => {
        pdf_puppeteer_1.default(html, resolve, {
            landscape: true,
            format: 'A4',
        }, {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    });
}
exports.generatePDF = generatePDF;
function b64ToBuffer(str) {
    return Buffer.from(str.replace(/^data:image\/[^;]+;base64,/, ''), 'base64');
}
async function imgToBase64(img) {
    const inputBuffer = b64ToBuffer(img);
    const outputBuffer = await sharp_1.default(inputBuffer).resize(500).flatten({ background: { r: 255, g: 255, b: 255, } }).removeAlpha().webp().toBuffer();
    return 'data:image/webp;base64,' + Buffer.from(outputBuffer).toString('base64');
}
exports.imgToBase64 = imgToBase64;
async function mergePDFs(pdfs) {
    const pdfDoc = await pdf_lib_1.PDFDocument.create();
    for (const pdf of pdfs) {
        const tmpPdfDoc = await pdf_lib_1.PDFDocument.load(pdf);
        const [page] = await pdfDoc.copyPages(tmpPdfDoc, [0]);
        pdfDoc.addPage(page);
    }
    return Buffer.from(await pdfDoc.save());
}
exports.mergePDFs = mergePDFs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrRUFBNkM7QUFDN0Msa0RBQTBCO0FBQzFCLHFDQUFzQztBQUUvQixLQUFLLFVBQVUsV0FBVyxDQUFDLElBQVk7SUFDNUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQzdCLHVCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDOUIsU0FBUyxFQUFFLElBQUk7WUFDZixNQUFNLEVBQUUsSUFBSTtTQUNiLEVBQUU7WUFDRCxJQUFJLEVBQUUsQ0FBQyxjQUFjLEVBQUUsMEJBQTBCLENBQUM7U0FDbkQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBVEQsa0NBU0M7QUFFRCxTQUFTLFdBQVcsQ0FBQyxHQUFXO0lBQzlCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzlFLENBQUM7QUFFTSxLQUFLLFVBQVUsV0FBVyxDQUFDLEdBQVc7SUFDM0MsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sWUFBWSxHQUFHLE1BQU0sZUFBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM5SSxPQUFPLHlCQUF5QixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xGLENBQUM7QUFKRCxrQ0FJQztBQUVNLEtBQUssVUFBVSxTQUFTLENBQUMsSUFBYztJQUM1QyxNQUFNLE1BQU0sR0FBRyxNQUFNLHFCQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUMsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDdEIsTUFBTSxTQUFTLEdBQUcsTUFBTSxxQkFBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0QjtJQUVELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFURCw4QkFTQyJ9