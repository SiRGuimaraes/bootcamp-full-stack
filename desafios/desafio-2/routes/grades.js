import express from 'express';
import { promises } from 'fs';

const router = express.Router();
const { writeFile, readFile } = promises;

async function getJsonFile() {
  return JSON.parse(await readFile(global.fileName, 'utf8'));
}
async function writeJsonFile(json) {
  return await writeFile(global.fileName, JSON.stringify(json));
}

router.post('/', async (req, res) => {
  try {
    const { student, subject, type, value } = req.body;
    const json = await getJsonFile();
    const newGrade = {
      id: json.nextId++,
      timestamp: new Date(),
      student,
      subject,
      type,
      value,
    };
    json.grades.push(newGrade);

    await writeJsonFile(json);

    res.send(newGrade);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const { id, student, subject, type, value } = req.body;
    const json = await getJsonFile();
    const index = json.grades.findIndex((grade) => grade.id === id);

    if (index === -1) {
      throw new Error('id inválido!');
    }
    const grade = json.grades[index];

    grade.student = student;
    grade.subject = subject;
    grade.type = type;
    grade.value = value;

    await writeJsonFile(json);

    res.send(grade);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const json = await getJsonFile();

    const index = json.grades.findIndex((grade) => grade.id === id);
    if (index === -1) {
      throw new Error('id inválido!');
    }
    json.grades.splice(index, 1);

    await writeJsonFile(json);

    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const json = await getJsonFile();

    const grade = json.grades.find((grade) => grade.id === id);

    if (!grade) {
      throw new Error('Id inválido!');
    }

    res.send(grade);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post('/total', async (req, res) => {
  try {
    const { student, subject } = req.body;
    const json = await getJsonFile();
    const data = json.grades.filter(
      (grade) => grade.student === student && grade.subject === subject
    );
    const total = data.reduce((prev, curr) => {
      return prev + curr.value;
    }, 0);

    res.send({ total });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post('/media', async (req, res) => {
  try {
    const { subject, type } = req.body;
    const json = await getJsonFile();
    const data = json.grades.filter(
      (grade) => grade.subject === subject && grade.type === type
    );
    const total = data.reduce((prev, curr) => {
      return prev + curr.value;
    }, 0);

    const average = total / data.length;
    res.send({ Média: average });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post('/bests', async (req, res) => {
  try {
    const { subject, type } = req.body;
    const json = getJsonFile();
    const data = json.grades.filter(
      (grade) => grade.subject === subject && grade.type === type
    );

    data.sort((a, b) => b.value - a.value);

    const topThree = data.slice(0, 3);

    res.send(topThree);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
export default router;
