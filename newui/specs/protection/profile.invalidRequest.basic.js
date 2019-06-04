const ProfilePage = require('../../pages/profile')
const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const confUtil = require('../../confUtils')
const relayServer = require('../../data/testbed').relayServer
const defaultProfile = require('../../data/profile').defaultProfile

describe('protection invalid request policy: ', ()=> {
  let profilePage = new ProfilePage(),uiStatus
  let timeStamp = specUtil.timeStampAndRanNum()
  const modeMap = profilePage.invalidRequestModeMap
  let functionVerify = () => specUtil.curlResource(defaultProfile.protectedSite, `/${timeStamp}`,'','-d a=1')
  
  beforeAll(() => {profileUtil.setupProfile(true)})
  afterAll(() => {set(modeMap.reject)})
  
  describe('reject', () => {
    beforeAll(() => {set(modeMap.reject)})

    it('check uistatus', () => {
      expect(uiStatus).toBe(modeMap.reject)
    })
    it('check post nonwhitelist will 400', () => {
      let res = functionVerify().status
      expect(specUtil.isRejectStatus(res)).toBe(true)
    })
  })
  
  describe('blocking page: skip, essential protection cannot trigger blocking page', () => {
    beforeAll(() => {set(modeMap.blockingPage)})

    it('check uistatus', () => {
      expect(uiStatus).toBe(modeMap.blockingPage)
    })
    it('check post nonwhitelist will be blocking template', () => {
      let res = functionVerify()
      expect(specUtil.isBlockingPageStatus(res.status)).toBe(true)
      //let blockingTemplateContent = confUtil.getBlockPageContent(relayServer,defaultProfile)
      //let blockingTemplateContent = '<span>The request is denied per website security policies. If you receive this message by mistake, provide below information to <a href="mailto:support@example.com">support@example.com</a></span>'
      let blockingTemplateContent = '<span>The request is denied per website security policies. If you receive this message by mistake, provide'
      profilePage.actionLogger.warn('blockingTemplateContent',blockingTemplateContent)
      profilePage.actionLogger.warn('get curl result body',res.body)
      expect(specUtil.isBlockingPageContent(res.body, blockingTemplateContent)).toBe(true)
    })
  })
  
  function set(data) {
    const name = defaultProfile.name
    profileUtil.invalidAction(name,data)
    uiStatus = profileUtil.invalidAction(name)
  }
  function _curl(jsFile) {
    let profilePage = new ProfilePage()
    browser.pause(3000)
    profilePage.actionLogger.warn(`curl by timestamp: ${jsFile}`)
    let res = specUtil.curlResource(defaultProfile.protectedSite, jsFile,profileData.injectionQuery)
    //console.log(`Danny Debug: ` + Object.keys(res))
    //console.log(`Danny Debug: ` + Object.values(res))
    profilePage.actionLogger.warn(`curl statusCode: ${jsFile}: ${res.status}`)
    return res.status
  }
  function curlAndGetRuleId() {
    let timeStamp = specUtil.timeStampAndRanNum()
    const jsFile = `/${timeStamp}.js`
    let curlStatusCode = _curl(jsFile)
  }
})
