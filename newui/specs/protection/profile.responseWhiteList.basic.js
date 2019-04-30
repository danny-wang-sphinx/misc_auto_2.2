const ProfilePage = require('../../pages/profile')
const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const profileData = require('../../data/profile')


describe('protection response whitelist ', ()=> {
  const metaId = '<meta id="'
  const defaultProfile = profileData.defaultProfile
  let profilePage = new ProfilePage(),uiStatus
  let whitelist1 = {'whitelist':'^/$','note':''}
  let reqWhiteList = {'whitelist':`/${specUtil.timeStampAndRanNum()}`,'note':'','getOnly':false}
  
  beforeAll(() => {profileUtil.setupProfile(false)})
  afterAll(() => {profileUtil.setupProfile(false)})

  describe('set one item', () => {
    beforeAll(() => setResponseWhteList([whitelist1]))
    it('set one item, check ui', () => {
      expect(uiStatus.length).toBe(1)
      expect(uiStatus.toString()).toContain(whitelist1.whitelist)
    })
    it('in the response list, there is no meta id', () => {
      let res = _curl('/')
      expect(res.body).not.toContain(metaId)
    })
    it('not in the response list, there is meta id', () => {
      let res = _curl(reqWhiteList.whitelist)
      expect(res.body).toContain(metaId)
    })
  })
  function setResponseWhteList(whitelist) {
    toProfilePage()
    profileUtil.setResponseWhteList(profilePage,whitelist)
    uiStatus = getUiStatus()
  }
  function toProfilePage() {
    profileUtil.openPageAndToProfilePage(defaultProfile.name)
  }
  function _curl(url) {
    return specUtil.curlResource(defaultProfile.protectedSite,url)
  }
  function getUiStatus() {
    toProfilePage()
    return profilePage.getResponseList()
  }
})
