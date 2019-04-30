const ProtetionSettingPage = require('../../pages/protection.settings')
const protectionSettingUtil = require('../../specUtils/protection.settings')
const profileUtil = require('../../specUtils/profile')
const protectionData = require('../../data/protection.settings')
const profileData = require('../../data/profile')
const echoProfile = profileData.echoProfile

describe('set error template', () => {
  let page = new ProtetionSettingPage(),uiStatus
  afterAll(() => {
    protectionSettingUtil.disableAllErrorTemplate()
    profileUtil.setupProfile(false,profileData.defaultProfile)
  })
  beforeAll(() => {
    profileUtil.setupProfile(false,echoProfile,{autoTool:false})
  })

  protectionData.errorStatusData.forEach((testObj)=> {
    describe(`${JSON.stringify(testObj)}`,() => {
      let keys = Object.keys(testObj)
      beforeAll(() => {
        protectionSettingUtil.setErrorStatusByObj(page,testObj)
        uiStatus = protectionSettingUtil.getErrorUiStatus(page,keys)
      })
      it(`check ui`, () => {
        keys.forEach(key => {
          expect(uiStatus[key]).toBe(testObj[key])
        })
      })
      it(`orginal response page content`, () => {
        let res = protectionSettingUtil.accessPageWithErrorCodes(keys,echoProfile.protectedSite)
        browser.debug()
        verifyPageContent(res,testObj)
      })
    })
  })

  function verifyPageContent(res, testObj) {
    let keys = Object.keys(testObj)
    keys.forEach((key) => {
      let shouldOriginal = testObj[key] === false
      let stringToMatch = `"returnCode": "${key}"`
      if (shouldOriginal) {
        expect(res[key]).toContain(stringToMatch);
      }
      else {
        expect(res[key]).not.toContain(stringToMatch);
      }
    })
  }
})


