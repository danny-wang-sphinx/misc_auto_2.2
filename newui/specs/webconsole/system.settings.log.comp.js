const LogPage = require('../../pages/system.settings.log')
const data = require('../../data/system.settings')
const specUtil = require('../../specUtils/system.settings')

let page = new LogPage()
const udp = 'udp',tcp='tcp'
const logServerIp = data.logServerIp

describe('Log output: raw', () => {

  beforeAll(() => {page.open();specUtil.setRawLog(page,true,logServerIp,udp)})
  afterAll(() => specUtil.setRawLog(page,false))
  let res, logType = data.rawLog
  it('check ui: protocol and server', () => {
    res = specUtil.rawLogUiChecker(page)
    expect(res.detail.protocol).toBe(udp)
    expect(res.detail.server).toBe(logServerIp)
  })
  it('check the raw log is outputed to logserver, and protocol is udp', () => {
    res = specUtil.funcitonChecker(logType)
    let curlUrl = res.curlUrl
    expect(res.funcResult[logType]).toContain(curlUrl)
    expect(res.funcResult[logType]).toContain(udp)
  })
})

describe('Log output: formatted log', () => {
  beforeAll(() => {page.open();})
  afterAll(() => specUtil.setformattedLog(page,false))
  let res,logType = data.formattedLog
  describe('set tcp: all log', () => {
    let src = 'all'
    beforeAll(() => {specUtil.setformattedLog(page,true,logServerIp,tcp,src)})

    it('check ui: protocol and server', () => {
      res = specUtil.formattedLogUiChecker(page)
      expect(res.detail.protocol).toBe(tcp)
      expect(res.detail.server).toBe(logServerIp)
      expect(res.detail.source).toBe(src)
    })
    it('check both normal and abnormal log are outputed to logserver', () => {
      res = specUtil.funcitonChecker(logType)
      let curlUrl = res.curlUrl, logStr = res.funcResult[logType]
      let reg = new RegExp(curlUrl,'g')
      // curl both curlUrl and curlUrl.js, the .js is in the result, so regex should 
      // only match once
      expect(logStr.match(reg).length).toBe(2)
    })
  })
  describe('set udp: error log', () => {
    let src = 'error_log'
    beforeAll(() => {specUtil.setformattedLog(page,true,logServerIp,udp,src)})

    it('check ui: protocol and server and srouce', () => {
      res = specUtil.formattedLogUiChecker(page)
      expect(res.detail.protocol).toBe(udp)
      expect(res.detail.server).toBe(logServerIp)
      expect(res.detail.source).toBe(src)
    })
    it('check only abnormal log are outputed to logserver', () => {
      res = specUtil.funcitonChecker(logType)
      let curlUrl = res.curlUrl, logStr = res.funcResult[logType]
      let reg = new RegExp(curlUrl,'g')
      expect(logStr.match(reg).length).toBe(1)
      expect(res.funcResult[logType]).not.toContain(res.curlUrlJs)
    })
  })
})
