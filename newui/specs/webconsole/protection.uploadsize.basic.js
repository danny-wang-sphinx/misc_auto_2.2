const ProtetionSettingPage = require('../../pages/protection.settings')
const confUtil = require('../../confUtils')
const protectionData = require('../../data/protection.settings')
const defaultRelayServer = require('../../data/testbed').relayServer

describe('set maxium upload file size to 500', () => {
  let page = new ProtetionSettingPage(),res
  let newVal = '500'
  afterAll(() => _checkSetAndSave(protectionData.defaultFileUploadSize))
  beforeAll(() => { page.open(); _checkSetAndSave(newVal) })
  
  it('check UI value', () => {
    res = getUiStatus()
    expect(res).toBe(newVal)
  })
  it('check conf file', () => {
    // read actual value from conf file
    res = getConfValue()
    expect(res).toBe(newVal+'M')
  })
  function _checkSetAndSave(data) {
    toTab()
    if(page.getMaxFileSize() != data) {
      page.actionLogger.warn('current filesize is diff, set it', data)
      page.setMaxFileSize(data)
      page.clickSave()
      page.actionLogger.warn('set file success')
      toTab()
    }
  }
  function toTab() {
    page.toProtection()
    page.toSettingsTab()
  }
  function getUiStatus() {
    toTab()
    return page.getMaxFileSize()
  }
  function getConfValue() {
    return confUtil.getMaxUploadFileSzie(defaultRelayServer)
  }
})