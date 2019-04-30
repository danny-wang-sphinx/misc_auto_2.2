
const NetworkData = require('../data/network')
const NetworkPage = require('../pages/system.network')
const confUtil = require('../confUtils')

const relayServer = require('../data/testbed').relayServer
let currentDns = confUtil.getDnsFromFile(relayServer)
let currentNtp = confUtil.getNtpFromFile(relayServer)

describe('setup default network', () => {
  let page = new NetworkPage()
  const defaultDns = NetworkData.defaultDns
  const defaultNtp = NetworkData.defaultNtp

  const timeoutInSec = 300
  beforeAll(() => {
    page.open()
    jasmine.DEFAULT_TIMEOUT_INTERVAL = timeoutInSec * 1000
  })
  afterAll(() => jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout)

  it('set default dns and ntp', () => {
    let needClickSave = false
    if (!currentDns.includes(defaultDns)) {
      page.addDNS(defaultDns)
      needClickSave = true
    }
    if(!currentNtp.includes(defaultNtp)) {
      page.setNtp(defaultNtp)
      needClickSave = true
    }
    if(needClickSave) {
      page.clickSave()
      page.toAccount()
      page.open()
    }

    let isDnsExits = page.isDnsExists(defaultDns)
    expect(isDnsExits).toBe(true)
    let ntpValue = page.getNtp()
    expect(ntpValue).toBe(defaultNtp)
  })
})