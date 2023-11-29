// 引导安装根证书
const cp = require('child_process');
const process = require('process');
const path = require('path');
const fs = require('fs-extra');
const tls = require('tls');
const https = require('https');
var sudo = require('sudo-prompt');
function install() {
    // windows 运行 certutil -addstore -enterprise -f "Root" "C:\path\to\your\certificate.crt"
    // mac 运行 sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain /path/to/your/certificate.crt
    // linux 运行 sudo cp /path/to/your/certificate.crt /usr/local/share/ca-certificates/ && sudo update-ca-certificates
    // 以上命令均需要管理员权限
    try {
        console.log('install root certificate');
        const crtPath = path.resolve(__dirname, 'root.crt');
        if (process.platform === 'win32') {
            console.log('windows');
            const cmd =
                'certutil -addstore -enterprise -f "Root" "' + crtPath + '"';
            var options = {
                name: 'Localhost Cert',
            };
            sudo.exec(cmd, options, function (error, stdout, stderr) {
                if (error) throw error;
            });
            // cp.exec(
            //     'certutil -addstore -enterprise -f "Root" "' + crtPath + '"'
            // );
        } else if (process.platform === 'darwin') {
            cp.exec(
                'sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "' +
                    crtPath +
                    '"'
            );
        } else if (process.platform === 'linux') {
            cp.exec(
                'sudo cp "' +
                    crtPath +
                    '" /usr/local/share/ca-certificates/ && sudo update-ca-certificates'
            );
        } else {
            console.log('unsupport platform:' + process.platform);
        }
    } catch (error) {
        console.warn('install root certificate error:' + error);
        console.warn(
            'please download at:https://github.com/IdeaNest-org/localhost-cert/blob/main/root.crt and install root certificate manually'
        );
    }
}

const localhostCrt = readFileFromDir('localhost.crt');
const localhostKey = readFileFromDir('localhost.key');

// 检测根证书的安装情况
async function checkRootCertificateInstallation() {
    const rootCrt = await readFileFromDirAsync('root.crt');
    const options = {
        ca: [rootCrt], // 添加你要验证的根证书
        checkServerIdentity: () => null, // 禁用服务器身份验证
    };
    // https 启动localhost 服务
    startTestServer();
    return await new Promise((resolve, reject) => {
        const socket = tls.connect(8844, 'localhost', options, () => {
            console.log('Root certificate is installed.');
            socket.end();
            resolve(true);
        });

        socket.on('error', (error) => {
            resolve(false);
            socket.end();
        });
    });
}

async function startTestServer() {
    const options = getHttps(true);
    https
        .createServer(options, (req, res) => {
            res.writeHead(200);
            res.end('Hello World!');
        })
        .listen(8844);
}

function readFileFromDir(file) {
    return fs.readFileSync(path.resolve(__dirname, file), 'utf-8');
}
function readFileFromDirAsync(file) {
    return fs.readFile(path.resolve(__dirname, file), 'utf-8');
}

// 调用检测函数

module.exports = getHttps = ({ autoInstall = true } = {}) => {
    if (autoInstall) {
        checkRootCertificateInstallation().then((res) => {
            if (!res) {
                install();
            }
        });
    }
    return {
        cert: localhostCrt,
        key: localhostKey,
    };
};
