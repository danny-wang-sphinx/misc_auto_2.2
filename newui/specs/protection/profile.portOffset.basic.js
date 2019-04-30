const specUtil = require('../../specUtils/commonUtil')
const profileUtil = require('../../specUtils/profile')
const profileData = require('../../data/profile')


describe('protection port offset ', ()=> {
  const defaultProfile = profileData.defaultProfile
  let testPort = 90, defaultPort = defaultProfile.port,uiStatus
  let _curl = () => specUtil.curlResource(defaultProfile.protectedSite, '/')
   
  beforeAll(() => { profileUtil.setupProfile(true);})
  afterAll(() => {set(false)})

  describe('set port 90',() => {
    beforeAll(() => set(true,testPort))

    it('ui check', () => {
      expect(uiStatus.toggleStatus).toBe(true)
      expect(uiStatus.portNum == testPort).toBe(true)
    })
    it('cookie token should be on 90', () => {
      let res = _curl()
      expect(res.header).toContain(`${testPort}S`)
      expect(res.header).toContain(`${testPort}T`)
    })
  })
  describe('disable',() => {
    beforeAll(() => set(false))

    it('ui check', () => {
      expect(uiStatus.toggleStatus).toBe(false)
    })
    it('cookie token should be same as domain listen port', () => {
      let res = _curl()
      expect(res.header).toContain(`${defaultPort}S`)
      expect(res.header).toContain(`${defaultPort}T`)
    })
  })
  function getUiStatus() {
    let res = profileUtil.portOffset(defaultProfile.name)
    let toggleStatus = res.enabled
    let portNum = res.port
    return {toggleStatus,portNum}
  }
  function set(enabled,port) {
    profileUtil.portOffset(defaultProfile.name,{enabled,port})
    uiStatus = getUiStatus()
  }
})

