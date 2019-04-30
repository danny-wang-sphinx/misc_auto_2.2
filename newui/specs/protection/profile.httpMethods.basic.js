const ProfilePage = require('../../pages/profile')
const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const profileData = require('../../data/profile')

describe('protection http methods', ()=> {
  let profilePage = new ProfilePage(),uiStatus
  const allMethods = profileData.allMethods
  const defaultMehtods = profileData.defaultMehtods
  const defaultProfile = profileData.defaultProfile
  
  beforeAll(() => { profileUtil.setupProfile(true);})
  afterAll(() => {setMethods(defaultMehtods)})

  describe('enable all', () => {
    beforeAll(() => setMethods(allMethods))
    it('check ui status', () => {
      profilePage.actionLogger.warn('get ui status', uiStatus)
      allMethods.forEach((method) => {
        expect(uiStatus[method]).toBe(true)
      })
    })
    it('none method should be 403', () => {
      let res = curlResource()
      profilePage.actionLogger.warn('get curl status', res)
      Object.values(res).forEach((val) => expect(val != 403).toBe(true))
    })
  })
  describe('disable all default, enable all non-default', ()=> {
    let testMethods = allMethods.filter((method) => !defaultMehtods.includes(method))
    beforeAll(() => setMethods(testMethods))

    it('check ui status', () => {
      testMethods.forEach((method) => {
        expect(uiStatus[method]).toBe(true)
      })
      defaultMehtods.forEach((method) => {
        expect(uiStatus[method]).toBe(false)
      })
    })
    it('diabled should be forbidden status,enable should be 200 ', () => {
      let res = curlResource()
      profilePage.actionLogger.warn('get curl status', res)
      testMethods.forEach((method) => {
        expect(res[method] != 403).toBe(true)
      })
      defaultMehtods.forEach((method) => {
        expect(res[method] == 403).toBe(true)
      })
    })
  })
  
  function setMethods(methods) {
    toProfilePage()
    let disabledList = allMethods.filter((method) => !methods.includes(method))
    methods.forEach((method) => profilePage.setHttpMethods(method,true))
    disabledList.forEach((method) => profilePage.setHttpMethods(method,false))
    profilePage.clickSave()
    uiStatus = getUiStatus()
  }
  function getUiStatus() {
    toProfilePage()
    let res = {}
    allMethods.forEach((method) => res[method]=profilePage.getHttpMethods(method))
    return res
  }
  function curlResource() {
    let res = {}
    allMethods.forEach((method) => {
      let data = ['POST','PUT'].includes(method) ? '-d a=1' : '' 
      res[method] = specUtil.curlResource(defaultProfile.protectedSite,'/a.js','', `-X ${method} ${data}`).status 
    })
    return res
  }
  function toProfilePage() {
    profileUtil.openPageAndToProfilePage(defaultProfile.name)
  }
})
