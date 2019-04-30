const Dashboardpage = require('../../pages/dashboard')
const ProfilePage = require('../../pages/profile')
const controlServerUtil = require('../../specUtils/controlServerUtil')
const profileUtil = require('../../specUtils/profile')
const profileData = require('../../data/profile')

describe('Profile basic setting: health exam ', ()=> {
  const healthExamProfile = profileData.healthExamProfile
  let profilePage = new ProfilePage()
  let dashboardPage = new Dashboardpage()
  const allOnline = 'ALL online'
  const someOffline = 'Some offline'
  const allOffline = 'ALL offline'
  const disable = 'Disable'
  const origTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
  const maxTimeoutInSeconds = 150
  
  //FIXME
  beforeAll(() => { 
    profileUtil.setupProfile(false,profileData.healthExamProfile)
    startAllEchoServers()
    jasmine.DEFAULT_TIMEOUT_INTERVAL = maxTimeoutInSeconds * 1000
  })
  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = origTimeout
    profileUtil.setupProfile(false,profileData.defaultProfile)
    startAllEchoServers()
  })

  describe('off',() => {
    let value = profilePage.healthExamMap.off
    beforeAll(() => {checkAndSet(value);startAllEchoServers();})
    it('check uistatus', () => {
      getAndCheckUiStatus(value)
    })
    it(`check dashboard page`, () => {
      dashboardCheck(disable)
    })
  })
  describe('TCP',() => {
    let value = profilePage.healthExamMap.TCP
    beforeAll(() => {checkAndSet(value);startAllEchoServers();})
    it('check uistatus', () => {
      getAndCheckUiStatus(value)
    })
    it(`all online, check dashboard page`, () => {
      dashboardCheck(allOnline)
    })
    it(`one online, one offline, check dashboard page`, () => {
      controlServerUtil.stopEchoServer1()
      dashboardCheck(someOffline)
    })
    it(`all offline, check dashboard page`, () => {
      stopAllEchoServers()
      dashboardCheck(allOffline)
    })
    it(`from offline to online, check dashboard page, without manual refresh page`, () => {
      stopAllEchoServers()
      dashboardPage.toDashboard()
      waitTillPageContain(allOffline)
      startAllEchoServers()
      dashboardCheck(allOnline)
    })
  })
  describe('HTTP',() => {
    let value = profilePage.healthExamMap.HTTP
    beforeAll(() => {checkAndSet(value);startAllEchoServers();})
    it('check uistatus', () => {
      getAndCheckUiStatus(value)
    })
    it(`all online, check dashboard page`, () => {
      dashboardCheck(allOnline)
    })
    it(`one online, one offline, check dashboard page`, () => {
      controlServerUtil.stopEchoServer1()
      dashboardCheck(someOffline)
    })
    it(`all offline, check dashboard page`, () => {
      stopAllEchoServers()
      dashboardCheck(allOffline)
    })
  })
  
  function checkAndSet(data) {
    profileUtil.healthExam(healthExamProfile.name,data)
  }
  function getAndCheckUiStatus(value) {
    let res = profileUtil.healthExam(healthExamProfile.name)
    expect(res).toBe(value)
  }
  function startAllEchoServers() {
    controlServerUtil.startEchoServer1()
    controlServerUtil.startEchoServer2()
  }
  function stopAllEchoServers() {
    controlServerUtil.stopEchoServer1()
    controlServerUtil.stopEchoServer2()
  }
  function waitTillPageContain(text) {
    let fn = ()=>browser.getPageSource().includes(text)
    browser.waitUntil(fn,maxTimeoutInSeconds*1000,`failed at wait text ${text}`)
    dashboardPage.actionLogger.warn(`waitTillPageContain:${text} done`)
  }
  function dashboardCheck(exepectStr) {
    dashboardPage.toDashboard()
    waitTillPageContain(exepectStr)
    let info = dashboardPage.getProfileInfoByName(healthExamProfile.name)
    dashboardPage.actionLogger.warn('get dashboard profile info', info)
    expect(info.toString()).toContain(exepectStr)
  }
})