const ProfilePage = require('../../pages/profile')
const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const profileData = require('../../data/profile')

describe('protection invalid request policy: ', ()=> {
  let profilePage = new ProfilePage(),uiStatus
  let timeStamp = specUtil.timeStampAndRanNum()
  const modeMap = profilePage.invalidRequestModeMap
  const defaultProfile = profileData.defaultProfile
  let functionVerify = () => specUtil.curlResource(defaultProfile.protectedSite, `/${timeStamp}`,'','-d a=1')
  
  beforeAll(() => { profileUtil.setupProfile(true)})
  afterAll(() => {set(modeMap.reject)})

  describe('redirect', () => {
    beforeAll(() => {set(modeMap.redirect)})

    it('check uistatus', () => {
      expect(uiStatus).toBe(modeMap.redirect)
    })
    it('check post nonwhitelist will be 302', () => {
      let res = functionVerify().status
      expect(specUtil.isRedirectStatus(res)).toBe(true)
    })
  })
  describe('blank page', () => {
    beforeAll(() => {set(modeMap.blank)})

    it('check uistatus', () => {
      expect(uiStatus).toBe(modeMap.blank)
    })
    it('check post nonwhitelist will be 200 with empty content', () => {
      let res = functionVerify()
      expect(specUtil.isBlankPageStatus(res.status)).toBe(true)
      expect(res.body.trim().length).toBe(0)
    })
  })
  function set(data) {
    const name = defaultProfile.name
    profileUtil.invalidAction(name,data)
    uiStatus = profileUtil.invalidAction(name)
  }
})