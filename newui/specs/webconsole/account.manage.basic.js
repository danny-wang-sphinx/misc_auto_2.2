const AccountPage = require('../../pages/account')
const accounts = require('../../data/accounts')
const accountUtil = require('../../specUtils/account')
const genNewName = accountUtil.genNewName

let page = new AccountPage()
let logedInUsername, name
const pwd = 'Admin123'
const newPwd = 'Admin1234'

describe('default admin account management', () => {
  logedInUsername = accounts.admin.username
  beforeAll(() => page.open())
  beforeEach(() => { page.open(); name = genNewName()})
  afterEach(() => { page.open(); page.deleteByUserName(name) })

  it(`can disable other admins`, () => {
    accountUtil.testEnableAndDisable(page, logedInUsername, 'Admin', true, name,pwd)
  })
  it(`change pwd for role admin: enabled`, () => {
    accountUtil.testUpdatePwd(page, logedInUsername, 'Admin', true, name, newPwd)
  })
  it(`change type from admin to viewer : enabled`, () => {
    accountUtil.testChangeType(page, logedInUsername, 'Admin', 'Viewer', true, name, pwd)
  })
  it(`change type from viewer to admin : enabled`, () => {
    accountUtil.testChangeType(page, logedInUsername, 'Viewer', 'Admin', true, name, pwd)
  })
  it(`can enable Viewer`, () => {
    accountUtil.testEnableAndDisable(page, logedInUsername, 'Viewer', false, name, pwd)
  })
  it(`can disable Viewer`, () => {
    accountUtil.testEnableAndDisable(page, logedInUsername, 'Viewer', true, name, pwd)
  }) 
})
describe('created admin account management', () => {
  let logedInUser = accounts.createdAdmin
  logedInUsername = logedInUser.username
  
  beforeAll(() => page.open(logedInUser.username, logedInUser.pwd))
  beforeEach(() => { page.open(logedInUser.username, logedInUser.pwd); name = genNewName()})
  afterEach(() => { page.open(logedInUser.username, logedInUser.pwd); page.deleteByUserName(name) })

  it(`can not disable other admins`, () => {
    accountUtil.add(page, 'Admin', name)
    page.toAccount()
    page.clickByUserName(name)
    expect(page.isEnableButtonReadonly()).toBe(true)
  })
  it('added/delete role admin with initial enable', () => {
    accountUtil.testAddAndDelete(page, 'Admin', name, true, logedInUsername)
  })
  it(`change pwd for role admin: enabled`, () => {
    accountUtil.testUpdatePwd(page,logedInUsername,'Admin',true,name, newPwd)
  })
  it(`change type from admin to viewer : enabled`, () => {
    accountUtil.testChangeType(page, logedInUsername, 'Admin', 'Viewer', true, name, pwd)
  })
  it(`can enable Viewer`, () => {
    accountUtil.testEnableAndDisable(page, logedInUsername, 'Viewer', false, name, pwd)
  })
  it(`can disable Viewer`, () => {
    accountUtil.testEnableAndDisable(page, logedInUsername, 'Viewer', true, name, pwd)
  }) 
})
