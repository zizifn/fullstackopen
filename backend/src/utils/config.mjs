import { config } from 'dotenv';

config();
const MONGO_DB_URL = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const PORT = process.env.PORT;

const JWT_SECRET = process.env.JWT_SECRET;

export {
    MONGO_DB_URL,
    PORT,
    JWT_SECRET
};