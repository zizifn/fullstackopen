import express from 'express';
import { config } from 'dotenv';
import { PORT } from './utils/config.mjs';
import { notesRouter } from './controllers/note.mjs';
import { usersRouter } from './controllers/users.mjs';
import { loginRouter } from './controllers/login.mjs';
import { requestLogger, unknownHandler, errorHandler, jwtvaildater } from './utils/middleware.mjs';
import cors from 'cors';
import { join, resolve } from 'path';
import compression from 'compression';
import mongoose from 'mongoose';
import { MONGO_DB_URL } from './utils/config.mjs';
const app = express();
config();

const corsOptions = {
    origin: 'http://localhost:8000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(compression());

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);
app.use(express.static(join(resolve(), 'client'), {
    setHeaders: (res, path) => {
        console.log(path, res.statusCode);
    }
}));
// app.use(express.static('client'));

app.use('/api/login', loginRouter);
app.use(jwtvaildater);
app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);

app.get('*', async (req, res) => {
    // res.send()
    res.send('<h1>Hello World!11</h1>');
});

// Handle 404 - Keep this as a last route
app.use(unknownHandler);
app.use(errorHandler);


mongoose.set('debug', true);
mongoose.connect(MONGO_DB_URL).then(
    () => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
).catch(err => {
    console.log(err);
});
