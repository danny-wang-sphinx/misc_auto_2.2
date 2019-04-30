const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const profileData = require('../../data/profile')

describe('protection protected features: web protection', ()=> {
  const defaultProfile = profileData.defaultProfile
  let timeStamp = specUtil.timeStampAndRanNum()
  let functionVerify = () => specUtil.curlResource(defaultProfile.protectedSite, `/${timeStamp}`)
  let uiStatus
  
  beforeAll(() => { profileUtil.setupProfile(true)})
  afterAll(() => { set(true)})

  describe('off', () => {
    beforeAll(() => { set(false)})

    it('check uistatus is off', () => {
      verifyUiStatus(false)
    })
    it(`check non whitelist will not reload nor 400, curl=${timeStamp}`, () => {
      let status = functionVerify().status
      expect(specUtil.isReloadByStatusCode(status)).toBe(false)
      expect(specUtil.isRejectStatus(status)).toBe(false)
    })
  })
  describe('on', () => {
    beforeAll(() => { set(true)})

    it('check uistatus', () => {
      verifyUiStatus(true)
    })
    it(`check non whitelist will reload, curl=${timeStamp}`, () => {
      let status = functionVerify().status
      expect(specUtil.isReloadByStatusCode(status)).toBe(true)
    })
  })
  
  function verifyUiStatus(val) {
    expect(uiStatus).toBe(val)
  }
  function set(data) {
    const name = defaultProfile.name
    profileUtil.webProtection(name,data)
    uiStatus = profileUtil.webProtection(name)
  }
})