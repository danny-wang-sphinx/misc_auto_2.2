const commonUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const logSettingUtil = require('../../specUtils/system.settings')
const controlServerUtil = require('../../specUtils/controlServerUtil')
const profileData = require('../../data/profile')
const echoProfile = profileData.echoProfile

describe('protection web standard security scheme: Session Replay ', ()=> {
  let origJasminInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL
  const sessionRelayText = `"session_replay": 1`
  let uiStatus
  beforeAll(() => setup())
  afterAll(() => tearDown())

  let tests = [true,false]
  tests.forEach((test) => {
    describe(`${test}`, () => {
      beforeAll(() => { 
        checkAndSet(test) 
      })
      it('check uistatus', () => {
        expect(uiStatus).toBe(test)
      })
      it(`check webdriver typing, attack_type has session replay: ${test}`, () => {
        let logs = testAndGetParsedLogs()
        browser.pause(3000)
        expect(logs.includes(sessionRelayText)).toBe(test)
      })
    })
  })
  function checkAndSet(enabled) {
    const name = echoProfile.name
    profileUtil.sessionReplay(name,enabled)
    uiStatus = profileUtil.sessionReplay(name)
  }
  function setup() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300 * 1000
    // profileUtil.setupProfile(false, echoProfile, {autoTool: false})
    profileUtil.setupProfile(false, echoProfile)
    logSettingUtil.iniatePageAndSetformattedLog(true)
  }
  function tearDown() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origJasminInterval
    controlServerUtil.issueCommandToClearLogs()
    logSettingUtil.iniatePageAndSetformattedLog(false)
    profileUtil.setupProfile(false,profileData.defaultProfile)
  }
  function testAndGetParsedLogs() {
    const testSite = echoProfile.protectedSite
    controlServerUtil.issueCommandToClearLogs()

    // Use timestamp as unique uri, to check the log is logged
    commonUtil.accessEchoSiteAndSubmitForm(testSite)
    return commonUtil.stubAndGetParsedLogs(testSite)
  }
})
