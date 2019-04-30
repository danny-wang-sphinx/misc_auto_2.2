const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const profileData = require('../../data/profile')

describe('protection no script ', ()=> {
  const defaultProfile = profileData.defaultProfile
  let _curl = () => specUtil.curlResource(defaultProfile.protectedSite,'/')
  let uiStatus

  beforeAll(() => { profileUtil.setupProfile(true);})
  afterAll(() => {set(false)})

  let tests = [true,false]
  tests.forEach((test) => {
    describe(`${test}`, () => {
      beforeAll(() => set(test))
      it('ui check', () => {
        expect(uiStatus).toBe(test)
      })
      it('check noscript meta', () => {
        let res = _curl()
        expect(specUtil.isNoScriptResponse(res.body)).toBe(test)
      })
    })
  })

  function set(data) {
    const name = defaultProfile.name
    profileUtil.noScript(name,data)
    uiStatus = profileUtil.noScript(name)
  }
})
