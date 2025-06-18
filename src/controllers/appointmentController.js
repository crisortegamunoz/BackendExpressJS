const appointmentService = require('../services/appointmentService');

exports.getUserAppointments = async (req, res) => {
    try {
        const userId = req.params.id;
        const appointments = await appointmentService.getUserAppointments(userId)
        res.status(201).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}