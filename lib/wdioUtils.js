function clickByLinkText(text,parentEle = browser) {
  let sel = `*=${text}`
  parentEle.$(sel).click()
}
function clickButtonContainText(text) {
  let sel = `//button[contains(.,'${text}')]`
  $(sel).click()
}

function eleOrSelWrapper(eleOrSel) {
  return isSelString(eleOrSel) ? $(eleOrSel) : eleOrSel
}

function getBrowserInfo() {
  let cap = browser.options.capabilities || browser.capabilities || {browserName: 'Unknown', browserVersion: '0.0'}
  return {
    browserName: cap.browserName ,
    version: cap.browserVersion || cap.version
  }
}
function getTextAndTrim(ele) {
  return ele.getText().trim()
}

function isSafari() {
  return getBrowserInfo().browserName === 'Safari'
}
function isSelString(eleOrSel) {
  return typeof eleOrSel === 'string'
}
 
function safeGetText(eleOrSel) {
  let ele = eleOrSelWrapper(eleOrSel)
  try {
    return getTextAndTrim(ele)
  } catch (error) {
    return ''
  }
}

function waitUntilUrlIncludes(text) {
  browser.waitUntil(() => browser.getUrl().includes(text))
}
function jsClick(ele) {
  browser.execute(function(ele){ele.click()},ele)
}

module.exports = {
  clickByLinkText,
  clickButtonContainText,
  eleOrSelWrapper,
  getBrowserInfo,
  getTextAndTrim,
  isSafari,
  isSelString,
  jsClick,
  safeGetText,
  waitUntilUrlIncludes,
}