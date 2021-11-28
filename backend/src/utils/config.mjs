import HttpsProxyAgent from 'https-proxy-agent';
import { config } from 'dotenv';
import fetch from 'node-fetch';

config();
const MONGO_DB_URL = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const PORT = process.env.PORT;

const JWT_SECRET = process.env.JWT_SECRET;
const GITHUB_APP_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID;
const GITHUB_APP_CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET;
const authingFullStackOpenId = process.env.AUTHING_FULLSTACKOPEN_APPID;
const authingFullStackClientSecret = process.env.AUTHING_FULLSTACKOPEN_CLIENT_SECRET;

const NODE_ENV = process.env.NODE_ENV;
let proxyAgent = null;
if (NODE_ENV !== 'production') {
    proxyAgent = new HttpsProxyAgent(`${process.env.https_proxy}`);
}
const authingUrl = process.env.AUTHING_URL || 'https://fullstackopen.authing.cn';
const authingDiscoveryUrl = process.env.AUTHING_DISCOVERY_URL || 'https://fullstackopen.authing.cn/oidc/.well-known/openid-configuration';
const configResp = await fetch(authingDiscoveryUrl);
if (!configResp.ok) {
    throw new Error('authingDiscoveryUrl return error');
}
const authingConfig = await configResp.json();
const authingTokenUrl = authingConfig.token_endpoint;
const authingUserInfoUrl = authingConfig.userinfo_endpoint;
const authingRedirect_Uri = process.env.AUTHING_REDIRECT_URI;
const loginURL =
    `${authingConfig.authorization_endpoint}?response_type=code&scope=${encodeURIComponent('openid username profile email phone offline_access')}&client_id=${authingFullStackOpenId}&redirect_uri=${authingRedirect_Uri}`;

export {
    MONGO_DB_URL,
    PORT,
    JWT_SECRET,
    GITHUB_APP_CLIENT_ID,
    GITHUB_APP_CLIENT_SECRET,
    NODE_ENV,
    proxyAgent,
    authingConfig,
    authingUrl,
    loginURL,
    authingTokenUrl,
    authingFullStackOpenId,
    authingFullStackClientSecret,
    authingRedirect_Uri,
    authingUserInfoUrl
};