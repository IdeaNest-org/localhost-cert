// set cra https env
const path = require('path');
process.env.HTTPS = true;
process.env.SSL_CRT_FILE = path.resolve(__dirname, '../certs/localhost.crt');
process.env.SSL_KEY_FILE = path.resolve(__dirname, '../certs/localhost.key');