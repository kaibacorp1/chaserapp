import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { runUserDetection } from './detectWorker.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/startDetection', async (req, res) => {
  const userConfig = req.body;

  if (!userConfig?.email || !userConfig?.lat || !userConfig?.lng) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  runUserDetection(userConfig);
  res.status(200).json({ message: 'Detection started.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
