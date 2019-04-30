const LoginPage = require('../../pages/login')
const DashboardPage = require('../../pages/dashboard')
const accounts = require('../../data/accounts')
const uiMsgs = require('../../constants/msg')

describe('login should be failed when', () => {
  let page = new LoginPage()

  beforeAll(() => {let basePage = new DashboardPage(); basePage.open(); basePage.logout() })

  it(`noExist user should return ${uiMsgs.loginInvalidUserPwd}`, () => {
    let actual = _loginAndGetErrors(accounts.noExist.username, accounts.noExist.pwd)
    expect(actual).toContain(uiMsgs.loginInvalidUserPwd)
  })
  it(`noEnable user should return ${uiMsgs.loginInactiveUser}`, () => {
    let actual = _loginAndGetErrors(accounts.noEnable.username, accounts.noEnable.pwd)
    expect(actual).toContain(uiMsgs.loginInactiveUser)
  })
  it(`wrong password should return ${uiMsgs.loginInvalidUserPwd}`, () => {
    let actual = _loginAndGetErrors(accounts.admin.username, accounts.admin.pwd+'1')
    expect(actual).toContain(uiMsgs.loginInvalidUserPwd)
  })

  function _loginAndGetErrors(username, pwd) {
    page.login(username,pwd)
    return page.getAlertErrors()
  }
})