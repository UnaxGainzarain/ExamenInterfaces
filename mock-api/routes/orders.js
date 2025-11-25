const express = require('express');
const router = express.Router();
const orders = require('../mock-data/orders.json');

// POST /api/users
router.post('/', (req, res) => {
  const newOrder = req.body;

  // Validación básica
  if (!newOrder.delivery_time ) {
    return res.status(400).json({'code': 21, 'description': 'The delivery time is mandatory'});
  }

  console.log('Nuevo orden recogido (solo en memoria):', newOrder);

  // Devuelve lo del JSON
  res.status(201).json(orders);
});

module.exports = router;