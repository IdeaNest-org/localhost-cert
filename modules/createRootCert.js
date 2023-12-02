const forge = require('node-forge');
const { writeCert } = require('./utils');

module.exports = function createRootCert() {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
        cert.validity.notBefore.getFullYear() + 20
    );

    const attrs = [
        {
            name: 'commonName',
            value: 'Localhost Root Ca No.1',
        },
        {
            name: 'countryName',
            value: 'US',
        },
        {
            shortName: 'ST',
            value: 'Virginia',
        },
        {
            name: 'localityName',
            value: 'Blacksburg',
        },
        {
            name: 'organizationName',
            value: 'localhost-cert',
        },
        {
            shortName: 'OU',
            value: 'LH',
        },
    ];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([
        {
            name: 'basicConstraints',
            cA: true,
        },
        {
            name: 'keyUsage',
            keyCertSign: true,
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true,
        },
        {
            name: 'subjectKeyIdentifier',
        },
    ]);
    cert.sign(keys.privateKey, forge.md.sha256.create());

    // generate a server keypair
    const serverKeys = forge.pki.rsa.generateKeyPair(2048);
    const serverCert = forge.pki.createCertificate();
    serverCert.publicKey = serverKeys.publicKey;
    serverCert.serialNumber = '01';
    serverCert.validity.notBefore = new Date();
    serverCert.validity.notAfter = new Date();
    serverCert.validity.notAfter.setFullYear(
        serverCert.validity.notBefore.getFullYear() + 20
    );

    const serverAttrs = [
        {
            name: 'commonName',
            value: 'Localhost Root Ca No.1',
        },
        {
            name: 'countryName',
            value: 'US',
        },
        {
            shortName: 'ST',
            value: 'Virginia',
        },
        {
            name: 'localityName',
            value: 'Blacksburg',
        },
        {
            name: 'organizationName',
            value: 'localhost-cert',
        },
        {
            shortName: 'OU',
            value: 'LH',
        },
    ];
    serverCert.setSubject(serverAttrs);
    serverCert.setIssuer(cert.subject.attributes);
    serverCert.setExtensions([
        {
            name: 'basicConstraints',
            cA: false,
        },
        {
            name: 'keyUsage',
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true,
        },
        {
            name: 'subjectAltName',
            altNames: [
                {
                    type: 2, // DNS
                    value: 'localhost',
                },
            ],
        },
    ]);
    serverCert.sign(keys.privateKey, forge.md.sha256.create());
    // save root certificate and key
    const rootCrt = forge.pki.certificateToPem(cert);
    const localhostCrt = forge.pki.certificateToPem(serverCert);
    const localhostKey = forge.pki.privateKeyToPem(serverKeys.privateKey);

    writeCert('root.pem', forge.pki.certificateToPem(cert));
    writeCert('root.crt', forge.pki.certificateToPem(cert));

    // save server certificate and key
    writeCert('localhost.crt', forge.pki.certificateToPem(serverCert));
    writeCert(
        'localhost.key',
        forge.pki.privateKeyToPem(serverKeys.privateKey)
    );
    console.log('certs created');
    console.log('-----------------root.pem-----------------');
    console.log(rootCrt);
    console.log('-----------------localhost.crt-----------------');
    console.log(localhostCrt);
    console.log('-----------------localhost.key-----------------');
    console.log(localhostKey);
};
