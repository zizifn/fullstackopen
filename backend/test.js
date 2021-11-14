const {
    generateKey
} = require('crypto');

generateKey('hmac', { length: 256 }, (err, key) => {
    if (err) throw err;
    console.log(key.export().toString('hex'));  // 46e..........620
});

