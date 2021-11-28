import { authingConfig, loginURL } from '../utils/config.mjs';

import { Router } from 'express';

const configRouter = Router();

configRouter.get('/', async (req, res) => {
    res.json({
        loginUrl: loginURL,
        sessionEndUrl: authingConfig.end_session_endpoint
    });
});

export {
    configRouter
};
