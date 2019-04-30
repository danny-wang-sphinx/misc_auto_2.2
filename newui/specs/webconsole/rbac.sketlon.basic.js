const Page = require('../../pages/dashboard')
const accounts = require('../../data/accounts')
const testdata = require('../../data/rbac')

describe('role based menu and user menu check', () => {
  let page = new Page()

  describe('createdAdmin', () => {
    let accountType = 'Admin'
    beforeAll(() => page.open(accounts.createdAdmin.username,accounts.createdAdmin.pwd))
    afterAll(() => page.logout())

    it(`_testMenuStats should be ${JSON.stringify(testdata.mergedResult[accountType])}`, () => {
      let actual = _getStats()
      let expected = testdata.mergedResult[accountType]
      expect(actual).toEqual(expected)
    })
    it(`_testUserMenuStats should be ${JSON.stringify(testdata.mergedResult[accountType])}`, () => {
      let isAccountVisible = page.isAccountInUserMenu()
      expect(isAccountVisible).toEqual(accountType == 'Admin' ? true : false)
    })
  })
  describe('support', () => {
    let accountType = 'Support'
    beforeAll(() => page.open(accounts.support.username,accounts.support.pwd))
    afterAll(() => page.logout())

    it(`_testMenuStats should be ${JSON.stringify(testdata.mergedResult[accountType])}`, () => {
      let actual = _getStats()
      let expected = testdata.mergedResult[accountType]
      expect(actual).toEqual(expected)
    })
    it(`_testUserMenuStats should be ${JSON.stringify(testdata.mergedResult[accountType])}`, () => {
      let isAccountVisible = page.isAccountInUserMenu()
      expect(isAccountVisible).toEqual(accountType == 'Admin' ? true : false)
    })
  })
  describe('viewer', () => {
    let accountType = 'Viewer'
    beforeAll(() => page.open(accounts.viewer.username,accounts.viewer.pwd))
    afterAll(() => page.logout())

    it(`_testMenuStats should be ${JSON.stringify(testdata.mergedResult[accountType])}`, () => {
      let actual = _getStats()
      let expected = testdata.mergedResult[accountType]
      expect(actual).toEqual(expected)
    })
    it(`_testUserMenuStats should be ${JSON.stringify(testdata.mergedResult[accountType])}`, () => {
      let isAccountVisible = page.isAccountInUserMenu()
      expect(isAccountVisible).toEqual(accountType == 'Admin' ? true : false)
    })
  })

  function _getStats() {
    let res = {}
    testdata.menuChekers.forEach((checker) => {
      let val = page[checker]();
      res[checker] = val
    })
    testdata.systemMenuChekers.forEach((checker) => {
      let val = page[checker]();
      res[checker] = val
    })
    return res
  }
})