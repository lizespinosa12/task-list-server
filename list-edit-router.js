const express = require('express');
const listEditRouter = express.Router();
const uuid = require('uuid'); 

listEditRouter.post('/create', (req, res) => {
  const { description } = req.body;
  const newTask = {
    id: uuid.v4(), 
    isCompleted: false, 
    description,
  };
  tasks.push(newTask);
  res.json(newTask);
});


listEditRouter.delete('/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const index = tasks.findIndex((task) => task.id === taskId);
  if (index !== -1) {
    tasks.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

// Actualizar una tarea
listEditRouter.put('/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const { description, isCompleted } = req.body;
  const taskToUpdate = tasks.find((task) => task.id === taskId);
  if (taskToUpdate) {
    taskToUpdate.description = description || taskToUpdate.description;
    taskToUpdate.isCompleted = isCompleted || taskToUpdate.isCompleted;
    res.json(taskToUpdate);
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

module.exports = listEditRouter;