const express = require('express');
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

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
