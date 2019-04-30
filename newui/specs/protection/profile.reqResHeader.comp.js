const ProfilePage = require('../../pages/profile')
const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const protectionSettingUtil = require('../../specUtils/protection.settings')
const confUtil = require('../../confUtils')
const profileData = require('../../data/profile')
const relayServer = require('../../data/testbed').relayServer

describe('advanced setting: request and response headers', ()=> {
  const echoProfile = profileData.echoProfile
  let profilePage = new ProfilePage(),uiStatus
  
  beforeAll(() => { setup()})
  afterAll(() => {profileUtil.setupProfile(false,profileData.defaultProfile)})

  describe('all enabled with some changed value',() => {
    let reqData = profileData.requestHeaderWithChangedValue
    let resData = profileData.responseHeaderWithChangedValue
    beforeAll(() => setAndSave(reqData,resData))
    it('check uistatus', () => {
      expect(uiStatus.req).toEqual(reqData)
      expect(uiStatus.resp).toEqual(resData)
    })
    it(`check response headers`, () => {
      let header = _curl().header
      profilePage.actionLogger.warn('curlResult header', header)
      expect(header).toContain('X-Frame-Options: DENY')
      expect(header).not.toContain('X-XSS-Protection: 1; mode=block')
      expect(header).toContain('X-XSS-Protection: 1')
    })
    it(`check request headers upstream received`, () => {
      let header = _curl().body
      profilePage.actionLogger.warn('curlResult header', header)
      expect(header).toContain(`"Accept-Encoding": "gzip"`)
      expect(header).toContain(`"Host": "${reqData.host.value}"`)
      verifyFixedRequestHeader(header)
    })
    it('check p3p value from conf file', () => {
      let res = getP3PFromConf()
      expect(res.header).toBe('on')
      expect(res.headerValue.CP).toEqual(`CP="${resData['p3p'].value}"`)
    })
  })
  describe('all disabled',() => {
    let reqData = profileData.requestHeaderAllDisbaled
    let resData = profileData.responseHeaderAllDisbaled
    beforeAll(() => setAndSave(reqData,resData))
    it('check uistatus', () => {
      let reqStatus = Object.keys(uiStatus.req).map((key)=>uiStatus.req[key]['enable'])
      let resStatus = Object.keys(uiStatus.resp).map((key)=>uiStatus.resp[key]['enable'])
      expect(reqStatus.every((val)=> val==false)).toBe(true)
      expect(resStatus.every((val)=> val==false)).toBe(true)
    })
    it(`check response headers`, () => {
      let header = _curl().header
      profilePage.actionLogger.warn('curlResult header', header)
      expect(header).not.toContain('X-XSS-Protection')
      expect(header).not.toContain('X-Content-Type-Options')
      expect(header).not.toContain('X-Frame-Options')
    })
    it(`client sends xff and xrealip,check request headers upstream received`, () => {
      let options = `${profileData.fakeIpOptions} -H "Accept-Encoding: xyz"`
      let header = specUtil.curlResource(echoProfile.protectedSite, '/','',options).body
      profilePage.actionLogger.warn('curlResult header', header)
      expect(header).toContain(`"Accept-Encoding": "xyz"`)
      expect(header).toContain(`"X-REAL-IP": "1.2.3.4"`)
      expect(header).toContain(`"X-FORWARDED-FOR": "1.1.1.1, 2.2.2.2, 3.3.3.3"`)
      expect(header).not.toContain(`"WL-Proxy-Client-IP"`)
    })
    it(`client doesn't send xff and xrealip, check request headers upstream received`, () => {
      let header = specUtil.curlResource(echoProfile.protectedSite, '/').body
      profilePage.actionLogger.warn('curlResult header', header)
      expect(header).not.toContain(`"WL-Proxy-Client-IP"`)
      expect(header).not.toContain(`"X-Real-IP"`)
      expect(header).not.toContain(`"X-Forwarded-For"`)
    })
  })

  function getUiStatus() {
    profileUtil.openPageAndToProfilePage(echoProfile.name)
    let resp = profilePage.getResponseHeaderTableValues()
    let req = profilePage.getRequestHeaderTableValues()
    return {resp,req}
  }
  function setup() {
    protectionSettingUtil.setupSrcIp()
    profileUtil.setupProfile(false,echoProfile)
  }
  function setAndSave(reqHeaderObj,resHeaderObj) {
    profileUtil.setRequestAndResponseHeader(echoProfile.name,reqHeaderObj,resHeaderObj)
    uiStatus = getUiStatus()
  }
  function _curl() {
    return specUtil.curlResource(echoProfile.protectedSite, '/','',profileData.fakeIpOptions)
  }
  function getP3PFromConf() {
    return confUtil.getP3P(relayServer,echoProfile)
  }
  function verifyFixedRequestHeader(header) {
    expect(header).toContain(`"X-Real-IP": "1.2.3.4"`)
    expect(header).toContain(`"X-Forwarded-For": "1.1.1.1, 2.2.2.2, 3.3.3.3, `)
    expect(header).toContain(`"WL-Proxy-Client-IP": "1.2.3.4"`)
  }
})