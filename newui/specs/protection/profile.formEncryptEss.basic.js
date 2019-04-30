const commonUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const logSettingUtil = require('../../specUtils/system.settings')
const controlServerUtil = require('../../specUtils/controlServerUtil')
const profileData = require('../../data/profile')
const echoProfile = profileData.echoProfile

describe('protection web standard security scheme: Form encryption ', ()=> {
  let origJasminInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL
  const inputData = 'inputData'
  const attackTypeForm = `"attack_type": ["Form"]`
  const testSite = echoProfile.protectedSite
  let uiStatus
  beforeAll(() => setup())
  afterAll(() => tearDown())

  describe(`on`, () => {
    beforeAll(() => { 
      set(true) 
    })
    it('check uistatus', () => {
      expect(uiStatus).toBe(true)
    })
    it(`form submission through browser should be accepted`, () => {
      let res = testSubmitByBrowser().pageSource
      expect(res).toContain(inputData)
    })
    it(`unencrypted data post request should be rejected,attack_type is form`, () => {
      let res = testSubmitPlainData()
      expect(commonUtil.isRejectStatus(res.curlResult.status)).toBe(true)
      expect(res.parsedLogs).toContain(attackTypeForm)
    })
  })
  describe(`off`, () => {
    beforeAll(() => { 
      set(false) 
    })
    it('check uistatus', () => {
      expect(uiStatus).toBe(false)
    })
    it(`form submission through browser should be accepted`, () => {
      let res = testSubmitByBrowser().pageSource
      expect(res).toContain(inputData)
    })
    it(`unencrypted data post request should not be rejected`, () => {
      let res = testSubmitPlainData()
      expect(res.curlResult.body).toContain(inputData)
    })
  })
  function setup() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300 * 1000
    profileUtil.setupProfile(false, echoProfile, {autoTool: false})
    logSettingUtil.iniatePageAndSetformattedLog(true)
  }
  function tearDown() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origJasminInterval
    controlServerUtil.issueCommandToClearLogs()
    logSettingUtil.iniatePageAndSetformattedLog(false)
    profileUtil.setupProfile(false,profileData.defaultProfile)
  }
  function set(enabled) {
    const name = echoProfile.name
    profileUtil.formEncryptEss(name,enabled)
    uiStatus = profileUtil.formEncryptEss(name)
  }
  function testSubmitByBrowser() {
    controlServerUtil.issueCommandToClearLogs()

    let pageSource = commonUtil.accessEchoSiteAndSubmitForm(testSite,inputData)
    let parsedLogs = commonUtil.stubAndGetParsedLogs(testSite)
    return {pageSource,parsedLogs}
  }
  function testSubmitPlainData() {
    controlServerUtil.issueCommandToClearLogs()

    let curlResult = commonUtil.curlWithValidCookieToken(testSite,'/','',`-d abc=${inputData}`)
    let parsedLogs =  commonUtil.stubAndGetParsedLogs(testSite)
    return {curlResult,parsedLogs}
  }
})
