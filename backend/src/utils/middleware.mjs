import { info } from './logger.mjs';
import JWT from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/config.mjs';

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
    } else if (error.name === 'ValidationError') {
        return res.status(401).json({ error: 'token invaild' });
        // return res.status(500).send(error);
    }
    next(error);
};
const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
};

const jwtvaildater = (req, res, next) => {
    const token = getTokenFrom(req);
    const decodedToken = JWT.verify(token, JWT_SECRET);
    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
    } else {
        req.decodedToken = decodedToken;
    }
    next();
};

export { requestLogger, unknownHandler, errorHandler, jwtvaildater };