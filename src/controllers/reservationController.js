const reservationService = require('../services/reservationService');

exports.createReservation = async (req, res) => {
    try {
        const reservation = await reservationService.createReservation(req.body)
        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}

exports.getReservation = async (req, res) => {
    try {
        const reservation = await reservationService.getReservation(req.params.id);
        if(!reservation) {
            return res.status(404).json({ error: 'Reservation not found'});
        }
        res.json(reservation)
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
}

exports.updateReservation = async (req, res) => {
    try {
        const reservationExist = await reservationService.getReservation(req.params.id);
        if(!reservationExist) {
            return res.status(404).json({ error: 'Reservation not found'});
        }
        const reservation = await reservationService.updateReservation(req.params.id, req.body);
        res.status(200).json({message: 'Reservation updated', reservation});
    } catch (error) {
        res.status(500).json({ error: ''});
    }
}

exports.deleteReservation = async(req, res) => {
    try {
    const result = await this.reservationService.delete(req.params.id);

    if(!result){
        res.status(404).json({error: 'Reservation not found'});
    }
    res.status(204).json({message: 'Reservation deleted'})
    } catch (error) {
        res.status(500).json(error);
    }
}