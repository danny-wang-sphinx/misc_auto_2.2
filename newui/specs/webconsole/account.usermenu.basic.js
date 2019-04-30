const DashboardPage= require('../../pages/dashboard')
const AccountPage = require('../../pages/account')
const accountUtil = require('../../specUtils/account')

describe('account usermenu: click Accounts can go accounts management page', () => {
  let page = new DashboardPage()
  beforeAll(() => page.open())
  it(`by admin`, () => {
    page.clickAccountsFromUserMenu()
    expect(page.getSiteMap()).toContain(page.siteMapTexts.Account)
  })
})
describe('password change page', () => {
  let admin = {'name':accountUtil.genNewName(), 'type':'Admin' }
  let viewer = {'name':accountUtil.genNewName(), 'type':'Viewer' }
  let testAccounts = [admin,viewer]
  let page = new DashboardPage(), adminPage = new AccountPage()
  const pwd = 'Admin123', newPwd = 'Admin1234'

  beforeAll(() => {
    adminPage.open()
    testAccounts.forEach((testAccount) => {
      accountUtil.add(adminPage,testAccount.type,testAccount.name,true,pwd)
    })
    adminPage.logout()
  })

  afterAll(() => {
    adminPage.open()
    testAccounts.forEach((testAccount) => {
      adminPage.deleteByUserName(testAccount.name)
    })
    adminPage.logout()
  })

  afterEach(() => page.logout())
  it('Admin can update own password', () => {
    testPwdChangeFunc(admin.name)
  })
  it('Viewer can update own password', () => {
    testPwdChangeFunc(viewer.name)
  })
  function testPwdChangeFunc(name) {
    page.open(name,pwd)
    page.clickPasswordFromUserMenu()
    changePwdAndRelogin(name)
    expect(page.isLoginUrl()).toBe(false)
  }
  function changePwdAndRelogin(name) {
    let accountPage = new AccountPage()
    accountPage.updateOwnPwd(newPwd)
    page.actionLogger.warn('updated own pwd')
    page.logout()

    //relogin with new pwd
    page.actionLogger.warn('relogin with new pwd')
    page.open(name, newPwd)
  }
})
