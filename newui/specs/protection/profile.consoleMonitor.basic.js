const profileUtil = require('../../specUtils/profile')
const confUtil = require('../../confUtils')
const defaultProfile = require('../../data/profile').defaultProfile
const relayServer = require('../../data/testbed').relayServer

describe('protection web: browser console monitor ', ()=> {

  beforeAll(() => { profileUtil.setupProfile(true,defaultProfile)})
  afterAll(() => {set(true)})

  let uiStatus

  let tests = [
    {uiStatus:false,confVal:'off'},
    {uiStatus:true,confVal:'on'},
  ]
  tests.forEach((test) => {
    describe(`${test.uiStatus}`, () => {
      beforeAll(() => { set(test.uiStatus) })
      it(`check uistatus ${test.uiStatus}`, () => {
        verifyUiStatus(test.uiStatus)
      })
      it(`check conf file ${test.confVal}`, () => {
        let res = getConfVal()
        expect(res).toBe(test.confVal)
      })
    })
  })
  
  function set(data) {
    const name = defaultProfile.name
    profileUtil.consoleMonitor(name,data)
    uiStatus = profileUtil.consoleMonitor(name)
  }
  function verifyUiStatus(val) {
    expect(uiStatus).toBe(val)
  }
  function getConfVal() {
    return confUtil.getConsoleOpen(relayServer,defaultProfile)
  }
})
