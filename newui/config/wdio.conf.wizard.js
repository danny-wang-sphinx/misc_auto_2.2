const fs = require('fs')
const merge = require('deepmerge')
let baseConf = require('./wdio.conf.dapbase')
let dapConf = baseConf.dapConf

const topDir = __dirname + '/..'

const reportDir = topDir + '/reports/wizard'

if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir)

exports.config = merge(baseConf.config, {
  outputDir: reportDir,
  // Level of logging verbosity:  trace | debug | info | warn | error | silent
  logLevel: 'trace',
  specs: [topDir + '/preparation/wizard.js'],
  baseUrl: dapConf.wizardUrl,
}, {
    clone: false
  })

  exports.config.reporters.push(['allure', {
    outputDir: reportDir,
    disableWebdriverStepsReporting: true,
    disableWebdriverScreenshotsReporting: false,
  }])