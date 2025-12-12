const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Reuse the same controller for different routes, assuming the controller infers the table
// or we can mount the same router to multiple paths in server.js

router.get('/', inventoryController.getAll);
router.post('/', inventoryController.create);
router.put('/:id', inventoryController.update);
router.delete('/:id', inventoryController.remove);

module.exports = router;
