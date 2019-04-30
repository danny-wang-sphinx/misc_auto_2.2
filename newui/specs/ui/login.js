const LoginPage = require('../../pages/login')
const BasePage = require('../../pages/page-base')
const loginData = require('../../data/login')
const uiMsg = require('../../constants/msg')

describe('Login page UI check', () => {
  let page = new LoginPage()
  const pwd = 'Admin123', username = 'admin'

  beforeEach(() =>  { browser.url('/')})
  afterEach(() => {new BasePage().logout()})

  loginData.uiMsgTestData.forEach((test) => {
    it(`${test.title} is required`, () => {
      page.login(test.username, test.pwd)
      let msg = page.getErrorMsgs()
      expect(msg.length).toBe(test.errs)
      expect(_isIncludeRequiredMsg(msg)).toBe(true)
      expect(_isIncludeAcceptedMsg(msg)).toBe(false)
    })
  })
  loginData.alphnumUnderscoreDash.forEach((test) => {
    it(`${test} as username can be accepted`, () => {
      page.login(test, pwd)
      let msg = page.getErrorMsgs()
      expect(msg.length).toBe(0)
    })
  })
  loginData.invalidUsername.forEach((test) => {
    it(`username should not accept non alphnum ${test}`, () => {
      page.login(test,pwd)
      let msg = page.getErrorMsgs()
      expect(msg.length).toBe(1)
      expect(_isIncludeAcceptedMsg(msg[0])).toBe(true)
    })
  })

  function _isIncludeRequiredMsg(msg) {
    return msg.includes(uiMsg.requiredMsg)
  }
  function _isIncludeAcceptedMsg(msg) {
    return msg.includes(uiMsg.alphnumUnderscoreDash)
  }
} )