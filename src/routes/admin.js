const { Router } = require('express');
const { createTimeBlock, listReservations } = require('../controllers/adminController.js');
const router = Router();
const authenticateToken = require('../middlewares/auth');

router.post('/time-blocks', authenticateToken, createTimeBlock);
router.get('/reservations', authenticateToken, listReservations);

module.exports = router;

