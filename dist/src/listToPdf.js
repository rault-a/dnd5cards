"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ejs_1 = __importDefault(require("ejs"));
const lodash_1 = require("lodash");
const utils_1 = require("./utils");
const template_1 = require("./template");
async function listToPdf(body) {
    const npcs = await Promise.all(body.map(async ({ name, role, image }) => {
        return { name, role, img: await utils_1.imgToBase64(image) };
    }));
    const pdfs = await Promise.all(lodash_1.chunk(npcs, 8).map(async (characters) => {
        const html = await ejs_1.default.render(template_1.template, {
            characters,
        }, {
            async: true,
        });
        return utils_1.generatePDF(html);
    }));
    return utils_1.mergePDFs(pdfs);
}
exports.listToPdf = listToPdf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdFRvUGRmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpc3RUb1BkZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhDQUFzQjtBQUN0QixtQ0FBK0I7QUFDL0IsbUNBQThEO0FBQzlELHlDQUFzQztBQVEvQixLQUFLLFVBQVUsU0FBUyxDQUFDLElBQWU7SUFDN0MsTUFBTSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtRQUN2QyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxtQkFBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDdkQsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDNUIsY0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFO1FBQ3RDLE1BQU0sSUFBSSxHQUFHLE1BQU0sYUFBRyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxFQUFFO1lBQ3RDLFVBQVU7U0FDWCxFQUFFO1lBQ0QsS0FBSyxFQUFFLElBQUk7U0FDWixDQUFDLENBQUM7UUFDSCxPQUFPLG1CQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUVGLE9BQU8saUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBbkJELDhCQW1CQyJ9