const { readCert } = require('./utils');

const getLocalhostCerts = () => {
    const localhostCrt = readCert('localhost.crt');
    const localhostKey = readCert('localhost.key');
    return {
        cert: localhostCrt,
        key: localhostKey,
    };
};

module.exports = getLocalhostCerts;
