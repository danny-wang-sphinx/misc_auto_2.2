const NetworkPage = require('../../pages/system.network')
const networkData = require('../../data/network')
const specUtil = require('../../specUtils/system.network')
const confUtil = require('../../confUtils')
const defaultRelayServer = require('../../data/testbed').relayServer

let page = new NetworkPage(), res
// Network change is very slow, the case is fragile, so we only test 
// basic settings

describe('Network settings: dns', () => {
  const defaultDns = networkData.defaultDns
  beforeAll(() => { page.open();specUtil.setDnss(page, defaultDns)})
  afterAll(() => { specUtil.setDnss(page, defaultDns) })

  it('check ui status', () => {
    page.toNetworkSettings()
    res = page.dnsLists()
    page.actionLogger.warn('get dns list', res)
    expect(res.includes(defaultDns)).toBe(true)
  })
  it('check resolv.conf value', () => {
    let resolvFileContent = confUtil.getDnsFromFile(defaultRelayServer)
    page.actionLogger.warn('dns file content', resolvFileContent)
    expect(resolvFileContent.length).toBe(1)
    expect(resolvFileContent).toContain(defaultDns)
  })
})

describe('ntp', () => {
  const defaultNtp = networkData.defaultNtp
  beforeAll(() => {
    page.open();
    specUtil.setNtp(page, defaultNtp)
  })
  afterAll(() => specUtil.setNtp(page, defaultNtp))

  it('check ui value', () => {
    page.toNetworkSettings()
    let uiStatus = page.getNtp()
    page.actionLogger.warn('get ntp', uiStatus)
    expect(uiStatus).toBe(defaultNtp)
  })
  it('update, and ntp.conf file updated', () => {
    let confValue = confUtil.getNtpFromFile(defaultRelayServer)
    page.actionLogger.warn('ntp file content', confValue)
    expect(confValue).toContain(defaultNtp)
  })
})