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
  
  xdescribe('blocking page: skip, essential protection cannot trigger blocking page', () => {
    beforeAll(() => {set(modeMap.blockingPage)})

    it('check uistatus', () => {
      expect(uiStatusc).toBe(modeMap.blockingPage)
    })
    it('check post nonwhitelist will be blocking template', () => {
      let res = functionVerify()
      expect(specUtil.isBlockingPageStatus(res.status)).toBe(true)
      let blockingTemplateContent = confUtil.getBlockPageContent(relayServer,defaultProfile)
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
})
