const LogsPage = require('../../pages/logs.security')
const accounts = require('../../data/accounts')
const commonUtil = require('../../specUtils/commonUtil')
const specUtil = require('../../specUtils/logs')
const defaultProfile = require('../../data/profile').defaultProfile

describe('rbac viewer check logs page', () => {
  let page = new LogsPage()
  const defaultProtectedSite = defaultProfile.protectedSite
  let nonWhiteListUrl = `/${commonUtil.timeStampAndRanNum()}`
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL

  beforeAll(() => {
    page.open(accounts.viewer.username, accounts.viewer.pwd)
    commonUtil.curlResource(defaultProtectedSite,nonWhiteListUrl)
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 180 * 1000
    page.keepSearchTillTableContain(nonWhiteListUrl)
  })
  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout
  })

  beforeEach(() => page.toLogs())

  //DAP BUG: login as viewer -> logs, then in browser address bar type https://dap_ip:20145/, it will be blank page, 404, LOL
  
  it('cannot see operation logs', () => {
    let actual = page.isOperationTabShow()
    page.actionLogger.warn('isOperationTabShow', actual)
    expect(actual).toBe(false)
  })
  it('cannot see action button in the sec logs', () => {
    page.keepSearchTillTableContain(nonWhiteListUrl)
    let actual = page.securityLogs()
    page.actionLogger.warn('securityLogs', actual)
    expect(actual.length).not.toBe(0)
    let entry = actual.filter((val) => val.includes(nonWhiteListUrl))[0]
    page.actionLogger.warn('filtered securityLogs', entry )
    expect(specUtil.isAddWhitelistBtnShowByInfo(entry)).toBe(false)
  })

})