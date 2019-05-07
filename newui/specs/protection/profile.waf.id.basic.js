const ProfilePage = require('../../pages/profile')
const SecurityLogPage = require('../../pages/logs.security')
const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const profileData = require('../../data/profile')

describe('protection waf.id: ', ()=> {
  let initialId
  const defaultProfile = profileData.defaultProfile
  let profilePage = new ProfilePage()
  let logPage = new SecurityLogPage()

  afterAll(() => { profileUtil.setupProfile(false,defaultProfile)})
  describe('default check',() => {
    beforeAll(() => setup())
    it(`initial ruleId should not empty`,() => {
      expect(typeof initialId).toBe('string')
      expect(initialId.length).toBeGreaterThan(0)
    })
    it(`check ui`, () => {
      let status = getUiStatus(initialId)
      expect(status).toBe(true)
    })
  })

  describe(`disable initial ruleId,`,() => {
    beforeAll(() => {
      setup()
      toProfilePageAndSaveRuleId(initialId,false)
    })

    it(`check ui`, () => {
      let status = getUiStatus(initialId)
      expect(status).toBe(false)
    })
    it(`should not be blocked by initial ruleId`,() => {
      let newId = curlAndGetRuleId()
      expect(newId).not.toEqual(initialId)
    })
  })
  describe(`reenable the inital ruleId`,() => {
    beforeAll(() => {
      setup()
      toProfilePageAndSaveRuleId(initialId,false)
      toProfilePageAndSaveRuleId(initialId,true)
    })

    it(`check ui`, () => {
      let status = getUiStatus(initialId)
      expect(status).toBe(true)
    })
    it(`should be blocked by initial ruleId`,() => {
      let newId = curlAndGetRuleId()
      expect(newId).toEqual(initialId)
    })
  })

  function toProfilePageAndSaveRuleId(id,status) {
    toProfilePage()
    profilePage.toggleWafById(id,status)
    profilePage.clickSave()
  }
  function toProfilePage() {
    profileUtil.openPageAndToProfilePage(defaultProfile.name)
  }
  function setup() {
    profileUtil.setupProfile(false,defaultProfile,{waf:true})
    initialId = curlAndGetRuleId()
  }
  function _curl(jsFile) {
    sleep(3000)
    profilePage.actionLogger.warn(`curl by timestamp: ${jsFile}`)
    let res = specUtil.curlResource(defaultProfile.protectedSite, jsFile,profileData.injectionQuery)
    console.log(`Danny Debug: ` + Object.keys(res))
    console.log(`Danny Debug: ` + Object.values(res))
    profilePage.actionLogger.warn(`curl statusCode: ${jsFile}: ${res.status}`)
    return res.status
  }
  function curlAndGetRuleId() {
    let timeStamp = specUtil.timeStampAndRanNum()
    const jsFile = `/${timeStamp}.js`
    let curlStatusCode = _curl(jsFile)
    let ruleId
    if (specUtil.isRejectStatus(curlStatusCode)) {
      profilePage.actionLogger.warn('get rule id')
      ruleId = _getRuleIdFromLogPage(jsFile)
    }
    profilePage.actionLogger.warn(`curlAndGetRuleId result:${jsFile}: ${curlStatusCode}, ${ruleId}`)
    return ruleId
  }
  function _getRuleIdFromLogPage(pathKeyword) {
    logPage.toLogs()
    logPage.toSecurityTab()
    logPage.keepSearchTillTableContain(pathKeyword)
    logPage.clickUrlFromSecurityTable(pathKeyword)
    let res = logPage.getDetailModalTableContent()
    logPage.dismissDetailDialog()
    let ruleId = res['Rule ID']
    logPage.actionLogger.warn(`getRuleIdFromLogPage:${ruleId}`)
    return ruleId
  }
  function getUiStatus(id) {
    toProfilePage()
    return profilePage.getWafRuleIdStatusById(id)
  }
  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
})

