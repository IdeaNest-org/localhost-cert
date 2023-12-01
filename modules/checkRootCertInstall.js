const tls = require('tls');
const https = require('https');
const { getRootCrt } = require('./utils');
const getLocalhostCerts = require('./getLocalhostCerts');

let testServer = null;
async function startTestServer() {
    if (testServer) {
        return testServer;
    }
    const testPort = 11790 + Math.floor(Math.random() * 100);
    const options = getLocalhostCerts();
    try {
        testServer = https.createServer(options, (req, res) => {
            res.writeHead(200);
            res.end('TESTSERVER');
        });
        testServer.on('error', (error) => {
            testServer.close();
        });
        testServer.on('close', () => {
            testServer = null;
        });
        testServer.listen(testPort);
        return { server: testServer, port: testPort };
    } catch (error) {
        return null;
    }
}

// 检测根证书的安装情况
module.exports = async function checkRootCertificateInstallation() {
    const rootCrt = await getRootCrt();
    const options = {
        // rejectUnauthorized: false, // 忽略证书错误
        ca: [rootCrt], // 添加你要验证的根证书
        // checkServerIdentity: () => null, // 禁用服务器身份验证
    };
    // https 启动localhost 服务
    const server = await startTestServer();
    if (!server) {
        return false;
    }
    try {
        return await new Promise((resolve, reject) => {
            const socket = tls.connect(
                server.port,
                'localhost',
                options,
                () => {
                    socket.end();
                    resolve(socket.authorized);
                    server?.server?.close();
                }
            );

            socket.on('error', (error) => {
                console.log('error', error);
                resolve(false);
                socket.end();
                server?.server?.close();
            });
        });
    } catch (error) {
        console.log('error', error);
        return false;
    }
};
