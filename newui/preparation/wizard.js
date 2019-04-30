const WizardPage = require('../pages/wizard')
const admin = require('../data/accounts').admin
const defaultTimeZone = require('../data/testbed').defaultTimeZone
let page = new WizardPage()
let origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL 

describe('basic wizard', () => {

  const timeoutInSec = 300
  beforeAll(() => {
    browser.url('/')
    jasmine.DEFAULT_TIMEOUT_INTERVAL = timeoutInSec * 1000
  })
  afterAll(() => jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout)

  it('basic setup successful, the browser url should starts with https and show login page', () => {
    if(page.isWizardUrl()) {
      const pwd = admin.pwd
      page.basicSetup(pwd,defaultTimeZone,timeoutInSec)
      page.clickFinishBtn()
    }
    let currentUrl = browser.getUrl()
    expect(currentUrl.startsWith('https://')).toBe(true)
    expect(currentUrl).toContain('login')
  })
})