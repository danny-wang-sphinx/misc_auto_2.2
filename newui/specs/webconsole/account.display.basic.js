const AccountPage = require('../../pages/account')
const accounts = require('../../data/accounts')
const accountUtil = require('../../specUtils/account')

describe('accounts page display check', () => {
  let page = new AccountPage(),res
  beforeAll(() => {page.open();res = page.accountList()})

  it('support account should not display delete btn', () => {
    let actual = res.filter((val)=>val.includes(accounts.support.username))[0]
    expect(accountUtil.isActionBtnShownByINfo(actual)).toBe(false)
  })
  it('default admin account should not display delete btn, and enable status is checked', () => {
    let actual = res.filter((val)=>val.includes(accounts.admin.username))[0]
    expect(accountUtil.isActionBtnShownByINfo(actual)).toBe(false)
  })
  it('no enable admin account should display delete btn, and enable status is unchecked', () => {
    let actual = res.filter((val)=>val.includes(accounts.noEnable.username))[0]
    expect(accountUtil.isActionBtnShownByINfo(actual)).toBe(true)
    expect(accountUtil.isUserEnabledByInfo(actual)).toBe(false)
  })
  it('viewer should display delete btn, and enable status is checked', () => {
    let actual = res.filter((val)=>val.includes(accounts.viewer.username))[0]
    expect(accountUtil.isActionBtnShownByINfo(actual)).toBe(true)
    expect(accountUtil.isUserEnabledByInfo(actual)).toBe(true)
  })
})