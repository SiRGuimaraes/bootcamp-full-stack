import express from 'express';
import { writeFile } from 'fs/promises';
import launchesRouter from './routes/launches.js';

global.fileName = './json/launches.json';

const app = express();

app.use(express.json());

app.use('/launches', launchesRouter);

app.listen(3000, async () => {
  try {
    console.log('API Started!');
    const initJson = {
      nextId: 1,
      launches: [],
    };
    await writeFile(fileName, JSON.stringify(initJson, null, 2), {
      flag: 'wx',
    });
  } catch (err) {}
});
