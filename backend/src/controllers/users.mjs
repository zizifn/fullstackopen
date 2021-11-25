import { Router } from 'express';
import { hash } from 'bcrypt';
import { MongoUser } from '../db/user.mjs';

const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
    const users = await MongoUser.find({}).populate('notes', { content: 1, date: 1, important: true });
    res.json(users);
});

usersRouter.get('/:userName', async (req, res) => {
    const users = await MongoUser.findOne({ username: req.params.userName }).populate('notes', { content: 1, date: 1, important: true });
    res.json(users);
});

usersRouter.post('/', async (req, res) => {
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