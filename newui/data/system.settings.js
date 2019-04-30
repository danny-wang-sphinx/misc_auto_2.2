const dapConf = require('./dapConf')

module.exports = {
  defaultLASize: 12,
  defaultBackupSize: 13,
  logServerIp: dapConf.logServerIp,
  rawLog: 'rawLogs',
  formattedLog: 'parsedLogs',
}