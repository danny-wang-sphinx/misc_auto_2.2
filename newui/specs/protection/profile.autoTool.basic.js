const commonUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const defaultProfile = require('../../data/profile').defaultProfile

describe('protection web standard security scheme: autoTool dection ', ()=> {
  beforeAll(() => {profileUtil.setupProfile(false,defaultProfile)})
  afterAll(() => { set(true)})
  let uiStatus 

  let onOff = [false, true]
  onOff.forEach((status) => {
    describe(`${status}`, () => {
      beforeAll(() => { set(status) })
      it('check uistatus', () => {
        verifyUiStatus(status)
      })
      it(`check webdriver will not be rejected or not`, () => {
        browser.pause(3000)
        let funcResult = funcTest()
        expect(commonUtil.isAutoToolDetectedPageContent(funcResult)).toBe(status)
      })
    })
  })

  function set(data) {
    const name = defaultProfile.name
    profileUtil.autoTool(name,data)
    uiStatus = profileUtil.autoTool(name)
  }
  function funcTest() {
    return commonUtil.accessTestwebFromBrowserAndPageSource(defaultProfile.protectedSite)
  }
  function verifyUiStatus(val) {
    expect(uiStatus).toBe(val)
  }
})
