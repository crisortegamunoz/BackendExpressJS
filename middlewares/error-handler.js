const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
};

const ErrorHandlerMiddleware = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const mesagge = error.mesagge || 'Ocurrió un error inesperado, para más información contacte a su administrador.';
    console.error(`[ERROR] ${new Date().toLocaleDateString('es-CL', options)} - ${statusCode} - ${mesagge}`);
    
    if(error.stack) {
        console.error(`Más información: ${error.stack}`)
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        mesagge,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });

    next();
};

module.exports = ErrorHandlerMiddleware;