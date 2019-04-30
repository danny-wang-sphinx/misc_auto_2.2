const ProfilePage = require('../../pages/profile')
const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const protectionSettingUtil = require('../../specUtils/protection.settings')
const profileData = require('../../data/profile')

describe('protection basic settings: IP based', ()=> {
  let profilePage = new ProfilePage(), uiStatus
  let curlData = '/'+specUtil.timeStampAndRanNum()
  const whiteList = profilePage.ipBasedMap.whitelist
  const blackList = profilePage.ipBasedMap.blacklist
  const defaultMode = profilePage.ipBasedMap.default
  const defaultProfile = profileData.defaultProfile
  const testIp1 = profileData.testIp1,testIp2 = profileData.testIp2
  const ipRange1 = profileData.ipRange1

  beforeAll(() => { protectionSettingUtil.setupSrcIp()})
  afterAll(() => { profileUtil.setupProfile(false)})

  describe('default: protect all IPs', () => {
    beforeAll(() => set(defaultMode))

    it('UI check mode', () => {
      expect(uiStatus.mode).toBe(defaultMode)
    })
    it(`curl should be reload, curl=${curlData}`, () => {
      let status = curlResource(testIp1.ip,curlData).status
      expect(specUtil.isReloadByStatusCode(status)).toBe(true)
    })
  })
  describe('off: with one single IP', () => {
    beforeAll(() => set(whiteList,[testIp2]))

    it('UI check mode', () => {
      expect(uiStatus.mode).toBe(whiteList)
      expect(uiStatus.ipList.length).toBe(1)
    })
    it(`off: in the list, curl should not be reload nor reject, curl=${curlData}`, () => {
      let status = curlResource(testIp2.ip,curlData).status
      expect(specUtil.isReloadByStatusCode(status)).toBe(false)
      expect(specUtil.isRejectStatus(status)).toBe(false)
    })
    it(`off: in the list, response should not include corejs, curl=${curlData}`, () => {
      let res = curlResource(testIp2.ip,curlData).body
      expect(specUtil.isProtectionPageResponse(res)).toBe(false)
    })
    it(`off: not in the list, curl should be reload, curl=${curlData}`, () => {
      let status = curlResource(testIp1.ip,curlData).status
      expect(specUtil.isReloadByStatusCode(status)).toBe(true)
    })
  })
  describe('off: with one subnet', () => {
    beforeAll(() => set(whiteList,[ipRange1]))

    it('UI check mode', () => {
      expect(uiStatus.mode).toBe(whiteList)
      expect(uiStatus.ipList.length).toBe(1)
    })
    it(`off: in the list,same ip, curl should not be reload nor reject, curl=${curlData}`, () => {
      let status = curlResource(ipRange1.ip,curlData).status
      expect(specUtil.isReloadByStatusCode(status)).toBe(false)
      expect(specUtil.isRejectStatus(status)).toBe(false)
    })
    it(`off: in the range,diff ip, curl should not be reload nor reject, curl=${curlData}`, () => {
      let status = curlResource(ipRange1.inRange,curlData).status
      expect(specUtil.isReloadByStatusCode(status)).toBe(false)
      expect(specUtil.isRejectStatus(status)).toBe(false)
    })
    it(`off: in the range, response should not include corejs, curl=${curlData}`, () => {
      let res = curlResource(ipRange1.inRange,curlData).body
      expect(specUtil.isProtectionPageResponse(res)).toBe(false)
    })
    it(`off: not in the range, curl should be reload, curl=${curlData}`, () => {
      let status = curlResource(ipRange1.outRange,curlData).status
      expect(specUtil.isReloadByStatusCode(status)).toBe(true)
    })
  })
  describe('on: with 1 IP', () => {
    beforeAll(() => set(blackList,[testIp1]))

    it('UI check mode', () => {
      expect(uiStatus.mode).toBe(blackList)
      expect(uiStatus.ipList.length).toBe(1)
    })
    it(`in the list, curl should be reloaded, curl=${curlData}`, () => {
      let status = curlResource(testIp1.ip,curlData).status
      expect(specUtil.isReloadByStatusCode(status)).toBe(true)
    })
    it(`not in the list, curl should not be reloaded nor rejected, curl=${curlData}`, () => {
      let status = curlResource(ipRange1.outRange,curlData).status
      expect(specUtil.isReloadByStatusCode(status)).toBe(false)
      expect(specUtil.isRejectStatus(status)).toBe(false)
    })
  })
  function curlResource(fakeIP,curlData) {
    let res = specUtil.curlResource(defaultProfile.protectedSite, curlData,'', `-H "X-Real-IP: ${fakeIP}"`)
    profilePage.actionLogger.warn(`${curlData}:status=${res.status}`)
    return res
  }
  function set(mode, ipList=[]) {
    const name = defaultProfile.name
    profileUtil.ipBased(name,{mode,ipList})
    uiStatus = profileUtil.ipBased(name)
  }
})

