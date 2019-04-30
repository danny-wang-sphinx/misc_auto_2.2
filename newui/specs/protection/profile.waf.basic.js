const ProfilePage = require('../../pages/profile')
const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const profileData = require('../../data/profile')

describe('protection waf features: ', ()=> {
  const defaultProfile = profileData.defaultProfile
  let profilePage = new ProfilePage(),uiStatus
  let _curl = () => specUtil.curlResource(defaultProfile.protectedSite, '/a.js',profileData.injectionQuery)
  
  beforeAll(() => { profileUtil.setupProfile(true)})
  afterAll(() => {checkAndSet(true)})

  describe('off',() => {
    beforeAll(() => checkAndSet(false))
    it('check uistatus', () => {
      expect(uiStatus).toBe(false)
    })
    it(`check inject query will not be rejected`, () => {
      let status = _curl().status
      profilePage.actionLogger.warn('curlResult status', status)
      expect(specUtil.isRejectStatus(status)).toBe(false)
    })
  })
  describe('on',() => {
    beforeAll(() => checkAndSet(true))
    it('check uistatus', () => {
      expect(uiStatus).toBe(true)
    })
    it(`check inject query will be rejected`, () => {
      let status = _curl().status
      profilePage.actionLogger.warn('curlResult status', status)
      expect(specUtil.isRejectStatus(status)).toBe(true)
    })
  })

  function checkAndSet(data) {
    const name = defaultProfile.name
    profileUtil.waf(name,data)
    uiStatus = profileUtil.waf(name)
  }
})