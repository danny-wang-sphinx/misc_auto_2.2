const SecurityLogPage = require('../pages/logs.security')
const SettingsPage = require('../pages/protection.settings')
const commonUtil = require('./commonUtil')
const data = require('../data/protection.settings')

function getSrcIPfromLogPage(protectedSite,curlOptions) {
  let logPage = new SecurityLogPage()
  logPage.open()
  let curlUrl = `/${commonUtil.timeStampAndRanNum()}`
  logPage.actionLogger.warn('curl resource',curlUrl)
  commonUtil.curlResource(protectedSite,curlUrl,'',curlOptions)
  //wait till securiyt log has info
  logPage.keepSearchTillTableContain(curlUrl)
  let logs = logPage.securityLogs()
  let logEntry = commonUtil.filterBy(logs,curlUrl)[0]
  logPage.actionLogger.warn('filtered logEntry',curlUrl,logEntry)
  // Ipindex is 5
  let funcValue = logEntry[5]
  return {curlUrl, funcValue}
}
function checkSetAndSaveSrcIp(page,srcIPFrom,xffPosition=undefined) {
  _toPage(page)
  page.actionLogger.warn('checksetandsave',srcIPFrom,xffPosition)
  let needSave = false
  if(page.getSourceIPVal() != srcIPFrom) {
    page.setSourceIpByValue(srcIPFrom)
    needSave = true
  }
  if(xffPosition && page.getXffPositionVal() != xffPosition) {
    page.setXffPositionByValue(xffPosition)
    needSave = true
  }
  page.actionLogger.warn('checksetandsave, needsave',needSave)
  if(needSave) {
    page.clickSave()
    page.actionLogger.warn('after save click')
  }
}
function getSrcIpUiStatus(page) {
  _toPage(page)
  let srcIPFrom = page.getSourceIPVal()
  page.actionLogger.warn('current srcip', srcIPFrom)
  let xffPosition
  if(srcIPFrom == data.xff) {
    xffPosition = page.getXffPositionVal()
  } 
  page.actionLogger.warn('curreent xffPostion', xffPosition)  
  return {srcIPFrom, xffPosition}
}
function setupSrcIp(srcIPFrom=data.xrealIp,xffPosition=undefined) {
  let page = new SettingsPage()
  page.open()
  checkSetAndSaveSrcIp(page,srcIPFrom,xffPosition)
}
function _toPage(page) {
  page.toProtection()
  page.toSettingsTab()
}
function disableAllErrorTemplate(needSave=true) {
  let page = new SettingsPage()
  page.open()
  data.allErrorIds.forEach((id) => {
    page.toggleErrorTemplate(id,false)
  })
  if(needSave) {
    page.clickSave()
  }
}
function getErrorUiStatus(page,errorCodes) {
  _toPage(page)
  let res = {}
  errorCodes.forEach((testCode) => {
    let actual = page.getErrorTemplateStatus(testCode)
    res[testCode] = actual
  })
  return res
}
function setErrorStatusByObj(page,testCodesAndStatus) {
  disableAllErrorTemplate(false)
  Object.keys(testCodesAndStatus).forEach((testCode) => {
    page.toggleErrorTemplate(testCode,testCodesAndStatus[testCode])
  })
  page.clickSave()
}
function accessPageWithErrorCodes(testCodes,protectedSite) {
  let res = {}
  testCodes.forEach((testCode) => {
    browser.url(`${protectedSite}/?returnCode=${testCode}`)
    $('body').waitForDisplayed(50000,'body not displayed')
    let bodyText = $('body').getText()
    res[testCode] = bodyText
  })
  return res
}

module.exports = {
  accessPageWithErrorCodes,
  checkSetAndSaveSrcIp,
  disableAllErrorTemplate,
  getErrorUiStatus,
  getSrcIPfromLogPage,
  getSrcIpUiStatus,
  setErrorStatusByObj,
  setupSrcIp,
}