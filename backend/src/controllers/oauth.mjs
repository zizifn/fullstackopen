import {
    GITHUB_APP_CLIENT_ID,
    GITHUB_APP_CLIENT_SECRET,
    JWT_SECRET,
    authingFullStackClientSecret,
    authingFullStackOpenId,
    authingRedirect_Uri,
    authingTokenUrl,
    authingUserInfoUrl,
    proxyAgent,
} from '../utils/config.mjs';

import { AuthenticationClient } from 'authing-js-sdk'
import { AuthorizationError } from '../model/error.model.mjs';
import JWT from 'jsonwebtoken';
import { MongoUser } from '../db/user.mjs';
import { Router } from 'express';
import fetch from 'node-fetch';

const oauthRouter = Router();
oauthRouter.get('/authing/*', async (request, response, next) => {
    console.log(request.query.code);

    // get access token
    const params = new URLSearchParams();
    params.append('client_id', authingFullStackOpenId);
    params.append('client_secret', authingFullStackClientSecret);
    params.append('code', request.query.code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', authingRedirect_Uri);

    const accessTokenResponse = await fetch(authingTokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
        body: params,
    });
    const data = await accessTokenResponse.json();
    console.log(data);
    const { id_token, access_token } = data;

    // get user info
    const userResp = await fetch(`${authingUserInfoUrl}?access_token=${access_token}`, {
        method: 'GET'
    });
    const user = await userResp.json();

    const { sub, username, email } = user;
    if (!sub) {
        return next(new AuthorizationError('User not found'));
    }

    let mongoUser = await MongoUser.findOne({ userid: sub });
    // if no user, add user into db
    if (!mongoUser) {
        const savedUser = await new MongoUser({
            userid: sub,
            name: username,
            email: email,
        }).save();
        mongoUser = savedUser;
    }

    response.render('oauth', {
        layout: false,
        jwtToken: id_token,
    });
});

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
            Authorization: `bearer ${data?.access_token}`,
        },
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
            email: email,
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
        jwtToken: token,
    });
});


export { oauthRouter };
