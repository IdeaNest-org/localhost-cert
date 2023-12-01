const {
    readFileFromDir,
    readFileFromDirAsync,
    getRootCrt,
} = require('../modules/utils');

console.log(readFileFromDir('certs/root.crt'));

readFileFromDirAsync('certs/root.crt').then((res) => {
    console.log(res);
});
getRootCrt().then((res) => {
  console.log(res);
});
