import { promises } from 'fs';
const { readFile, writeFile } = promises;
const ALL_STATES = 'origin-json/Estados.json';
const ALL_CITIES = 'origin-json/Cidades.json';

async function start() {
  await createFiles();
  await getStatesCitiesCount();
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

async function getCitiesCount(uf) {
  const cities = JSON.parse(await readFile(`states/${uf}.json`));
  return cities.length;
}

async function getStatesCitiesCount(withMoreCities) {
  const states = JSON.parse(await readFile(ALL_STATES));
  const statesList = [];

  for (let state of states) {
    const { Sigla } = state;
    const citiesCount = await getCitiesCount(Sigla);
    statesList.push({ uf: Sigla, citiesCount });
  }
  statesList.sort((a, b) => b.citiesCount - a.citiesCount);

  const topFive = [];

  if (withMoreCities) {
    statesList.slice(0, 5).forEach(({ uf, citiesCount }) => {
      topFive.push(`${uf} - ${citiesCount}`);
    });
  } else {
    statesList.slice(-5).forEach(({ uf, citiesCount }) => {
      topFive.push(`${uf} - ${citiesCount}`);
    });
  }
  console.log(topFive);
}

start();
