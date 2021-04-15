import express from 'express';
import { readFile, writeFile } from 'fs/promises';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, balance } = req.body;
    if (!name || name.length < 3 || balance == null) {
      throw new Error('');
    }
    const data = JSON.parse(await readFile(global.fileName));
    const account = { id: data.nextId++, name, balance };

    data.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(account);
    logger.info(`${req.method} ${req.baseUrl} - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    const { accounts } = JSON.parse(await readFile(global.fileName));

    res.send({ accounts });
    logger.info(`${req.method} ${req.baseUrl}`);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { accounts } = JSON.parse(await readFile(global.fileName));
    const account = accounts.find((account) => account.id === id);
    if (!account) {
      throw new Error('account not found');
    }
    res.send(account);
    logger.info(`${req.method} ${req.baseUrl}:id`);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = JSON.parse(await readFile(global.fileName));
    data.accounts = data.accounts.filter((account) => account.id !== id);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.end();
    logger.info(`${req.method} ${req.baseUrl}:id - ${id}`);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { id, name, balance } = req.body;
    const data = JSON.parse(await readFile(global.fileName));
    const account = data.accounts.find((account) => account.id === id);
    if (!account) {
      throw new Error('account not found');
    }
    if (name && name.length > 2) {
      account.name = name;
    }
    if (balance && balance >= 0) {
      account.balance = balance;
    }

    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(account);
    logger.info(`${req.method} ${req.baseUrl} - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

router.patch('/updateBalance', async (req, res, next) => {
  try {
    const { id, balance } = req.body;
    const data = JSON.parse(await readFile(global.fileName));
    const account = data.accounts.find((account) => account.id === id);
    if (!account) {
      throw new Error('account not found');
    }
    if (balance && balance >= 0) {
      account.balance = balance;
    }

    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(account);
    logger.info(
      `${req.method} ${req.baseUrl}/updateBalance - ${JSON.stringify(account)}`
    );
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, _next) => {
  global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ Error: err.message });
});

export default router;
