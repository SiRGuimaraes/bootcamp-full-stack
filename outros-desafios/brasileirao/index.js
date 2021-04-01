import { promises } from 'fs';

const { readFile, writeFile } = promises;
const teams = [];

async function start() {
  try {
    const data = JSON.parse(await readFile('2009.json'));

    // Init teams array
    data[0].partidas.forEach(({ mandante, visitante }) => {
      teams.push({ team: mandante, score: 0 });
      teams.push({ team: visitante, score: 0 });
    });

    console.log(teams);
  } catch (err) {
    console.log(err);
  }
}

start();
