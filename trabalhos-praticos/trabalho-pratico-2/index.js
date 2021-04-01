import { promises } from 'fs';

const { readFile, writeFile } = promises;
const STATES_FILE = JSON.parse(await readFile('origin-json/Estados.json'));
const CITIES_FILE = JSON.parse(await readFile('origin-json/Cidades.json'));
const STATE_CITIES_FILE = async (uf) =>
  JSON.parse(await readFile(`states/${uf}.json`));

async function start() {
  await createFiles();
  await getStatesCitiesCount();
  await getStatesCitiesCount(false);
  await getCitiesNames();
  await getCitiesNames(false);
  await getCityName();
  await getCityName(false);
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

async function getBiggerOrSmallerName(uf, withBiggerName = true) {
  const cities = await STATE_CITIES_FILE(uf);
  let cityName = cities[0].Nome;

  for (let { Nome } of cities) {
    if (withBiggerName) {
      if (Nome.length > cityName.length) {
        cityName = Nome;
      }
    } else {
      if (Nome.length < cityName.length) {
        cityName = Nome;
      }
    }
    if (Nome.length === cityName.length) {
      if (Nome.localeCompare(cityName) === -1) {
        cityName = Nome;
      }
    }
  }
  return cityName;
}

async function getCityName(withBiggerName = true) {
  const states = STATES_FILE;
  let citiesList = [];

  for (let { Sigla } of states) {
    const cityName = await getBiggerOrSmallerName(Sigla, withBiggerName);
    citiesList.push({ name: cityName, uf: Sigla });
  }
  let cityResult = citiesList[0];

  for (let { name, uf } of citiesList) {
    if (withBiggerName) {
      if (name.length > cityResult.name.length) {
        cityResult = { name, uf };
      }
    } else {
      if (name.length < cityResult.name.length) {
        cityResult = { name, uf };
      }
    }
    if (name.length === cityResult.name.length) {
      if (name.localeCompare(cityResult.name) === -1) {
        cityResult = { name, uf };
      }
    }
  }
  console.log(`${cityResult.name} - ${cityResult.uf}`);
}

start();
