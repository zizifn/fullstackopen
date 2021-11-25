import { Router } from 'express';
import fetch from 'node-fetch';
import { GITHUB_APP_CLIENT_ID, GITHUB_APP_CLIENT_SECRET, proxyAgent, JWT_SECRET } from '../utils/config.mjs';
import { MongoUser } from '../db/user.mjs';
import JWT from 'jsonwebtoken';
import { AuthorizationError } from '../model/error.model.mjs';
const oauthRouter = Router();

oauthRouter.get('/github/*', async (request, response, next) => {

    console.log(request.query.code);

    // get access token
    const githubAccessTokenURL = 'https://github.com/login/oauth/access_token';
    const params = new URLSearchParams();
    params.append('client_id', GITHUB_APP_CLIENT_ID);
    params.append('client_secret', GITHUB_APP_CLIENT_SECRET);
    params.append('code', request.query.code);
    const accessTokenResponse = await fetch(githubAccessTokenURL, {
        agent: proxyAgent,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: params
    });
    const data = await accessTokenResponse.json();
    console.log(data);

    // get user info
    const userResp = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${data?.access_token}`
        }
    });
    const user = await userResp.json();

    const { login: userName, email } = user;
    if (!userName) {
        return next(new AuthorizationError('User not found'));
    }

    // try to find user
    let mongoUser = await MongoUser.findOne({ username: userName });
    // if no user, add user into db
    if (!mongoUser) {
        const savedUser = await new MongoUser({
            username: userName,
            name: userName,
            email: email
        }).save();
        mongoUser = savedUser;
    }

    // sign jwt
    const userForToken = {
        username: mongoUser.username,
        id: mongoUser._id,
    };

    const token = JWT.sign(userForToken, JWT_SECRET, { expiresIn: 60 * 60 });

    response.render('oauth', {
        layout: false,
        jwtToken: token
    });
});

export { oauthRouter };