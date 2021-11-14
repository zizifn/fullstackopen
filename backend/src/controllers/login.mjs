import JWT from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { Router } from 'express';
import { MongoUser } from '../db/user.mjs';
import { JWT_SECRET } from '../utils/config.mjs';
// import PORT1 from '../utils/test.mjs';

const loginRouter = Router();

loginRouter.post('/', async (request, response) => {
    const body = request.body;
    const user = await MongoUser.findOne({ username: body.username });
    const passwordCorrect = user === null
        ? false
        : await compare(body.password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        });
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    };

    const token = JWT.sign(userForToken, JWT_SECRET, { expiresIn: 60 * 60 });

    response
        .status(200)
        .send({ token, username: user.username, name: user.name });
});

export { loginRouter };