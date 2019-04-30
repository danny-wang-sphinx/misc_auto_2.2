const profileUtil = require('../../specUtils/profile')
const confUtil = require('../../confUtils')
const defaultProfile = require('../../data/profile').defaultProfile
const relayServer = require('../../data/testbed').relayServer

describe('protection web standard security scheme: crack ', ()=> {
  const keyInConf = 'crack'
  let uiStatus
  
  beforeAll(() => { profileUtil.setupProfile(true,defaultProfile)})
  afterAll(() => {set(true)})

  let tests = [false,true]
  tests.forEach((test) => {
    describe(`${test}`, () => {
      beforeAll(() => set(test))
  
      it('check uistatus is off', () => {
        verifyUiStatus(test)
      })
      it(`check conf file min and max level include crack ${test}`, () => {
        verifyConfVal(test)
      })
    })
  }) 

  function set(data) {
    const name = defaultProfile.name
    profileUtil.crack(name,data)
    uiStatus = profileUtil.crack(name)
  }
  function verifyUiStatus(val) {
    expect(uiStatus).toBe(val)
  }
  function getConfVal() {
    return confUtil.getSecurityLevel(relayServer,defaultProfile)
  }
  function verifyConfVal(expectedVal) {
    let res = getConfVal()
    let minLevel = res.minLevel
    let maxLevel = res.maxLevel
    if (expectedVal) {
      expect(minLevel).toContain(keyInConf)
      expect(maxLevel).toContain(keyInConf)
    } else {
      expect(minLevel).not.toContain(keyInConf)
      expect(maxLevel).not.toContain(keyInConf)
    }
  }
})

