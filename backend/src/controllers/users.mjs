import { authingConfig, authingUrl } from '../utils/config.mjs';

import { MongoUser } from '../db/user.mjs';
import { Router } from 'express';
import { hash } from 'bcrypt';

const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
    const users = await MongoUser.findOne({ userid: req.decodedToken.sub }).populate('notes', { content: 1, date: 1, important: true });
    res.json(users);
});

usersRouter.get('/:userName', async (req, res) => {
    const users = await MongoUser.findOne({ userid: req.params.userName }).populate('notes', { content: 1, date: 1, important: true });
    res.json(users);
});

usersRouter.post('/', async (req, res) => {
    if (req.decodedToken.userid !== 'root') {
        return res.status(401).json({ error: 'error message' });
    }
    const body = req.body;

    const saltRounds = 10;
    const passwordHash = await hash(body.password, saltRounds);
    const user = new MongoUser({
        username: body.username,
        name: body.name,
        passwordHash,
    });
    const savedUser = await user.save();

    res.json(savedUser);
});


export { usersRouter };