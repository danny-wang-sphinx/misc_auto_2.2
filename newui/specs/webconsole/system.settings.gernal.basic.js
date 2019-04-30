const GeneralPage = require('../../pages/system.settings.general')
const confUtil = require('../../confUtils')
const systemSettingsData = require('../../data/system.settings')
const defaulRelayServer = require('../../data/testbed').relayServer

describe('system general page,', () => {
  let page = new GeneralPage()
  let newQuotaValue = 14, uiVal,confVal
  beforeAll(() => page.open())
  afterAll(() => {
    toTab()
    page.enterquotaBackupValue(systemSettingsData.defaultBackupSize)
    page.enterquotaAnalyzerValue(systemSettingsData.defaultLASize)
    page.clickSave()
  })

  describe(`set backupValue to ${newQuotaValue}`, () => {
    beforeAll(() => {
      toTab();page.enterquotaBackupValue(newQuotaValue);  page.clickSave();
    })
  
    it('check uivalue', () => {
      page.toAccount()
      toTab()
      uiVal = page.quotaBackupValue();
      expect(uiVal == newQuotaValue).toBe(true)
    })
    it('check config file value', () => {
      confVal = confUtil.getBackupDiskQuota(defaulRelayServer)
      expect(confVal).toBe(newQuotaValue)
    })
  })
  
  describe(`set analyzer to ${newQuotaValue}`, () => {
    beforeAll(() => {
      toTab()
      page.enterquotaAnalyzerValue(newQuotaValue)
      page.clickSave()
    })
  
    it('check uivalue', () => {
      page.toAccount() 
      toTab()
      uiVal = page.quotaAnalyzerValue()
      expect(uiVal == newQuotaValue).toBe(true)
    })
    it('check config file value', () => {
      confVal = confUtil.getEsDiskQuota(defaulRelayServer)
      expect(confVal).toBe(newQuotaValue)
    })
  })  

  function toTab() {
    page.toSystemSettings()
    page.toGeneralTab()
  }
})