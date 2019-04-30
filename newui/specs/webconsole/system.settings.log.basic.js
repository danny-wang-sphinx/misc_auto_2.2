const LogPage = require('../../pages/system.settings.log')
const data = require('../../data/system.settings')
const specUtil = require('../../specUtils/system.settings')

let page = new LogPage()
const udp = 'udp',tcp='tcp'
const logServerIp = data.logServerIp
let res,logType = data.rawLog

describe('Log output: raw', () => {

  beforeAll(() => {page.open();logType = data.rawLog})
  afterAll(() => specUtil.setRawLog(page,false))

  describe('set tcp', () => {
    beforeAll(() => {
      specUtil.setRawLog(page,true,logServerIp,tcp)
    })

    it('check ui', () => {
      res = specUtil.rawLogUiChecker(page)
      expect(res.enabled).toBe(true)
      expect(res.detail.protocol).toBe(tcp)
      expect(res.detail.server).toBe(logServerIp)
    })
    it('check the raw log is outputed to logserver, and protocol is tcp', () => {
      res = specUtil.funcitonChecker(logType)
      let curlUrl = res.curlUrl
      expect(res.funcResult[logType]).toContain(curlUrl)
      expect(res.funcResult[logType]).toContain(tcp)
    })
  })
  describe('set off', () => {
    beforeAll(() => { specUtil.setRawLog(page,false)})

    it('check ui: enabled status', () => {
      res = specUtil.rawLogUiChecker(page)
      expect(res.enabled).toBe(false)
    })
    it('check the raw log is outputed to logserver', () => {
      res = specUtil.funcitonChecker(logType)
      let curlUrl = res.curlUrl
      expect(res.funcResult[logType]).not.toContain(curlUrl)
    })
  })
})

describe('Log output: formatted log', () => {
  beforeAll(() => {page.open();logType = data.formattedLog})
  afterAll(() => specUtil.setformattedLog(page,false))
  
  describe('set tcp: normal log', () => {
    let src = 'normal_log'
    beforeAll(() => {specUtil.setformattedLog(page,true,logServerIp,tcp,src)})

    it('check ui', () => {
      res = specUtil.formattedLogUiChecker(page)
      expect(res.enabled).toBe(true)
      expect(res.detail.protocol).toBe(tcp)
      expect(res.detail.server).toBe(logServerIp)
      expect(res.detail.source).toBe(src)
    })
    it('check the parsed log is outputed to logserver protocol is tcp,normal log', () => {
      res = specUtil.funcitonChecker(logType)
      let curlUrl = res.curlUrlJs
      expect(res.funcResult[logType]).toContain(curlUrl)
      expect(res.funcResult[logType]).toContain(tcp)
    })
    it('check the parsed log is outputed to logserver: abnormal log should not be there', () => {
      let curlUrl = res.curlUrl, logStr = res.funcResult[logType]
      let reg = new RegExp(curlUrl,'g')
      // curl both curlUrl and curlUrl.js, the .js is in the result, so regex should 
      // only match once
      expect(logStr.match(reg).length).toBe(1)
    })
  })
  describe('set off', () => {
    beforeAll(() => {specUtil.setformattedLog(page,false)})

    it('check ui: enabled status', () => {
      res = specUtil.formattedLogUiChecker(page)
      expect(res.enabled).toBe(false)
    })
    it('check the log is not outputed to logserver', () => {
      res = specUtil.funcitonChecker(logType)
      let curlUrl = res.curlUrlJs
      expect(res.funcResult[logType]).not.toContain(curlUrl)
    })
  })
})
