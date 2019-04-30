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
  
  describe('set two items, one getonly, one not', () => {
    beforeAll(() => setRequestWhiteList([whitelist1,whitelist2]))
    it('check ui', () => {
      expect(uiStatus.length).toBe(2)
      let info1 = uiStatus.filter((info)=>info.includes(whitelist1.whitelist))[0]
      let info2 = uiStatus.filter((info)=>info.includes(whitelist2.whitelist))[0]
      expect(profileUtil.isGetonlyByInfo(info1)).toBe(true)
      expect(profileUtil.isGetonlyByInfo(info2)).toBe(false)
    })
    it('get only: curl get will not reload', () => {
      let res = _curl(whitelist1.whitelist)
      expect(specUtil.isReloadByStatusCode(res.status)).toBe(false)
    })
    it('get only: curl post will be rejected', () => {
      let res = _curl(whitelist1.whitelist, '', '-d a=1')
      expect(specUtil.isRejectStatus(res.status)).toBe(true)
    })
    it('all: curl get will not reload', () => {
      let res = _curl(whitelist2.whitelist)
      expect(specUtil.isReloadByStatusCode(res.status)).toBe(false)
    })
    it('all: curl post will not be rejected', () => {
      let res =  _curl(whitelist2.whitelist, '', '-d a=1')
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
