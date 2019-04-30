const ProfilePage = require('../../pages/profile')
const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const profileData = require('../../data/profile')


describe('protection request whitelist ', ()=> {
  const defaultProfile = profileData.defaultProfile
  let profilePage = new ProfilePage(),uiStatus
  let url1 = '/'+specUtil.timeStampAndRanNum()
  let url2 = '/'+specUtil.timeStampAndRanNum()
  let whitelist1 = {'whitelist':url1,'note':'','getOnly':true}
  let whitelist2 = {'whitelist':url2,'note':'','getOnly':false}
  
  beforeAll(() => { profileUtil.setupProfile(false)})
  afterAll(() => {profileUtil.setupProfile(false)})
  
  describe('set one item getonly', () => {
    beforeAll(() => setRequestWhiteList([whitelist1]))
    it('check ui', () => {
      expect(uiStatus.length).toBe(1)
      let info = uiStatus[0]
      expect(info.toString()).toContain(whitelist1.whitelist)
      expect(profileUtil.isGetonlyByInfo(info)).toBe(true)
    })
    it('curl get will not reload, curl post will be rejected', () => {
      let res = _curl(whitelist1.whitelist)
      expect(specUtil.isReloadByStatusCode(res.status)).toBe(false)
      res = _curl(whitelist1.whitelist, '', '-d a=1')
      expect(specUtil.isRejectStatus(res.status)).toBe(true)
    })
  })
  describe('set one item all', () => {
    beforeAll(() => setRequestWhiteList([whitelist2]))
    it('check ui', () => {
      expect(uiStatus.length).toBe(1)
      let info = uiStatus[0]
      expect(info.toString()).toContain(whitelist2.whitelist)
      expect(profileUtil.isGetonlyByInfo(info)).toBe(false)
    })

    it('not getonly, curl get and post will not be reject nor reload', () => {
      let res = _curl(whitelist2.whitelist)
      expect(specUtil.isReloadByStatusCode(res.status)).toBe(false)
      res = _curl(whitelist2.whitelist, '', '-d a=1')
      expect(specUtil.isRejectStatus(res.status)).toBe(false)
    })
  })

  function setRequestWhiteList(whitelist) {
    profileUtil.setRequestWhiteList(defaultProfile.name,whitelist)
    uiStatus = getUiStatus()
  }
  function toProfilePage() {
    profileUtil.openPageAndToProfilePage(defaultProfile.name)
  }
  function _curl(url,query,options) {
    return specUtil.curlResource(defaultProfile.protectedSite,url,query,options)
  }
  function getUiStatus() {
    toProfilePage()
    return profilePage.getRequestList()
  }
})
