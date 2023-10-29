const express = require('express');
const listViewRouter = express.Router();

listViewRouter.get('/complete', (req, res) => {
  try {
    const completedTasks = tasks.filter((task) => task.isCompleted);
    res.json(completedTasks);
  } catch (error) {
    
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

listViewRouter.get('/incomplete', (req, res) => {
  try {
    const incompleteTasks = tasks.filter((task) => !task.isCompleted);
    res.json(incompleteTasks);
  } catch (error) {
    
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = listViewRouter;
