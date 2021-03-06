import express from 'express';
import bodyParser from 'body-parser';
import { listToPdf } from './listToPdf';
import { logger } from './logger';

const app = express();

const { PORT = '8080' } = process.env;

app
  .use(bodyParser.json({ limit: '50mb' }))
  .post('/api/download', async (req, res) => {
    try {
      const pdf = await listToPdf(req.body);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="cards.pdf"');
      res.type('pdf');
      res.send(pdf);
    } catch (e) {
      logger.error(e);
      res.status(500).send('Server error');
    }
  })
  .use(express.static('./static'))
  .listen(PORT, () => {
    logger.info(`Server started on ${PORT}`);
  });
