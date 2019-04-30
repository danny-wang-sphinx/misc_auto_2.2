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

  beforeEach(() => { page.open(); page.clickClearButton() })

  it('category deselect inject and cookie, result will not show inject nor cookie entries', () => {
    page.toggleCatByText(inject.displayText, false)
    page.toggleCatByText(cookie.displayText, false)
    page.clickSearchButton()
    let actual = page.securityLogs()
    expect(commonUtil.isKeywordExistInArray(actual, inject.Type)).toBe(false)
    expect(commonUtil.isKeywordExistInArray(actual, cookie.Type)).toBe(false)
  })
  it('search by unmatch data, result table should be empty', () => {
    page.enterFilterFiled('abc_random')
    page.clickSearchButton()
    let res = page.securityLogs()
    expect(res.length).toBe(0)
  })
})
