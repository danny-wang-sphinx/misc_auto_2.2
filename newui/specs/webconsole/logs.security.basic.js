const LogsSecurityPage = require('../../pages/logs.security')
const commonUtil = require('../../specUtils/commonUtil')
const logUtil = require('../../specUtils/logs')

describe('security log', () => {
  let page = new LogsSecurityPage()
  const inject = page.PageContants.logsPageText.inject
  const cookie = page.PageContants.logsPageText.cookie
  let nonWhiteListUrl = `/${commonUtil.timeStampAndRanNum()}`
  let injectUrl = `/${commonUtil.timeStampAndRanNum()}.js`

  beforeAll(() =>  {
    logUtil.setUpWafAndWaitTillLogShow(page,nonWhiteListUrl,injectUrl)
  })

  beforeEach(() => { page.toLogs(); page.toSecurityTab();page.clickClearButton();})

  it('show data correctly', () => {
    let actual = page.securityLogs()
    page.actionLogger.warn('securityLogs', actual)
    let filteredCookie = commonUtil.filterBy(actual,cookie.Type)
    let filteredInject = commonUtil.filterBy(actual,inject.Type)
    expect(filteredCookie.length).not.toBe(0)
    expect(filteredInject.length).not.toBe(0)
    expect(commonUtil.isKeywordExistInArray(filteredCookie,'GET')).toBe(true)
  })
  
  it('category deselect inject, result will not show inject entries', () => {
    page.toggleCatByText(inject.displayText, false)
    page.clickSearchButton()
    let actual = page.securityLogs()
    page.actionLogger.warn('securityLogs', actual)
    expect(commonUtil.isKeywordExistInArray(actual, inject.Type)).toBe(false)
  })
  it('display column deselect method, result table will not show method', () => {
    let method = 'Method'
    page.toggleColByText(method, false)
    page.clickSearchButton()
    let oldValue = page.securityLogs()
    
    //toggle back
    page.toggleColByText(method,true)
    page.clickSearchButton()
    let newValue = page.securityLogs()

    expect(commonUtil.isKeywordExistInArray(oldValue,'GET')).toBe(false)
    expect(commonUtil.isKeywordExistInArray(newValue,'GET')).toBe(true)
  })
  it('search by cookieid', () => {
    _testSearchBy('Cookie')
  })
  it('search by ip', () => {
    _testSearchBy('IP')
  })
  it('click clear will reset search criteria', () => {
    page.enterFilterFiled('abc_random')
    page.clickSearchButton()
    page.clickClearButton()
    let res = page.securityLogs()
    expect(res.length).not.toBe(0)
  })
  it('action should not show if type is inject', () => {
    let actual = page.securityLogs()
    let res = commonUtil.filterBy(actual,inject.Type)
    expect(res.length).not.toBe(0)
    res.forEach((val) => {
      expect(logUtil.isAddWhitelistBtnShowByInfo(val)).toBe(false)
    })
  })
  it('action should show if cookie token error only', () => {
    let actual = page.securityLogs()
    let targets = commonUtil.filterBy(actual,cookie.Type)
    expect(targets.length).not.toBe(0)
    targets.forEach((val) => {
      expect(logUtil.isAddWhitelistBtnShowByInfo(val)).toBe(true)
    })
  })
  it('click action to show white list dialog', () => {
    page.clickWhiteListBtnByPath(nonWhiteListUrl)
    let inputVal = page.whiteListPathInputVal()
    expect(inputVal).toBe(`^${nonWhiteListUrl}$`)
    page.clickNoFromDialog()
  })

  function _testSearchBy(field) {
    let total = page.securityLogs()
    page.actionLogger.warn('get security log', total)
    let filtered = total.filter((val)=>val.includes(cookie.Type) || val.includes(inject.Type))
    page.actionLogger.warn('filtered log', filtered)
    let headers = page.getCurrentTableHeaders()
    page.actionLogger.warn('current table header',headers)
    let idx
    for(let i = 0; i< headers.length; i++) {
      let header = headers[i]
      if(header.includes(field)) {
        idx = i
        break;
      }
    }
    page.actionLogger.warn('matched header', headers[idx])
    let criteria = filtered[0][idx]
    page.actionLogger.warn('enter search criterial', criteria)
    page.waitTilResultLoaded()
    page.enterFilterFiled(criteria)
    page.clickSearchButton()
    let newVal = page.securityLogs()
    page.actionLogger.warn('new filtered result', newVal)
    expect(newVal.length).not.toBe(0)
    expect(commonUtil.isKeywordExistInArray(newVal,criteria)).toBe(true)
  }
})
