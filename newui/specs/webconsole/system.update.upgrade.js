const SystemUpdatePage = require('../../pages/system.update')
const fwConfig = require('../../../fw/fw-config.json')

describe('System test - ', () => {
  let origJasminInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL
  let page = new SystemUpdatePage()
  let path = require("path");
  let testVersion=`${fwConfig.build}`
  let setFactory=`${fwConfig.setFactory}`
  let testFwFile=`forceshield_prod_release_base_${testVersion}.bin`
  let toUpload = path.join(__dirname, "../../..", "fw", testFwFile);
  beforeAll(() => setup())
  afterAll(() => tearDown())

  describe('Upgrade case / Factory default - ', () => {
    it ('Check current version and test version are not not the same', () => {
      let curDynaVer = page.getCurrentVersion()
      page.actionLogger.warn(`Current version is ${curDynaVer}, test version is ${testVersion}`)
      expect(curDynaVer).not.toBe(testVersion)
    })
    it('Upgrade FW to test version', () => {
      page.upgradeFw(toUpload, testVersion)
      let curDynaVer = page.getCurrentVersion()
      page.actionLogger.warn(`Current version is ${curDynaVer}, test version is ${testVersion}`)
      expect(curDynaVer).toBe(testVersion)
    })
    it('Factory Deafult Step', () => {
      if ( setFactory === 'yes' ) {
        page.actionLogger.warn('Try to do factory default, becasue setting in fw-config.json is yes')
        browser.pause(35000)
        page.doFactoryDefault()
      } else if ( setFactory === 'no' ) {
        page.actionLogger.warn('No need to do factory default, becasue setting in fw-config.json is No')
      } else {
        page.actionLogger.warn('Do not find setting in fw-config.json')
      }
    })
  })

  function setup() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600 * 1000
    page.open()
  }
  function tearDown() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origJasminInterval
  }
})