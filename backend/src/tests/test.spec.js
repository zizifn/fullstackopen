import { MONGO_DB_URL } from '../utils/config.mjs';
import { test, expect } from 'jet';

test('test MONGO_DB_URL variable', () => {
    expect(MONGO_DB_URL).tobe(undefined);
});