const DashboardPage = require('../../pages/dashboard')
const accounts = require('../../data/accounts')
const dashUtil = require('../../specUtils/dashboard')
const dapServer = require('../../data/testbed').dapServer
const defaultProfile = require('../../data/profile').defaultProfile

describe('dashboard', ()=> {
  let page = new DashboardPage()
  const profileName = defaultProfile.name
  const createdAdmin = accounts.createdAdmin

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 180 * 1000
  })
  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout
  })

  it('node id=1 is not deleteable', () => {
    page.open(createdAdmin.username, createdAdmin.pwd)
    let node = page.getNodeInfoById('1')
    expect(dashUtil.isDeleteBtnShowByInfo(node)).toBe(false)
  })
  it('created admin click see more', () => {
    dashUtil.testClickSeeMore(page,createdAdmin.username, createdAdmin.pwd)
  })
  it('created admin click Go to Protection Settings', () => {
    dashUtil.testClickProtectionLink(page,createdAdmin.username, createdAdmin.pwd)
  })
  it('created admin click protected profile name', () => {
    dashUtil.testClickProfileName(page,createdAdmin.username, createdAdmin.pwd, profileName)
  })
  it('support click see more', () => {
    dashUtil.testClickSeeMore(page,accounts.support.username, accounts.support.pwd)
  })
  it('viewer click node ip', () => {
    dashUtil.testClickNodeIP(page,accounts.viewer.username, accounts.viewer.pwd, dapServer)
  })
})
