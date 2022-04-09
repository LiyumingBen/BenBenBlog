---
title: vue项目本地开启https访问模式
date: 2022-04-09 16:57:36
permalink: /pages/049002f6abcca/
categories:
  - vue学习
tags:
  - vue
---
## vue项目本地开启https访问模式
> 在实际开发中，我们除了以http的形式进行页面访问，还会以https形式进行页面访问，但是根据vue-cli的版本不同，配置方式也有所差异，以下分别从vue-cli3.x、vue-cli4.x和vue-cli2.x构建的项目分别进行配置开启https:


1、**vue-cli3.x和vue-cli4.x**
> 使用vue脚手架3.x和vue-cli4.x搭建的项目，配置开启https方法比较简单，在项目根目录下的vue.config.js文件中增加属性 https: true 即可。

```
// vue.config.js
module.exports = {
    // 配置 webpack-dev-server 行为。
    devServer: {
        open: true, // 编译后默认打开浏览器
        host: '0.0.0.0',  // 域名
        port: 8080,  // 端口
        https: true,  // 是否https
        // 显示警告和错误
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/api': {
                target: 'http://xxx..com',
                changeOrigin: true, //是否跨域
                ws: false, // 是否支持websocket
                secure: false, // 如果是https接口，需要配置这个参数
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }

}

```
2、**vue-cli2.x**

> 使用cli2.x搭建的项目开启https较为复杂，关键是openssl生成证书文件，如果本地没有证书，要先生成证书，以及修改项目中配置

① 在build文件夹下新建 cert 文件夹，在cert目录下打开控制终端输入以下命令生成私钥 **privatekey.pem** 文件

```
openssl genrsa -out privatekey.pem 102

```

② 通过上面生成的**privatekey.pem**私钥文件生成CSR 证书签名**certrequest.csr**，根据要求填写一些相关信息，可一路按回车即可

```
openssl req -new -key privatekey.pem -out certrequest.csr

```
③ 根据上述私钥文件和csr证书签名文件生成证书文件

```
openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
```

最终生成3个文件：

![https://wos.58cdn.com.cn/IjGfEdCbIlr/ishare/pic_WbVaU5XU377bV97b5a5a35V95a35V959.png](https://wos.58cdn.com.cn/IjGfEdCbIlr/ishare/pic_WbVaU5XU377bV97b5a5a35V95a35V959.png)

3、在项目中webpack.dev.conf.js配置

![https://wos.58cdn.com.cn/IjGfEdCbIlr/ishare/pic_V9d313Wc595a13d1U7U7d17bU7d35937.png](https://wos.58cdn.com.cn/IjGfEdCbIlr/ishare/pic_V9d313Wc595a13d1U7U7d17bU7d35937.png)

4、重新npm run dev启动

>注意： chrome可能会出现 **您的连接不是私密连接**

  解决方案：
1、解决办法就是在当前页面用键盘输入 **thisisunsafe** ，不是在地址栏输入，就直接敲键盘就行了，页面即会自动刷新进入网页。
2、使用 **Firefox**