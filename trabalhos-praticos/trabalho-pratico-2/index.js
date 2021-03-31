import { promises } from 'fs';
const { readFile, writeFile } = promises;
const ALL_STATES = 'origin-json/Estados.json';
const ALL_CITIES = 'origin-json/Cidades.json';

async function start() {
  await createFiles();
}

async function createFiles() {
  const states = JSON.parse(await readFile(ALL_STATES));
  const cities = JSON.parse(await readFile(ALL_CITIES));

  for (let state of states) {
    const { ID, Sigla } = state;
    const stateCities = cities.filter((city) => city.Estado === ID);
    await writeFile(
      `states/${Sigla}.json`,
      JSON.stringify(stateCities, null, 2)
    );
  }
}

start();
