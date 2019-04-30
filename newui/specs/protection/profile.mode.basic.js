const ProfilePage = require('../../pages/profile')
const LogsSecurityPage = require('../../pages/logs.security')
const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const profileData = require('../../data/profile')
const defaultProfile = profileData.defaultProfile


describe('protection mode', () => {
  let profilePage = new ProfilePage(),uiStatus

  beforeAll(() => { profileUtil.setupProfile(true)})
  afterAll(() => { set(profilePage.protectionModeMap.block) })

  describe('monitor', () => {
    const testMode = profilePage.protectionModeMap.monitor
    const searchTimeout = 180
    beforeAll(() =>  {
      set(testMode)
      jasmine.DEFAULT_TIMEOUT_INTERVAL = searchTimeout*1000
    })
    afterAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout
    })

    it('check UI status', () => {
      expect(uiStatus).toBe(testMode)
    })
    it('curl nonWhiteList shouldnot return reload nor 400', () => {
      let status = curlResource().curlResult.status
      expect(specUtil.isReloadByStatusCode(status)).toBe(false)
      expect(specUtil.isRejectStatus(status)).toBe(false)
    })
    it('should still log the attack type', () => {
      let testTimeStamp = curlResource().timeStamp
      let logPage = new LogsSecurityPage()
      logPage.toLogs()
      logPage.keepSearchTillTableContain(testTimeStamp,searchTimeout)
      let logs = logPage.securityLogs()
      expect(logs.toString()).toContain(testTimeStamp)
    })
  })

  describe('block', () => {
    const testMode = profilePage.protectionModeMap.block
    beforeAll(() => set(testMode))

    it('check UI status', () => {
      expect(uiStatus).toBe(testMode)
    })
    it('curl nonWhiteList should return reload', () => {
      let status = curlResource().curlResult.status
      expect(specUtil.isReloadByStatusCode(status)).toBe(true)
    })
  })

  function set(data) {
    const name = defaultProfile.name
    profileUtil.protectionMode(name,data)
    uiStatus = profileUtil.protectionMode(name)
  }
  function curlResource() {
    let timeStamp = specUtil.timeStampAndRanNum()
    let curlResult = specUtil.curlResource(defaultProfile.protectedSite, `/${timeStamp}`)
    return {curlResult,timeStamp}
  }
})