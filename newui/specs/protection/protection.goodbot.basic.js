const ProtetionSettingPage = require('../../pages/protection.settings')
const protectionSettingUtil = require('../../specUtils/protection.settings')
const profileUtil = require('../../specUtils/profile')
const commonUtil = require('../../specUtils/commonUtil')
const protectionData = require('../../data/protection.settings')
const profileData = require('../../data/profile')
const defaultProfile = profileData.defaultProfile

describe('set error template', () => {
  let page = new ProtetionSettingPage()
  let timeStamp,uiStatus
  const goodbotIP = protectionData.goodbotIPOption
  const goodbotUA = protectionData.goodbotUAOption
  let goodbotOptions = `${goodbotIP} ${goodbotUA}`
  afterAll(() => {
    setAndSave(true)
  })
  beforeAll(() => {
    protectionSettingUtil.setupSrcIp(protectionData.xrealIp)
    profileUtil.setupProfile(true, defaultProfile)
  })

  describe('on', () => {
    timeStamp = commonUtil.timeStampAndRanNum()
    beforeAll(() => setAndSave(true))

    it('check ui', () => {
      expect(uiStatus).toBe(true)
    })
    it('match goodbot request should pass through', () => {
      let res = _curl(goodbotOptions)
      expect(commonUtil.isReloadByStatusCode(res.status)).toBe(false)
      expect(commonUtil.isRejectStatus(res.status)).toBe(false)
    })
    it('match goodbot response should not include corejs link', () => {
      let res = _curl(goodbotOptions).body
      expect(commonUtil.isProtectionPageResponse(res)).toBe(false)
    })
    it('only goodbot ua, request should not pass through', () => {
      let res = _curl(goodbotUA)
      expect(commonUtil.isReloadByStatusCode(res.status)).toBe(true)
    })
  })
  describe('off', () => {
    timeStamp = commonUtil.timeStampAndRanNum()
    beforeAll(() => setAndSave(false))

    it('check ui', () => {
      expect(uiStatus).toBe(false)
    })
    it('match goodbot request should not pass through', () => {
      let res = _curl(goodbotOptions)
      expect(commonUtil.isReloadByStatusCode(res.status)).toBe(true)
    })
  })

  function setAndSave (enabled) {
    if (getUiStatus() !== enabled) {
      page.actionLogger.warn('toggle goodbot to', enabled)
      page.setGoodbot(enabled)
      page.actionLogger.warn('toggle goodbot done')
      page.clickSave()
    }
    uiStatus = getUiStatus()
  }
  function getUiStatus () {
    page.toProtection()
    page.toSettingsTab()
    return page.getGoodbotStatus()
  }
  function _curl (options) {
    return commonUtil.curlResource(defaultProfile.protectedSite, `/${timeStamp}`, '', options)
  }
})
