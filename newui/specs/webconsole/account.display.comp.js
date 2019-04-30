const AccountPage = require('../../pages/account')
const accounts = require('../../data/accounts')

describe('Update User page display check', () => {
  let page = new AccountPage()
  beforeEach(() => { page.open() })
  it(`username should be readonly`, () => {
    let testAccount = accounts.viewer
    page.clickByUserName(testAccount.username)
    expect(page.getDisplayedUserName()).toBe(testAccount.username)
    expect(page.getDisplayedUserTypeValue()).toBe(testAccount.typeValue)
    expect(page.isUserInputReadonly()).toBe(true)
  })

  it('support account: type and pwd is readonly', () => {
    let testAccount = accounts.support
    page.clickByUserName(testAccount.username)
    expect(page.isUserInputReadonly()).toBe(true)
    expect(page.isAccountTypeReadonly()).toBe(true)
    expect(page.isPwdInputVisible()).toBe(false)
  })
})