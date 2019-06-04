const DomainPage = require('../../pages/protection.domains')
const ProfilePage = require('../../pages/profile')
const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const profileData = require('../../data/profile')

describe('https: ', ()=> {
  const profile = profileData.httpsProfile
  let domainPage = new DomainPage()
  let profilePage = new ProfilePage()
  
  beforeAll(() => { profileUtil.setupProfile(false, profile)})
  afterAll(() => {profileUtil.setupProfile(false)})

  it('the profile show in the page', () => {
    domainPage.toProtection()
    expect(domainPage.isProfileExistByName(profile.name)).toBe(true)
  })
  it('the site is accessible', () => {
    checkSiteAccessible()
  })
  describe('change ssl ciphers to ECDHE-RSA-AES256-GCM-SHA384', () => {
    const ciphers = 'ECDHE-RSA-AES256-GCM-SHA384'
    beforeAll(() => {toProfilePage(); profilePage.setSSLAlgorithm(ciphers);profilePage.clickSave()})
    
    it('check ui', () => {
      toProfilePage()
      let res = profilePage.getSSLAlgorithm()
      expect(res.sslCiphers).toBe(ciphers)
    })
    it('site is accessible', () => {
      checkSiteAccessible()
    })
  })
  describe('http to https: on', () => {
    beforeAll(() => {toProfilePage(); profilePage.setHttp2https(true);profilePage.clickSave()})
    
    it('check ui', () => {
      toProfilePage()
      let res = profilePage.getHttp2https()
      expect(res.enable).toBe(true)
      expect(res.originalPort).toBe('80')
      expect(res.targetPort).toBe('443')
    })
    it('site is accessible', () => {
      checkSiteAccessible()
    })
    it('http will be redirect to https', () => {
      let res = specUtil.curlResource(`http://${profile.fqdn}`,'/')
      expect(specUtil.isRedirectStatus(res.status)).toBe(true)
      expect(res.header).toContain(`Location: https://${profile.fqdn}/`)
    })
    it('change to off, check ui, site accessbile, and curl http will return error:7', () => {
      toProfilePage()
      profilePage.setHttp2https(false)
      profilePage.clickSave()
      toProfilePage()
      let res = profilePage.getHttp2https()
      expect(res.enable).toBe(false)
      checkSiteAccessible()
      res = specUtil.curlResource(`http://${profile.fqdn}`,'/')
      expect(res.status).toBe(7)
    })
  })

  function toProfilePage() {
    profileUtil.openPageAndToProfilePage(profile.name)
  }
  function curlResource(uri='/',query='',options='') {
    return specUtil.curlResource(profile.protectedSite,uri,query,`-k ${options}`)
  }
  function checkSiteAccessible() {
    let status = curlResource().status
    browser.pause(3000)
    console.log('Danny: ' + status)
    expect(status==200).toBe(true)
  }
})