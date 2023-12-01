const checkRootCertInstall = require('../modules/checkRootCertInstall');
const installRootCert = require('../modules/installRootCert');
checkRootCertInstall().then((res) => {
    console.log(res);
    if (!res) {
        console.log('start install root cert')
        installRootCert();
    }
});
