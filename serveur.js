const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const readJsonFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
};

const writeJsonFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

app.post('/signup', async (req, res) => {
  const { id, password } = req.body;

  let users = await readJsonFile('./data/connexion.json');

  if (users.some(user => user.id === id)) {
    return res.status(400).json({ error: 'Cet identifiant existe déjà.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ id, password: hashedPassword });

  await writeJsonFile('./data/connexion.json', users);

  res.status(201).json({ message: 'Utilisateur créé avec succès.' });
});

app.post('/login', async (req, res) => {
  const { id, password } = req.body;

  let users = await readJsonFile('./data/connexion.json');

  const user = users.find(u => u.id === id);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: 'Identifiant ou mot de passe incorrect.' });
  }

  res.status(200).json({ message: 'Connexion réussie.' });
});

app.post('/message', async (req, res) => {
  const { user, text } = req.body;

  let messages = await readJsonFile('./data/messages.json');

  const formattedDate = new Date().toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const newMessage = {
    user,
    text,
    date: formattedDate,
  };

  messages.push(newMessage);

  await writeJsonFile('./data/messages.json', messages);

  res.status(201).json({ message: 'Message posté avec succès.' });
});

app.get('/messages', async (req, res) => {
  let messages = await readJsonFile('./data/messages.json');
  res.status(200).json(messages);
});

app.listen(port, () => {
  console.log(`Serveur en ligne sur http://localhost:${port}`);
});