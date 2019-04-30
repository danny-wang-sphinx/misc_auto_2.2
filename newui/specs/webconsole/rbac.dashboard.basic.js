const DashboardPage = require('../../pages/dashboard')
const accounts = require('../../data/accounts')
const defaultProfile = require('../../data/profile').defaultProfile
const profileName = defaultProfile.name

describe('rbac dashboard page:viwer', () => {

  let page = new DashboardPage(), res
  beforeAll(() => {res = testFunc()})
  afterAll(() => page.logout())

  it(`check isSeeMoreVisible: true`, () => {
    expect(res.isSeeMoreVisible).toBe(true)
  })
  it(`check isProtectionLinkVisible: false`, () => {
    expect(res.isProtectionLinkVisible).toBe(false)
  })
  it(`viewer: check protected profile name is clickable: false`, () => {
    expect(res.isProfileNameClickable).toBe(false)
  })

  function testFunc() {
    page.open(accounts.viewer.username, accounts.viewer.pwd)
    let isSeeMoreVisible = page.isSeeMoreVisible()
    let isProtectionLinkVisible = page.isProtectionLinkVisible()
    let isProfileNameClickable = page.isProfileNameClickable(profileName)
    return {isSeeMoreVisible,isProtectionLinkVisible,isProfileNameClickable}
  }
})