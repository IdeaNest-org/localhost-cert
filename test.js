const getHttps = require('./index.js');
const options = getHttps({
  autoInstall: true,
});
console.log(options);
const https = require('https');
https
    .createServer(options, (req, res) => {
        res.writeHead(200);
        res.end('Hello World!');
    })
    .listen(8443);
console.log('Server running at https://localhost:8443/');
