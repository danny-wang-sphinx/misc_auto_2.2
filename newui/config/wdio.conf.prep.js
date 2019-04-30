const fs = require('fs')
const merge = require('deepmerge')
let baseConf = require('./wdio.conf.dapbase')
let dapConf = baseConf.dapConf

const topDir = __dirname + '/..'

const reportDir = topDir + '/reports/prep'

if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir)

exports.config = merge(baseConf.config, {
  outputDir: reportDir,
  specs: [topDir + '/preparation/setup.*.js'],
  baseUrl: dapConf.webConsoleUrl,
}, {
    clone: false
  })

  exports.config.reporters.push(['allure', {
    outputDir: reportDir,
    disableWebdriverStepsReporting: false,
    disableWebdriverScreenshotsReporting: false,
  }])