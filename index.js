// 判断当前是否存在文件
const fs = require('fs');
const path = require('path');
const createRootCert = require('./createRootCert');
const saveAndDelete = require('./saveAndDelete');

function isFileExist(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

if (
    !isFileExist(path.resolve(__dirname, 'root.pem')) ||
    !isFileExist(path.resolve(__dirname, 'localhost.key')) ||
    !isFileExist(path.resolve(__dirname, 'localhost.pem'))
) {
    createRootCert();
    saveAndDelete();
} else {
    console.log('certs already exist');
}
