const dapConf = require('./dapConf')

module.exports = {
  dapServer: dapConf.dapServer,
  relayServer: dapConf.relayServer,
  logQueryServer: dapConf.logQueryServer,
  controlServer: dapConf.controlServer,
  defaultTimeZone: dapConf.defaultTimeZone
}