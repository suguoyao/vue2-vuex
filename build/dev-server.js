require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()

// http请求模块
const superagent = require('superagent')

// 模拟后台假数据
let appData = require('../mockdata.json')
let self = appData.self
let friend = appData.friend

let apiRoutes = express.Router()

apiRoutes.get('/self', (req, res) => {
  res.json({data: self})
})

apiRoutes.get('/friends', (req, res) => {
  res.json({data: friend})
})

// 测试salesforce接口
apiRoutes.get('/getBusinessCard', (req, res) => {
  let response = res;
  let url = 'https://ap4.salesforce.com/services/data/v37.0/query?q=' + encodeURIComponent('SELECT Id, Name, Mobile__c, Company__c FROM Business_Card__c');
  let sessionId = '00D6F000001v8ld!ARwAQH6bia1sVzA.4jFWTuvZUiSNdM8aFu4ogGYYWGVmjrT.UF0zhFvsQnM5tEPwYu89hFCrBheKdFKQtoRkmEroBXj2.n0T';
  superagent.get(url)
    .set('Authorization', 'Bearer ' + sessionId)
    .end((err, res) => {
      if (err) {
        console.log(err)
      }
      response.json({
        data: res.text
      })
    })
})

app.use('/api', apiRoutes)


var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {
  }
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'})
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
