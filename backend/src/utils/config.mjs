import { config } from 'dotenv';
import HttpsProxyAgent from 'https-proxy-agent';

config();
const MONGO_DB_URL = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const PORT = process.env.PORT;

const JWT_SECRET = process.env.JWT_SECRET;
const GITHUB_APP_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID;
const GITHUB_APP_CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET;

const NODE_ENV = process.env.NODE_ENV;
let proxyAgent = null;
if (NODE_ENV !== 'production') {
    proxyAgent = new HttpsProxyAgent(`${process.env.https_proxy}`);
}

export {
    MONGO_DB_URL,
    PORT,
    JWT_SECRET,
    GITHUB_APP_CLIENT_ID,
    GITHUB_APP_CLIENT_SECRET,
    NODE_ENV,
    proxyAgent
};