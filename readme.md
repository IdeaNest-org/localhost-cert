# Localhost cert

The localhost-certs npm package is designed to provide a convenient way to quickly set up HTTPS support for localhost. Its main purpose is to simplify the process of generating and installing a root certificate that enables HTTPS connections to localhost.

With localhost-certs, you can easily get localhost certificate that is specifically tailored for localhost websites. The root certificate is generated using GitHub Actions, ensuring a transparent and auditable process. Importantly, the package discards the private key of the root certificate, preventing its misuse for generating certificates for websites other than localhost.

## Installation

```bash
npm install localhost-cert
```

## Usage

### webpack-dev-server

```javascript
const localhostCerts = require('localhost-certs');
module.exports = {
    devServer: {
        https: localhostCerts(),
    },
};
```
