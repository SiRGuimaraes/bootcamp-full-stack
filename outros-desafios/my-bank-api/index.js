import express from 'express';
import winston from 'winston';
import accountsRouter from './routes/accounts.js';
import { writeFile, readFile } from 'fs/promises';
import cors from 'cors';

global.fileName = './json/accounts.json';

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'my-bank-api.log' }),
  ],
  format: combine(label({ label: 'my-bank-api' }), timestamp(), myFormat),
});

const app = express();
app.use(express.json());
// cors liberado de forma global
app.use(cors());
app.use('/account', accountsRouter);

app.listen(3000, async () => {
  try {
    await readFile(fileName, 'utf-8');
    logger.info('API Started!');
  } catch (err) {
    const initJson = {
      nextId: 1,
      accounts: [],
    };
    try {
      await writeFile(fileName, JSON.stringify(initJson));
      logger.info('API Started and File Created!');
    } catch (err) {
      logger.error(err);
    }
  }
  console.log('API Started');
});
