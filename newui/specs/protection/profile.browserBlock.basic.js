const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const confUtil = require('../../confUtils')
const defaultProfile = require('../../data/profile').defaultProfile
const relayServer = require('../../data/testbed').relayServer

describe('protection web: block by browsers', ()=> {
  beforeAll(() => {profileUtil.setupProfile(false,defaultProfile,{autoTool:false})})
  afterAll(() => {profileUtil.setupProfile(false,defaultProfile)})
  
  let uiStatus
  let tests = [
    {browserStatus:true,webviewStatus:true,confValue:'all',reject:true},
    {browserStatus:false,webviewStatus:false,confValue:'none',reject:false},
  ]
  tests.forEach((test) => {
    describe(`${JSON.stringify(test)}`, () => {
    beforeAll(() => {set(test.browserStatus,test.webviewStatus)})

    it(`uicheck`, () => {
      verifyUiStatus(test.browserStatus,test.webviewStatus)
    })
    it(`conf check should be ${test.confValue}`, () => {
      let confValue = getConfVal()
      expect(confValue).toBe(test.confValue)
    })
    it(`browser access should be reject ${test.reject}`, () => {
      let pageSource = funcTest()
      sleep(3000)
      expect(specUtil.isAutoToolDetectedPageContent(pageSource)).toBe(test.reject)
    })
  })
  })
  
  function set(browserStatus, webviewStatus) {
    const name = defaultProfile.name
    profileUtil.browserBlock(name,{browserStatus,webviewStatus})
    uiStatus = profileUtil.browserBlock(defaultProfile.name)
  }
  function verifyUiStatus(browserStatus,webviewStatus) {
    expect(uiStatus.browserStatus).toBe(browserStatus)
    expect(uiStatus.webviewStatus).toBe(webviewStatus)
  }
  function getConfVal() {
    return confUtil.getBlockBrowser(relayServer,defaultProfile)
  }
  function funcTest() {
    return specUtil.accessTestwebFromBrowserAndPageSource(defaultProfile.protectedSite)
  }
  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
})
