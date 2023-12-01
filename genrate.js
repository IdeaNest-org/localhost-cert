// 判断当前是否存在文件
const fs = require('fs');
const path = require('path');
const createRootCert = require('./modules/createRootCert');
const uploadToGithub = require('./modules/uploadToGithub');

function isFileExist(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

if (
    !isFileExist(path.resolve(__dirname, 'certs/root.crt')) ||
    !isFileExist(path.resolve(__dirname, 'certs/localhost.key')) ||
    !isFileExist(path.resolve(__dirname, 'certs/localhost.crt'))
) {
    createRootCert();
    uploadToGithub();
} else {
    console.log('certs already exist');
}
