
# Localhost Https / Localhost Cert

## A secure and convenient solution for enabling HTTPS on localhost

## Other languages
[chinese](readme.zh_CN.md)

### When to use Localhost Cert?

If you need to enable HTTPS when starting a local development server, then Localhost Cert is the tool you need. It allows you to quickly obtain pre-generated certificates.

### Is it necessary to install the root certificate?

Similar to most proxy tools, you still need to install the root certificate. This is because Localhost Cert uses a self-signed certificate, which is not trusted by default in browsers. Although installing the root certificate locally is safe.

### Why is it secure?

If you have a basic understanding of HTTPS, you know that installing a CA root certificate locally can be risky. This is because the root certificate can be used to sign any domain, such as google.com, enabling man-in-the-middle attacks. However, Localhost Cert immediately discards the private key of the root certificate after generating the localhost domain certificate. Therefore, it is impossible for anyone to use this root certificate to sign other websites.

To ensure that the private key is not remembered, Localhost Cert utilizes GitHub Actions to generate the root certificate. The process of generating the certificate and the code at that time are fully traceable on GitHub. If you're interested, you can view the [GitHub Action](https://github.com/IdeaNest-org/localhost-cert/actions/runs/7056302734) for more details.

In summary, it is completely secure due to two reasons:
1. The process of generating the root certificate is based on GitHub Actions and is fully traceable.
2. After signing the localhost domain, the private key of the root certificate is discarded and cannot be used to sign other domains.

### How to use?

```bash
npm install localhost-https --save-dev
```

#### webpack-dev-server

```javascript
const getHttps = require('localhost-cert');

// webpack config
module.exports = {
    devServer: {
        https: getHttps(),
    },
};
```

```javascript
// vite config
const getHttps = require('localhost-cert');
export default defineConfig({
    server: {
        https: getHttps(),
    },
});
```
### License

Localhost Cert is licensed under the MIT License.