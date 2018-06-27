<img src="http://sdx.hefupb.com/dist/images/sdx_home.gif">
<img src="http://sdx.hefupb.com/dist/images/sdx_fund2.gif">

# framework7-webpack-demo

> A demo project for using Framework7 with Webpack3.0 via Babel!

[Online Demo](http://sdx.hefupb.com/dist/#!/page/main.html)

请在手机端下打开！！

### Dependencies

* [Framework7](http://framework7.io/)
* [Webpack](https://webpack.js.org/)
* [Babel](https://babeljs.io/)
* [Less](https://github.com/less/less.js)
* [Polyglot](https://github.com/airbnb/polyglot.js) For i18n.


### Template

We have a base [webpack-framework7](https://github.com/workplus-templates/webpack-framework7) template, you can use [WorkPlus-cli](https://github.com/WorkPlusFE/WorkPlus-cli) to get it.

```bash
[sudo] npm install -g workplus-cli

workplus start webpack-framework7 my-project
```


### Download

```bash
git clone https://github.com/hejianxian/framework7-webpack-demo.git

cd framework7-webpack-demo

npm install

```

Or you can use [Yarn](https://github.com/yarnpkg/yarn).

### Dev

```bash
npm run dev
```

If need proxy, you can use [devserver-proxy](https://webpack.js.org/configuration/dev-server/#devserver-proxy) to enable proxying.

Just like:

```js
proxy: {
  "/api": "http://localhost:8081"
}
```

Some config setting, you can find in `./build/config.js`:

```js
module.exports = {
  dev: {
    host: 'localhost',
    port: 8080,
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
}
```

### Build

``` bash
npm run build
```

### LICENSE

MIT [@likaiming](https://github.com/fxk01/)

