import { promises } from 'fs';

const { readFile, writeFile } = promises;
const teams = [];

async function start() {
  try {
    const data = JSON.parse(await readFile('2009.json'));

    // Init teams array
    data[0].partidas.forEach(({ mandante, visitante }) => {
      teams.push({ name: mandante, score: 0 });
      teams.push({ name: visitante, score: 0 });
    });

    // Fill teams score in array
    data.forEach((round) => {
      round.partidas.forEach((match) => {
        const {
          placar_mandante,
          placar_visitante,
          mandante,
          visitante,
        } = match;
        const homeTeam = teams.find((team) => team.name === mandante);
        const visitor = teams.find((team) => team.name === visitante);

        if (placar_mandante > placar_visitante) {
          homeTeam.score += 3;
        } else if (placar_mandante < placar_visitante) {
          visitor.score += 3;
        } else {
          homeTeam.score++;
          visitor.score++;
        }
      });
    });

    teams.sort((a, b) => b.score - a.score);

    console.log('O campeão foi: ' + teams[0].name);
  } catch (err) {
    console.log(err);
  }
}

start();
