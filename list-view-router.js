const express = require('express');
const listViewRouter = express.Router();


function validateParameters(req, res, next) {
  const { param } = req.query;
  
  if (!param || (param !== 'complete' && param !== 'incomplete')) {
    return res.status(400).json({ error: 'Parámetro no válido' });
  }
  
  
  next();
}

listViewRouter.use(validateParameters);

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
