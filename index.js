// 调用检测函数
const checkRootCertInstall = require('./modules/checkRootCertInstall');
const installRootCert = require('./modules/installRootCert');
const { readCert } = require('./modules/utils');
const getHttpsConfig = ({ autoInstall = true } = {}) => {
    if (autoInstall) {
        checkRootCertInstall().then((res) => {
            console.log('is root install', res);
            if (!res) {
                installRootCert();
            }
        });
    }
    return {
        cert: readCert('localhost.crt'),
        key: readCert('localhost.key'),
    };
};
module.exports = getHttpsConfig;
