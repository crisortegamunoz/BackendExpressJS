const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

exports.getUserAppointments = async id => {
    const appointments = await prisma.appointment.findMany({
        where: {
            userId: parseInt(id, 10)
        },
        include: {
            timeBlock: true
        }
    });
    return appointments;
}