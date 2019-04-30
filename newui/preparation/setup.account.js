const DashboardPage = require('../pages/dashboard')
const AccountPage = require('../pages/account')
const accountData = require('../data/accounts')
const accountUtil = require('../specUtils/account')
const confUtil = require('../confUtils')

const relayServer = require('../data/testbed').relayServer

let currentUsers = confUtil.getUserNames(relayServer)
let currentSupportPwd = confUtil.getSupportPwd(relayServer)
let testUsers = [accountData.createdAdmin, accountData.viewer, accountData.noEnable]
let needCreated = testUsers.filter((user) => !currentUsers.includes(user.username))

describe('Prepare for user account', () => {
  let page = new AccountPage()
  
  beforeEach(() => page.open())

  it('enable support account', () => {
    let name = accountData.support.username
    let user = page.getAccountInfoByName(name)
    if (!accountUtil.isUserEnabledByInfo(user)) {
      page.enableAccountByUserName(name,true)
      page.toDashboard()
      page.open()
    }
    user = page.getAccountInfoByName(name)
    expect(accountUtil.isUserEnabledByInfo(user)).toBe(true)
  })
  
  needCreated.forEach((user) => {
    it(`create account if not exists ${user.username}`, () => {
      accountUtil.add(page,user.type,user.username,user.enabled,user.pwd)
      page.toDashboard()
      page.open()
      page.toAccount()
      let actual = page.isUserExistByUserName(user.username)
      expect(actual).toBe(true)
    })
  })


  it('support account change password to fixed pwd', () => {
    if(currentSupportPwd.isDefaultPwd) {
      page.actionLogger.warn('DEFAULT support oldpwd', currentSupportPwd)
      console.log('DEFAULT support oldpwd', currentSupportPwd)
      const support = accountData.support
      page = new DashboardPage()
      page.open(support.username,currentSupportPwd.pwd)
      page.clickPasswordFromUserMenu()
      let accountPage = new AccountPage()
      accountPage.updateOwnPwd(support.pwd)
    } else {
      page.actionLogger.warn('support pwd has been changed, oldpwd is', currentSupportPwd)
    }
  })

})