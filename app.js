const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const uuid = require('uuid');
dotenv.config();

const app = express();
const port = 4000;

app.use(express.json());

// Array de usuarios predefinidos
const users = [
  { username: 'usuario1', password: 'contrasena1' },
  { username: 'usuario2', password: 'contrasena2' },
  // Agrega más usuarios según sea necesario
];

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

// Ruta de autenticación
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas', success: false });
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token, success: true });
});

// Ruta protegida
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

// Rutas para tareas

// Obtener todas las tareas
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// Obtener una tarea por ID
app.get('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada', success: false });
  }

  res.status(200).json({ task, success: true });
});

// Crear una nueva tarea
app.post('/tasks', (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'La descripción de la tarea es requerida', success: false });
  }

  const newTask = {
    id: uuid.v4(),
    isCompleted: false,
    description,
  };

  tasks.push(newTask);
  res.status(201).json({ task: newTask, success: true });
});

// Actualizar una tarea
app.put('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const { description, isCompleted } = req.body;
  const taskToUpdate = tasks.find((task) => task.id === taskId);

  if (!taskToUpdate) {
    return res.status(404).json({ error: 'Tarea no encontrada', success: false });
  }

  taskToUpdate.description = description || taskToUpdate.description;
  taskToUpdate.isCompleted = isCompleted || taskToUpdate.isCompleted;

  res.status(200).json({ task: taskToUpdate, success: true });
});

// Eliminar una tarea
app.delete('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const index = tasks.findIndex((task) => task.id === taskId);

  if (index !== -1) {
    const deletedTask = tasks.splice(index, 1)[0];
    res.status(200).json({ task: deletedTask, success: true });
  } else {
    res.status(404).json({ error: 'Tarea no encontrada', success: false });
  }
});

// Obtener tareas completas
app.get('/tasks/completed', (req, res) => {
  const completedTasks = tasks.filter((task) => task.isCompleted);
  res.status(200).json({ tasks: completedTasks, success: true });
});

// Obtener tareas incompletas
app.get('/tasks/incomplete', (req, res) => {
  const incompleteTasks = tasks.filter((task) => !task.isCompleted);
  res.status(200).json({ tasks: incompleteTasks, success: true });
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});

