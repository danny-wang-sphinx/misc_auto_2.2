const ProfilePage = require('../../pages/profile')
const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const defaultProfile = require('../../data/profile').defaultProfile

describe('protection basic settings: set entry point', ()=> {
  let profilePage = new ProfilePage(),uiStatus
  let data = '/'+specUtil.timeStampAndRanNum(), defaultEntryPoint = '/'

  beforeAll(() => {setup()})
  afterAll(() => {set(defaultEntryPoint)})

  describe(`non default`, () => {
    beforeAll(() => set(data))

    it('check UI', () => {
      verifyUiStatus(data)
    })
    it(`check entrypoint will not reload nor 400, curl=${data}`, () => {
      let status = specUtil.curlResource(defaultProfile.protectedSite,data).status
      profilePage.actionLogger.warn('curlResult status', status)
      expect(specUtil.isReloadByStatusCode(status)).toBe(false)
      expect(specUtil.isRejectStatus(status)).toBe(false)
    })
    it(`only work on GET, curl=${data}`, () => {
      let res = specUtil.curlResource(defaultProfile.protectedSite,data,'','-d a=1')
      profilePage.actionLogger.warn('curlResult', res)
      expect(specUtil.isRejectStatus(res.status)).toBe(true)
    })
  })
  describe(`change to default`, () => {
    beforeAll(() => set(defaultEntryPoint))
    it('check UI', () => {
      verifyUiStatus(defaultEntryPoint)
    })
    it('previous entry point should be Reload', () => {
      let status = specUtil.curlResource(defaultProfile.protectedSite,data).status
      expect(specUtil.isReloadByStatusCode(status)).toBe(true)
    })
    it(`default entry should not be reload`, () => {
      let status = specUtil.curlResource(defaultProfile.protectedSite,defaultEntryPoint).status
      expect(specUtil.isReloadByStatusCode(status)).toBe(false)
    })
  })

  function set(data) {
    const name = defaultProfile.name
    profileUtil.entry(name,data)
    uiStatus = profileUtil.entry(name)
  }
  function verifyUiStatus(val) {
    expect(uiStatus).toBe(val)
  }
  function setup() {
    profileUtil.setupProfile(false,defaultProfile)
  }
})

