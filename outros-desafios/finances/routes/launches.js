import express from 'express';
import {
  insertLaunch,
  total,
  totalMonth,
} from '../controllers/launchesController.js';

const router = express.Router();

router.post('/income', async (req, res) => {
  try {
    res.send(await insertLaunch(req.body));
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
});

router.post('/expense', async (req, res) => {
  try {
    res.send(await insertLaunch(req.body, true));
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
});

router.get('/total', async (req, res) => {
  try {
    res.send(await total());
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
});

router.get('/totalMonth/:month', async (req, res) => {
  try {
    res.send(await totalMonth(parseInt(req.params.month)));
  } catch (err) {
    res.status(400).send({ Error: err.message });
  }
});

export default router;
