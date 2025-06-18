const { Router } = require('express');
const reservationController = require('../controllers/appointmentController');
const authenticateToken = require('../middlewares/auth');

const router = Router();

router.get('/:id/appointments', authenticateToken, reservationController.getUserAppointments);

module.exports = router;