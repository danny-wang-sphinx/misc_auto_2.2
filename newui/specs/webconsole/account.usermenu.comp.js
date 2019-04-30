const DashboardPage= require('../../pages/dashboard')
const AccountPage = require('../../pages/account')
const accountUtil = require('../../specUtils/account')

describe('password change page', () => {
  let admin = {'name':accountUtil.genNewName(), 'type':'Admin' }
  let viwer = {'name':accountUtil.genNewName(), 'type':'Viewer' }
  let testAccounts = [admin,viwer]
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

  it('Created admin: name,type,enable is readonly', () => {
    testUIFunc(admin.name)
  })
  it('Viewer: name,type,enable is readonly', () => {
    testUIFunc(viwer.name)
  })
  function testUIFunc(name) {
    page.open(name,pwd)
    page.clickPasswordFromUserMenu()
    let accountPage = new AccountPage()
    accountPage.waitTilUpdateUserFormShow()
    expect(accountPage.isAccountTypeReadonly()).toBe(true)
    expect(accountPage.isUserInputReadonly()).toBe(true)
    expect(accountPage.isEnableButtonReadonly()).toBe(true)
  }
})
