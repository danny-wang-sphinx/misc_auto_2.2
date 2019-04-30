const logQueryServer = require('../data/testbed').logQueryServer
const protectedSite = require('../data/profile').defaultProfile.protectedSite
const SecurityLogPage = require('../pages/logs.security')
const LogSettingPage = require('../pages/system.settings.log')
const commonUtil = require('./commonUtil')
const controlServerUtil = require('./controlServerUtil')
const data = require('../data/system.settings')

function setRawLog(page,enabled,logServerIp=data.logServerIp,protocol='udp') {
  toLogTab(page)
  page.actionLogger.warn('set rawlog to ',enabled,logServerIp,protocol)
  let needSave = false
  if(page.getRawLogToggleStatus() != enabled) {
    page.toggleRawLog(enabled)
    needSave = true
  }
  if(enabled) {
    if(page.getRawLogServer() != logServerIp) needSave = true
    if(page.getRawLogProtocol() != protocol) needSave = true
    page.inputRawServer(logServerIp,undefined,protocol)
  }
  if(needSave) page.clickSave()
}
function rawLogUiChecker(page) {
  toLogTab(page)
  let enabled = page.getRawLogToggleStatus(), detail = {}
  page.actionLogger.warn('read raw log toggle status', enabled)
  if (enabled) {
    detail['protocol'] = page.getRawLogProtocol()
    detail['server'] = page.getRawLogServer()
    page.actionLogger.warn('read raw log detail', detail)
  }
  return {enabled,detail}
}
function iniatePageAndSetformattedLog(enabled,logServerIp=data.logServerIp,protocol='udp',src='all') {
  let page = new LogSettingPage()
  page.open()
  setformattedLog(page,enabled,logServerIp,protocol,src)
}
function setformattedLog(page,enabled,logServerIp=data.logServerIp,protocol='udp',src='all') {
  toLogTab(page)
  page.actionLogger.warn('set formated log to ',enabled,logServerIp,protocol,src)
  let needSave = false
  if(page.getFormattedLogToggleStatus()!=enabled) {
    page.toggleFormatedLog(enabled)
    needSave = true
  }
  if(enabled) {
    if(page.getFormattedLogProtocol() != protocol) needSave = true
    if(page.getFormattedLogServer() != logServerIp) needSave = true
    if(page.getFormattedLogSource() != src) needSave = true
    page.inputFormatedServer(logServerIp,undefined,protocol,src)
  }
  if(needSave) page.clickSave()
}
function formattedLogUiChecker(page) {
  toLogTab(page)
  let enabled = page.getFormattedLogToggleStatus(), detail = {}
  if (enabled) {
    detail['protocol'] = page.getFormattedLogProtocol()
    detail['server'] = page.getFormattedLogServer()
    detail['source'] = page.getFormattedLogSource()
  }
  return {enabled,detail}
}
function funcitonChecker(...logTypes) {
  let logPage = new SecurityLogPage()
  logPage.toLogs()
  logPage.toSecurityTab()
  logPage.actionLogger.warn('issue command to log queryserver to clear the data')
  controlServerUtil.issueCommandToClearLogs()
  let curlUrl = `/${commonUtil.timeStampAndRanNum()}`,funcResult = {}
  let curlUrlJs = curlUrl+'.js'
  logPage.actionLogger.warn('the curlurl is', curlUrl, curlUrlJs)
  _curlResources(curlUrl,curlUrlJs)
  //Not use open, because in case change the cases to login as other account
  logPage.actionLogger.warn('search curlurl in the security log page', curlUrl,curlUrlJs)
  logPage.keepSearchTillTableContain(curlUrl)
  logPage.actionLogger.warn('done: search curlurl in the security log page', curlUrl,curlUrlJs)
  //Now the logserver should have data,usually parsedlog is delayed
  logTypes.forEach((logType) => {
    let logs = controlServerUtil.getLogsByLogType(logType,undefined)
    funcResult[logType] = logs
  })
  return {funcResult,curlUrl,curlUrlJs}
}
function toLogTab(page) {
  page.toSystemSettings()
  page.toLogTab()
}
function _curlResources(curlUrl,curlUrlJs) {
  commonUtil.curlResource(protectedSite,curlUrlJs)
  commonUtil.curlResource(protectedSite,curlUrl)
}
module.exports = {
  iniatePageAndSetformattedLog,
  setRawLog,
  setformattedLog,
  rawLogUiChecker,
  formattedLogUiChecker,
  funcitonChecker
}