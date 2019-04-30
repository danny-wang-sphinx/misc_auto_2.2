const AccountPage = require('../../pages/account')
const accounts = require('../../data/accounts')
const accountUtil = require('../../specUtils/account')
const genNewName = accountUtil.genNewName

const pwd = 'Admin123'
let page = new AccountPage()

describe('default admin account management', () => {
  let logedInUsername = accounts.admin.username, name
  beforeAll(() => page.open())
  beforeEach(() => { page.open(); name = genNewName()})
  afterEach(() => { page.open(); page.deleteByUserName(name) })

  it('cancel will not delete the account', () => {
    page.deleteByUserName(accounts.noEnable.username, true)
    page.toAccount()
    expect(page.isUserExistByUserName(accounts.noEnable.username)).toBe(true)
  })
  it('added/delete role admin with initial disabled', () => {
    accountUtil.testAddAndDelete(page, 'Admin', name, false, logedInUsername)
  })
  it(`change type from admin to viewer : disabled`, () => {
    accountUtil.testChangeType(page, logedInUsername, 'Admin', 'Viewer', false, name,pwd)
  })
})
describe('created admin account management', () => {
  let logedInUser = accounts.createdAdmin, name
  let logedInUsername = logedInUser.username
  beforeAll(() => page.open(logedInUser.username, logedInUser.pwd))
  beforeEach(() => { page.open(logedInUser.username, logedInUser.pwd); name = genNewName()})
  afterEach(() => { page.open(logedInUser.username, logedInUser.pwd); page.deleteByUserName(name) })

  it(`change type from viewer to admin : enabled`, () => {
    accountUtil.testChangeType(page, logedInUsername, 'Viewer', 'Admin', true, name,pwd)
  })
})
