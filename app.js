const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const uuid = require('uuid');
dotenv.config();

const app = express();
const port = 4000;

app.use(express.json());

const listViewRouter = require('./list-view-router');
const listEditRouter = require('./list-edit-router');
app.use('/list-view', listViewRouter);
app.use('/list-edit', listEditRouter);

const tasks = [
  {
    id: '1',
    isCompleted: false,
    description: 'Hacer las compras',
  },
  {
    id: '2',
    isCompleted: true,
    description: 'Estudiar Express',
  },
  {
    id: '3',
    isCompleted: true,
    description: 'Avanzar en la plataforma',
  },
  {
    id: '4',
    isCompleted: false,
    description: 'Sacar contenido para redes',
  },
  {
    id: '5',
    isCompleted: false,
    description: 'Entregar pedidos',
  },
];

const users = [
  { username: 'usuario1', password: 'contrasena1' },
  { username: 'usuario2', password: 'contrasena2' },
  // Agrega más usuarios según sea necesario
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas', success: false });
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token, success: true });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Ruta protegida alcanzada', success: true });
});

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado', success: false });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido', success: false });
    }
    req.user = user;
    next();
  });
}

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
