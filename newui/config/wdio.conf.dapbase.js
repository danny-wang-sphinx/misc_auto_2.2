const fs = require('fs')
const merge = require('deepmerge')
const {addAttachment} = require('@wdio/allure-reporter').default
const logger = require('@wdio/logger').default

let baseConf = require('../../wdio.conf')
let dapConf = require('../data/dapConf')
const jasminLogger = logger('[Jasmine]')

const topReportDir = __dirname + '/../reports'

if (!fs.existsSync(topReportDir)) fs.mkdirSync(topReportDir)

let browserMap = baseConf.config.browserMap
let browserName = process.env.BROWSER_NAME || 'chrome'
let caps = [browserMap[browserName]]

exports.config = merge(baseConf.config, {
  maxInstances: 1,
  hostname: dapConf.seleniumHubServer,
  // Level of logging verbosity:  trace | debug | info | warn | error | silent
  logLevel: 'warn',
  jasmineNodeOpts: {
    //
    // Jasmine default timeout
    defaultTimeoutInterval: 180000,
  },
  beforeTest: function (test) {
    jasminLogger.warn('Start testing', test.fullName)
  },
  afterTest: function (test) {
    if (test.error != undefined) {
      let browserLogs = browser.getLogs('browser')
      browser.takeScreenshot()
      let browserErrorlog = browserLogs.filter((log) => log['level'] === 'SEVERE')
      let toDump = {
        currentUrl: browser.getUrl(),
        testError: test.error,
        browserErrorlog
      }
      let dumpString = JSON.stringify(toDump, null, 2)
      addAttachment('errors', dumpString)
      addAttachment('pageSource', browser.getPageSource())
    }
  },
  capabilities: caps
}, {
    clone: false
  })

exports.dapConf = dapConf
