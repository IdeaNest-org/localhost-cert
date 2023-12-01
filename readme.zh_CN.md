# Localhost Cert

## 一个安全、便捷的 localhost 支持 HTTPS 的方案
[English](readme.md)
### 什么时候使用 Localhost Cert？

如果你在启动本地开发服务器时需要开启 https，那么 Localhost Cert 就是你需要的工具。它可以快速获取已经生成的证书。

### 是否需要安装根证书？

和大多数代理工具一样，你仍然需要安装根证书。这是因为 Localhost Cert 使用了自签名证书，而浏览器默认不信任自签名证书。虽然在你本地安装了根证书，但是这是绝对安全的。

### 为什么是安全的？

如果你对 HTTPS 有一定的了解，那么你应该知道如果在本地安装一个 CA 根证书，这是一个很危险的事，因为这个根证书可以用于签名任何域名比如，google.com. 从而达到中间人劫持，但是 Localhost Cert 生成 localhost 的域名后，立马丢弃了根证书的私钥，也就是说，即便有人想用这个根证书对其他网站签名是不可能的。
那么是如何保证私钥没有被记住呢，Localhost cert 是利用 github action 生成根证书的，github Action 生成的过程以及 github 当时的代码是完全可追踪的，如果感兴趣可以查看[github action](https://github.com/IdeaNest-org/localhost-cert/actions/runs/7004987626/job/19053845251)

总结一下基于两点，它是完全安全的
1、生成根证书的过程是基于 github action，是完全可追踪的
2、签名 localhost 域名后，根证书私钥被丢弃了，无法用于签名其他域名

### 如何使用？

```bash
npm install localhost-cert --save-dev
```

#### wevpack-dev-server

```javascript
const getHttps = require('localhost-https');

// webpack config
module.exports = {
    devServer: {
        https: getHttps(),
    },
};
```

```javascript
// vite config
const getHttps = require('localhost-https');
export default defineConfig({
    server: {
        https: getHttps({
            // 如果开发者没有安装根证书，那么会引导开发者安装根证书.
            autoInstall: true,
        }),
    },
});
```

### License

Localhost Cert is licensed under the MIT License.
