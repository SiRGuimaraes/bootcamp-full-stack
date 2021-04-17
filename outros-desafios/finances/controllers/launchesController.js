import { readFile, writeFile } from 'fs/promises';
import calc from '../libs/calculations.js';

import moment from 'moment';

async function insertLaunch(launch, isExpense = false) {
  const { category, date } = launch;
  let { value } = launch;
  const data = JSON.parse(await readFile(global.fileName));
  if (isExpense) {
    value *= -1;
  }
  launch = { id: data.nextId++, value, category, date };
  data.launches.push(launch);
  await writeFile(fileName, JSON.stringify(data, null, 2));

  return launch;
}

async function total() {
  const data = JSON.parse(await readFile(global.fileName));
  const totalLaunches = data.launches.map((launch) => {
    return launch.value;
  });

  return { total: calc.sum(totalLaunches) };
}

async function totalMonth(month) {
  const data = JSON.parse(await readFile(global.fileName));

  let launches = data.launches.filter((launch) => {
    const m = moment(launch.date, 'DD/MM/YYYY').month() + 1;
    return m === month;
  });

  launches = launches.map(({ value }) => value);

  return { total: calc.sum(launches) };
}
export { insertLaunch, totalMonth, total };
