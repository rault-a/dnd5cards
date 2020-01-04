"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const listToPdf_1 = require("./listToPdf");
const app = express_1.default();
const { PORT = '8080' } = process.env;
app
    .use(body_parser_1.default.json({ limit: '50mb' }))
    .post('/api/download', async (req, res) => {
    try {
        const pdf = await listToPdf_1.listToPdf(req.body);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="cards.pdf"');
        res.type('pdf');
        res.send(pdf);
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
})
    .use(express_1.default.static('./static'))
    .listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUE4QjtBQUU5Qiw4REFBcUM7QUFDckMsMkNBQXdDO0FBRXhDLE1BQU0sR0FBRyxHQUFHLGlCQUFPLEVBQUUsQ0FBQztBQUV0QixNQUFNLEVBQUUsSUFBSSxHQUFHLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFFdEMsR0FBRztLQUNBLEdBQUcsQ0FBQyxxQkFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUN4QyxJQUFJO1FBQ0YsTUFBTSxHQUFHLEdBQUcsTUFBTSxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2pELEdBQUcsQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztRQUN6RSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDZjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUN0QztBQUNILENBQUMsQ0FBQztLQUNELEdBQUcsQ0FBQyxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUMvQixNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLENBQUMsQ0FBQyxDQUFDIn0=