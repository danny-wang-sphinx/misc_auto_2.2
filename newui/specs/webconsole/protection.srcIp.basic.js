const net = require('net')
const ProtetionSettingPage = require('../../pages/protection.settings')
const specUtil = require('../../specUtils/protection.settings')
const defaultProfile = require('../../data/profile').defaultProfile
const protectionData = require('../../data/protection.settings')

let localIp

//Grab the local IP 
let client = net.createConnection(defaultProfile.port,defaultProfile.fqdn,() => {
  localIp = client.localAddress
  client.end()
})
describe('update src ip ', () => {
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

  describe('to X-Forwarded-For: protectionData.last', () => {
    beforeAll(() => specUtil.checkSetAndSaveSrcIp(page,protectionData.xff, protectionData.last))
    const expectedValue = '3.3.3.3'
    
    it('check UI value', () => {
      let res = specUtil.getSrcIpUiStatus(page)
      expect(res.srcIPFrom).toBe(protectionData.xff)
      expect(res.xffPosition).toBe(protectionData.last)
    })
    it(`check log page shows IP as header value ${expectedValue}`, () => {
      let res = funcVerify()
      expect(res.funcValue).toBe(expectedValue)
    })
  })
  describe('to none', () => {
    const value = 'none'
    beforeAll(() => specUtil.checkSetAndSaveSrcIp(page,value))
    it('check UI value', () => {
      let res = specUtil.getSrcIpUiStatus(page)
      expect(res.srcIPFrom).toBe(value)
    })
    it(`the log page should show socket ip `, () => {
      let res = funcVerify()
      expect(res.funcValue).toBe(localIp)
    })
  })

  describe('to X-Real-IP', () => {
    beforeAll(() => specUtil.checkSetAndSaveSrcIp(page,protectionData.xrealIp))
    const expectedValue = '1.2.3.4'
  
    it('check UI value', () => {
      let res = specUtil.getSrcIpUiStatus(page)
      expect(res.srcIPFrom).toBe(protectionData.xrealIp)
    })
    it(`check log page shows IP as header value of:X-REAL-IP ${expectedValue}`, () => {
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