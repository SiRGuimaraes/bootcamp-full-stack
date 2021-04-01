import { promises } from 'fs';

const { readFile, writeFile } = promises;
const STATES_FILE = JSON.parse(await readFile('origin-json/Estados.json'));
const CITIES_FILE = JSON.parse(await readFile('origin-json/Cidades.json'));
const STATE_CITIES_FILE = async (uf) =>
  JSON.parse(await readFile(`states/${uf}.json`));

async function start() {
  //await createFiles();
  //await getStatesCitiesCount();
  //await getStatesCitiesCount(false);
  await getCitiesNames();
  await getCitiesNames(false);
}

async function createFiles() {
  const states = STATES_FILE;
  const cities = CITIES_FILE;

  for (let { ID, Sigla } of states) {
    const stateCities = cities.filter((city) => city.Estado === ID);
    await writeFile(
      `states/${Sigla}.json`,
      JSON.stringify(stateCities, null, 2)
    );
  }
}

async function getCitiesCount(uf) {
  const cities = await STATE_CITIES_FILE(uf);
  return cities.length;
}

async function getStatesCitiesCount(withMoreCities = true) {
  const states = STATES_FILE;
  const statesList = [];

  for (let { Sigla } of states) {
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

async function getCitiesNames(withBiggerNames = true) {
  const states = STATES_FILE;
  const citiesList = [];

  for (let { Sigla } of states) {
    let cityName;

    cityName = await getBiggerOrSmallerName(Sigla, withBiggerNames);

    citiesList.push(`${cityName} - ${Sigla}`);
  }
  console.log(citiesList);
}

async function getBiggerOrSmallerName(uf, biggerName = true) {
  const cities = await STATE_CITIES_FILE(uf);
  let cityName = cities[0].Nome;

  for (let { Nome } of cities) {
    if (biggerName) {
      if (Nome.length > cityName.length) {
        cityName = Nome;
      }
    } else {
      if (Nome.length < cityName.length) {
        cityName = Nome;
      }
    }
    if (Nome.localeCompare(cityName) === -1) {
      cityName = Nome;
    }
  }
  return cityName;
}

start();
