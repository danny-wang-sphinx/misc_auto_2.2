const testbed = require('../data/testbed')
const commonUtil = require('../../lib/commonUtil')
const logQueryServer = testbed.logQueryServer
const controlServer = testbed.controlServer

/* Log Query Server */
function getLogsByLogType(logType,browser=undefined) {
  const fullUrl = `http://${logQueryServer}/${logType}`
  let res
  if (browser !== undefined) {
    browser.url(fullUrl)
    res = browser.getPageSource()
  } else {
    res = commonUtil.curlRawData(fullUrl).body
  }
  return res
}
function getParsedLogs(browser=undefined) {
  return getLogsByLogType('parsedLogs',browser, logQueryServer)
}
function getRawLogs(browser=undefined) {
  return getLogsByLogType('rawLogs',browser, logQueryServer)
}
function issueCommandToClearLogs() {
  return commonUtil.curlRawData(`${logQueryServer}/clearLogs`)
}
/* Echo Server */
function startEchoServer1() {
  return _issueCommandToControlServer(controlServer,'start=server1')
}
function startEchoServer2() {
  return _issueCommandToControlServer(controlServer,'start=server2')
}
function stopEchoServer1() {
  return _issueCommandToControlServer(controlServer,'stop=server1')
}
function stopEchoServer2() {
  return _issueCommandToControlServer(controlServer,'stop=server2')
}
function _issueCommandToControlServer(controlServer,query) {
  return commonUtil.curlRawData(`${controlServer}/command?${query}`)
}

module.exports = {
  getLogsByLogType,
  getParsedLogs,
  getRawLogs,
  issueCommandToClearLogs,
  startEchoServer1,
  startEchoServer2,
  stopEchoServer1,
  stopEchoServer2
}