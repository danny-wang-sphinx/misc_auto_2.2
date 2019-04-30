const DashboardPage = require('../../pages/dashboard')
const accounts = require('../../data/accounts')
const dashUtil = require('../../specUtils/dashboard')
const dapServer = require('../../data/testbed').dapServer
const defaultProfile = require('../../data/profile').defaultProfile

describe('dashboard', ()=> {
  let page = new DashboardPage()
  const profileName = defaultProfile.name
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 180 * 1000
  })
  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout
  })

  it('admin click see more', () => {
    dashUtil.testClickSeeMore(page,accounts.admin.username, accounts.admin.pwd)
  })
  it('admin click node ip', () => {
    dashUtil.testClickNodeIP(page,accounts.admin.username, accounts.admin.pwd,dapServer)
  })
  it('admin click Go to Protection Settings', () => {
    dashUtil.testClickProtectionLink(page,accounts.admin.username, accounts.admin.pwd)
  })
  it('admin click protected profile name', () => {
    dashUtil.testClickProfileName(page,accounts.admin.username, accounts.admin.pwd, profileName)
  })
})
