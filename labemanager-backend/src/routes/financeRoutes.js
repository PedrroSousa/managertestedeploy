const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

router.get('/transactions', financeController.getAll);
router.post('/transactions', financeController.create);
router.put('/transactions/:id', financeController.update);
router.delete('/transactions/:id', financeController.remove);

module.exports = router;
