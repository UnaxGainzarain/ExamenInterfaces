const express = require('express');
const router = express.Router();
const pizzas = require('../mock-data/pizzas.json');

router.get('/', (req, res) => {
  res.json(pizzas);
});

router.get('/:id', (req, res) => {
  const pizza = pizzas.find(u => u.id == req.params.id);
  if (pizza) res.json(pizza);
  else res.status(404).json({ error: 'Pizza no encontrado' });
});

module.exports = router;