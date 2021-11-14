import { info } from './logger.mjs';

const requestLogger = (req, res, next) => {
    // after response
    res.on('finish', function () {
        info('API request.', {
            module: 'core',
            data: {
                req: {
                    method: req.method,
                    url: req.originalUrl,
                    ip: req.ip
                },
                res: {
                    status_code: res.statusCode
                }
            }
        });
    });
    next();
};

const unknownHandler = (req, res) => {
    res.status(404);
    res.send('404: File Not Found');
};

const errorHandler = (error, req, res, next) => {
    console.log('insde middler', error);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' });
        // const err = new Error('malformatted id');
        // err.toJSON = () => {
        //     return {
        //         error: 'ddddd'
        //     }
        // }
        // return res.status(500).send(error);
    } else {

        // return res.status(500).send(error);
    }
    next(error);
};

export { requestLogger, unknownHandler, errorHandler };