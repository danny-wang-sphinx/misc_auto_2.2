const commonUtil = require('../../lib/commonUtil')
const controlServerUtil = require('./controlServerUtil')

function accessEchoSiteAndSubmitForm(siteUrl,inputValue='randomly') {
  browser.url(siteUrl)
  let form = $('#form1')
  form.$('input[type="text"]').setValue(inputValue)
  form.$('input[type="submit"]').click()
  return browser.getPageSource()
}
function accessTestwebFromBrowserAndPageSource(siteUrl) {
  browser.url(siteUrl)
  try {
    let ele = $(`*=SetUserCookie`)
    if (ele.isExisting()) {
      ele.click()
    }
  } catch (e) {console.log('catch e',e)}
  return browser.getPageSource()
}
function curlResource(site,uri,query,options) {
  let uriAndQuery = _concatUriWithQuery(uri,query)
  return commonUtil.curlRawData(`${site}${uriAndQuery}`,options)
}
function curlWithValidCookieToken(site,uri,query,options) {
  browser.url(site)
  let cookies = browser.getAllCookies()
  let cookieString = cookies.map((val) => `${val.name}=${val.value}`).join(';')
  return curlResource(site,uri,query,`-H 'Cookie: ${cookieString}' ${options}`)
}
function filterBy(fromRes,keywords) {
  return fromRes.filter((val) => val.includes(keywords))
}
function statusEqual(statusCode,expectedCode) {
  return statusCode == expectedCode
}
function isAutoToolDetectedPageContent(content) {
  return content.includes('<body></body>')
}
function isBlockingPageContent(content, templateContent) {
  let bodyTextIdx = templateContent.indexOf('<body')
  console.log('bodyTextIdx: ' + bodyTextIdx)
  let keywordStr=templateContent.substring(bodyTextIdx)
  console.log('keywordStr: ' + keywordStr)
  return content.includes(keywordStr)
}
function isNoScriptResponse(content) {
  return content.includes('<head><noscript><meta http-equiv="Set-Cookie" content="')
}
function isKeywordExistInArray(fromRes,keyword) {
  return fromRes.some((val) => val.includes(keyword))
}
function isPowerPageResponse(content) {
  const powerCoreJSLink = `src="/4QbVtADbnLVIc/c.FxJzG50F.js`
  return content.includes(powerCoreJSLink)
}
function isEssentialPageResponse(content) {
  const essentialCoreJSLink = `src="/4QbVtADbnLVIc/d.FxJzG50F.js`
  return content.includes(essentialCoreJSLink)
}
function isProtectionPageResponse(content) {
  return isEssentialPageResponse(content) || isPowerPageResponse(content)
}

let isBlankPageStatus = (statusCode) => statusEqual(statusCode,200)
let isBlockingPageStatus = (statusCode) => statusEqual(statusCode,200)
let isRedirectStatus = (statusCode) => statusEqual(statusCode,302)
let isRejectStatus = (statusCode) => statusEqual(statusCode,400)
let isReloadByStatusCode = (statusCode) => statusEqual(statusCode,202)
let timeStampAndRanNum = () =>  Date.now() + '' + commonUtil.random(100)

function stubAndGetParsedLogs(testSite,maxTimeoutInSeconds=240) {
  // Use timestamp as unique uri, to check the log is logged
  let timeStamp = timeStampAndRanNum()
  curlResource(testSite,`/${timeStamp}`)
  _waitTillLogServerContain(`/${timeStamp}`,maxTimeoutInSeconds)
  return controlServerUtil.getParsedLogs(browser)
}
function _waitTillLogServerContain(keyword,maxTimeoutInSeconds) {
  let found = false
  let stopTime = Date.now() + maxTimeoutInSeconds*1000000
  while(!found && Date.now()<stopTime) {
    controlServerUtil.getParsedLogs(browser)
    try {
      browser.waitUntil(()=>browser.getPageSource().includes(keyword),3000,`no match ${keyword}`,2000)
    } catch (error) {
    }
    found = browser.getPageSource().includes(keyword)
  }
}
function _concatUriWithQuery(uri,query) {
  if (query && query.length > 0) {
    let concatChar = uri.includes('?') ? '&' : '?'
    return `${uri}${concatChar}${query}`
  } else {
    return uri
  }
}
module.exports = {
  accessEchoSiteAndSubmitForm,
  accessTestwebFromBrowserAndPageSource,
  arrayShowEqual: commonUtil.arrayShallowEqual,
  curlRawData: commonUtil.curlRawData,
  curlResource,
  curlWithValidCookieToken,
  filterBy,
  isAutoToolDetectedPageContent, isBlockingPageContent, isKeywordExistInArray,
  isBlankPageStatus, isBlockingPageStatus, isNoScriptResponse,
  isRedirectStatus, isRejectStatus, isReloadByStatusCode,
  isEssentialPageResponse,isPowerPageResponse,isProtectionPageResponse,
  stubAndGetParsedLogs,
  timeStampAndRanNum
}