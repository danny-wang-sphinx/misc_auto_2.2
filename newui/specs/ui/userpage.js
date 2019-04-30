const AccountPage = require('../../pages/account')
const AccountUtil = require('../../specUtils/account')
const testData = require('../../data/login')
const UiMsg = require('../../constants/msg')

describe('user update page', () => {
  let username = 'nono', pwd = 'Admin123', confirmedPwd = 'Admin1234'
  let page = new AccountPage()

  beforeEach(() => {
    page.open()
    page.clickAddNew()
  } )
  afterAll(() => page.logout())

  it('username is required', () => {
    _testFunc(undefined,pwd,confirmedPwd,UiMsg.usernameInvalid)
  })
  it('username should be >= 2', () => {
    _testFunc('a',pwd,confirmedPwd,UiMsg.usernameMin)
  })
  it('username should be <= 32', () => {
    let name = username.repeat(9)
    _testFunc(name,pwd,confirmedPwd,UiMsg.usernameMax)
  })
  testData.alphnumUnderscoreDash.forEach((name) => {
    it(`${name} as username can be accepted`, () => {
      _testFunc(name,undefined,pwd,UiMsg.pwdLengthInvalid)
    })
  })
  testData.invalidUsername.forEach((name) => {
    it(`username should not accept non alphnum ${name}`, () => {
      _testFunc(name,pwd,pwd,UiMsg.usernameInvalidChar)
    })
  })
  it('password min length check', () => {
    _testFunc(username,undefined,pwd,UiMsg.pwdLengthInvalid)
  })
  it('password max length check', () => {
    let longPwd = pwd.repeat(5)
    _testFunc(username,longPwd,longPwd,UiMsg.pwdLengthInvalid)
  })
  it('password should match, without confimredpwd', () => {
    _testFunc(username,pwd,undefined,UiMsg.pwdUnmatchConfirm)
  })
  it('password should match', () => {
    _testFunc(username,pwd,confirmedPwd,UiMsg.pwdUnmatchConfirm)
  })
  it(`password only contain upper letter should be rejected`, () => {
    let invlaidPwd = 'Adminadmin'.toUpperCase()
    _testFunc(username,invlaidPwd,invlaidPwd,UiMsg.pwdCombinError)
  })
  it(`password only contain lower letter should be rejected`, () => {
    let invlaidPwd = 'Adminadmin'.toLowerCase()
    _testFunc(username,invlaidPwd,invlaidPwd,UiMsg.pwdCombinError)
  })
  it(`password only contain upper and lower letter should be rejected`, () => {
    let invlaidPwd = 'Adminadmin'
    _testFunc(username,invlaidPwd,invlaidPwd,UiMsg.pwdCombinError)
  })
  it(`password only contain upper and number should be rejected`, () => {
    let invlaidPwd = 'ADMIN1234'
    _testFunc(username,invlaidPwd,invlaidPwd,UiMsg.pwdCombinError)
  })
  testData.pwdExcludeTestCases.forEach((invalidpwd) => {
    it(`password should not take ${invalidpwd}`, () => {
      _testFunc(username,invalidpwd,invalidpwd,UiMsg.pwdInvalidChar)
    })
  })
  function _testFunc(username,pwd,confirmedPwd,expectErrorMsg) {
    page.inputUser(username,pwd, confirmedPwd,undefined,undefined)
    let errorMsg = page.getAlertErrorText()
    page.actionLogger.warn('get error msg', errorMsg)
    expect(errorMsg).toContain(expectErrorMsg)
  }
})

describe('user update page', () => {
  let page = new AccountPage()
  let name 

  beforeEach(() => {
    page.open()
    page.clickAddNew()
    name = AccountUtil.genNewName()
  } )
  afterEach(() => {page.deleteByUserName(name)})
  afterAll(() => page.logout())

  testData.pwdWithOtherChars.forEach((pwd) => {
    it(`password should take ${pwd}`, () => {
      page.waitTilUpdateUserFormShow()
      page.inputUser(name,pwd, pwd,undefined,undefined)
      page.waitInputToAccounts()
      expect(page.getSiteMap()).toContain(page.siteMapTexts.Account)
    })
  })
})