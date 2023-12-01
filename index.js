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
