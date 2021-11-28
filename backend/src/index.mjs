// import musy before router import
import 'express-async-errors';

import { MONGO_DB_URL, NODE_ENV } from './utils/config.mjs';
import { errorHandler, jwtvaildater, requestLogger, unknownHandler } from './utils/middleware.mjs';
import { join, resolve } from 'path';

import { PORT } from './utils/config.mjs';
import compression from 'compression';
import { configRouter } from './controllers/config.mjs';
import cors from 'cors';
import express from 'express';
import { loginRouter } from './controllers/login.mjs';
import mongoose from 'mongoose';
import { notesRouter } from './controllers/note.mjs';
import { oauthRouter } from './controllers/oauth.mjs';
import { usersRouter } from './controllers/users.mjs';

const app = express();

// dns.setServers([
//     '1.1.1.1'
// ]);

const corsOptions = {
    origin: 'http://localhost:8000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(compression());

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);
if (NODE_ENV === 'production') {
    app.use(express.static(join(resolve(), 'client'), {
        setHeaders: (res, path) => {
            console.log(path, res.statusCode);
        }
    }));
}
app.set('views', join(resolve(), 'src/views'));
app.set('view engine', 'hbs');

// app.use(express.static('client'));
app.use('/api/config', configRouter);
app.use('/api/login', loginRouter);
app.use('/api/oauth', oauthRouter);
app.use(jwtvaildater);
app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);

// app.get('*', async (req, res) => {
//     // res.send()
//     res.send('<h1>Hello World!11</h1>');
// });

// Handle 404 - Keep this as a last route
app.use(unknownHandler);
app.use(errorHandler);


// debug info
if (NODE_ENV !== 'production') {
    mongoose.set('debug', true);
}
mongoose.connect(MONGO_DB_URL, {
    socketTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
    family: 4

}).then(
    () => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
).catch(err => {
    console.log(err);
});
