const fs = require('fs')
const merge = require('deepmerge')
let baseConf = require('./wdio.conf.dapbase')
let dapConf = baseConf.dapConf

const topDir = __dirname + '/..'

const reportDir = topDir + '/reports/all'

if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir)

exports.config = merge(baseConf.config, {
  outputDir: reportDir,
  specs: [
    //topDir + '/specs/**/*.basic.js',
    //topDir + '/specs/**/*.comp.js',
    //topDir + '/specs/protection/profile.invalidRequest.basic.js',
    topDir + '/specs/protection/profile.browserBlock.basic.js',
  ],
    baseUrl: dapConf.webConsoleUrl,
    }, {
    clone: false
  })

exports.config.reporters.push(['allure', {
  outputDir: reportDir,
  disableWebdriverStepsReporting: true,
  disableWebdriverScreenshotsReporting: false,
}])
