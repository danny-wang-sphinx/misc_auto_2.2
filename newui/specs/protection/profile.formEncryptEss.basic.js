const commonUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const logSettingUtil = require('../../specUtils/system.settings')
const controlServerUtil = require('../../specUtils/controlServerUtil')
const profileData = require('../../data/profile')
const echoProfile = profileData.echoProfile
const libcommonUtil = require('../../../lib/commonUtil')
const SecurityLogPage = require('../../pages/logs.security')

describe('protection web standard security scheme: Form encryption ', ()=> {
  let origJasminInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL
  const inputData = 'inputData'
  const attackTypeForm = `"attack_type": ["Form"]`
  const testSite = echoProfile.protectedSite
  const expectedAttackType = 'Form'
  const expectedErrorCode = 'INVALID_ENCRYPT_FORMAT'
  let tamperTime = Date.now() + '' + libcommonUtil.random(100)
  let tamperPath = `/${tamperTime}`
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
      let securityLog = getTypefromLogPage(tamperPath)
      console.log('Danny Debug:' + Object.keys(securityLog))
      console.log('Danny Debug:' + Object.values(securityLog))
      expect(securityLog.attackType).toBe(expectedAttackType)
      expect(securityLog.errorCode).toContain(expectedErrorCode)
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
  function getTypefromLogPage(pathKeyword) {
    let logPage = new SecurityLogPage()
    logPage.open()
    //wait till securiyt log has info
    logPage.keepSearchTillTableContain(pathKeyword)
    logPage.clickUrlFromSecurityTable(pathKeyword)
    let res = logPage.getDetailModalTableContent()
    logPage.dismissDetailDialog()
    let attackType = res['Type']
    let errorCode = res['Error Code']
    logPage.actionLogger.warn(`getexpectedAttackTypePage:${attackType}`)
    logPage.actionLogger.warn(`getexpectedErrorCodePage:${errorCode}`)
    return {attackType, errorCode}
  }
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
    let parsedLogs =  commonUtil.stubAndGetParsedLogs(testSite)
    return {pageSource,parsedLogs}
  }
  function testSubmitPlainData() {
    controlServerUtil.issueCommandToClearLogs()

    let curlResult = commonUtil.curlWithValidCookieToken(testSite,tamperPath,'',`-d abc=${inputData}`)
    let parsedLogs =  commonUtil.stubAndGetParsedLogs(testSite)
    return {curlResult,parsedLogs}
  }
})
