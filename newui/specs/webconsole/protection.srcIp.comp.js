const ProtetionSettingPage = require('../../pages/protection.settings')
const specUtil = require('../../specUtils/protection.settings')
const defaultProfile = require('../../data/profile').defaultProfile
const protectionData = require('../../data/protection.settings')

describe('update src ip to', () => {
  let page = new ProtetionSettingPage()
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
  beforeAll(() => {
    page.open()
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 180 * 1000
  })
  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout
    specUtil.checkSetAndSaveSrcIp(page,protectionData.xrealIp)
  })
  describe('X-Forwarded-For: first', () => {
    beforeAll(() => specUtil.checkSetAndSaveSrcIp(page,protectionData.xff,protectionData.first))
    const expectedValue = '1.1.1.1'
  
    it('check UI value', () => {
      let res = specUtil.getSrcIpUiStatus(page)
      expect(res.srcIPFrom).toBe(protectionData.xff)
      expect(res.xffPosition).toBe(protectionData.first)
    })
    it(`check log page shows IP as header value ${expectedValue}`, () => {
      let res = funcVerify()
      expect(res.funcValue).toBe(expectedValue)
    })
  })
  describe('X-Forwarded-For: penultimate', () => {
    beforeAll(() => specUtil.checkSetAndSaveSrcIp(page,protectionData.xff, protectionData.penultimate))
    
    const expectedValue = '2.2.2.2'
    it('check UI value', () => {
      let res = specUtil.getSrcIpUiStatus(page)
      expect(res.srcIPFrom).toBe(protectionData.xff)
      expect(res.xffPosition).toBe(protectionData.penultimate)
    })
    it(`check log page shows IP as header value ${expectedValue}`, () => {
      let res = funcVerify()
      expect(res.funcValue).toBe(expectedValue)
    })
  })
  function funcVerify() {
    let res = specUtil.getSrcIPfromLogPage(defaultProfile.protectedSite,protectionData.fakeIpOptions)
    page.actionLogger.warn('check log page',res.curlUrl)
    return res
  }
})
