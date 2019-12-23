const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { listToPdf } = require('./listToPdf');
const fs = require('fs').promises;

const app = express();

const { PORT = 8080 } = process.env;

app
  .use(bodyParser.json({ limit: '50mb', extended: true }))
  .post('/api/download', async (req, res) => {
    try {
      const pdf = await listToPdf(req.body);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="cards.pdf"');
      res.type('pdf');
      res.send(pdf);
    } catch (e) {
      console.error(e);
      res.status(500).send('Server error');
    }
  })
  .use(express.static(path.join(__dirname, 'static')))
  .listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
  });

