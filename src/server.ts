import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { chatRouter } from './routes/chat';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/chatbot', (_req, res) => {
  res.sendFile(path.join(__dirname, '../views/chatbot.html'));
});

app.use('/api', chatRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
