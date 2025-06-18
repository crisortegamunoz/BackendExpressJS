const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
};

const LoggerMiddleware = (req, res, next) => {
    // Se captura el momento en que llega la solicitud
    const timestamp = new Date().toLocaleDateString('es-CL', options);
    console.log(`[Fecha: ${timestamp}] - Petición: ${req.method} - URL: ${req.url} - IP: ${req.ip}`);

    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] Response: ${res.statusCode} - ${duration}ms`);
    });

    next();
};

module.exports = LoggerMiddleware;