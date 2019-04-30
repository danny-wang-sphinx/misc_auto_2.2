const CommonUtil = require('./commonUtil')
const uiMsg = require('../constants/msg')
const LoginPage = require('../pages/login')

let defaultPwd = 'Admin123'

function add(page, type, name, enabled = true, pwd=defaultPwd){
  page.clickAddNew()
  page.inputUser(name, pwd, pwd, type,enabled)
}
function deleteAndVerify(page, name) {
  page.toAccount()
  page.deleteByUserName(name)
  page.toAccount()
  expect(page.isUserExistByUserName(name)).toBe(false)
}
function isActionBtnShownByINfo(info){
  return info[info.length-1] !== 'button.hidden'
}
function isUserEnabledByInfo(info) {
  return info[0] == 'checked'
}
function testAddAndDelete(page, role, name, enabled, logedInUsername) {
  add(page, role, name, enabled)
  _verifyAccountListHas(page, enabled, name, role, logedInUsername)
  deleteAndVerify(page, name)
}
function testChangeType(page, logedInUsername, oldRole, newRole, enabled, name, pwd=defaultPwd) {
  add(page, oldRole, name, enabled)
  page.toAccount()
  page.actionLogger.warn('update type', name, oldRole, newRole)
  page.updateTypeByUserName(name, newRole)
  _verifyAccountListHas(page, enabled, name, newRole, logedInUsername)
  _reloginCheckType(page, newRole, enabled, pwd, name)
}
function testEnableAndDisable(page, loggedInUsername, role, initalStatus, name, pwd=defaultPwd) {
  testEnableAndDisableAction(page, role, initalStatus, name)
  let newStatus = !initalStatus
  _verifyAccountListHas(page, newStatus, name, role, loggedInUsername)
  _reloginWithNewStatus(page, name, pwd, newStatus)
}
function testEnableAndDisableAction(page, role, initalStatus, name) {
  add(page, role, name, initalStatus)
  let newStatus = !initalStatus
  page.toAccount()
  page.actionLogger.warn('enable account', name, newStatus)
  page.enableAccountByUserName(name, newStatus)
}
function testUpdatePwd(page, loggedInUsername, role, enabled, name, newPwd) {
  add(page, role, name, enabled)
  // page.toAccount()
  page.actionLogger.warn('update pwd', name)
  page.updatePwdByUserName(name, newPwd)
  //Verify only pwd changed
  _verifyAccountListHas(page, enabled, name, role, loggedInUsername)
  //Verify can Login as new pwd
  _reloginWithNewStatus(page, name, newPwd, enabled)
}
function _reloginCheckType(page, role, enabled, pwd, name) {
  page.logout()
  page.actionLogger.warn('check new type', name, pwd)
  page.login(name, pwd)
  if (enabled) {
    let isVisible = (role == 'Viewer') ? false : true
    expect(page.isLoginUrl()).toBe(false)
    page.toDashboard()
    expect(page.isProtectionVisible()).toBe(isVisible)
    page.logout()
  } else {
    _verifyInactiveUser()
  }
}
function _reloginWithNewStatus(page, name, pwd, enabled) {
  page.logout()
  page.actionLogger.warn('relogin with new status', name, pwd)
  page.login(name, pwd)
  if (enabled) {
    expect(page.isLoginUrl()).toBe(false)
    page.toDashboard()
    page.logout()
  } else {
    _verifyInactiveUser()
  }
}
function _verifyAccountListHas(page, enabled, name, expectedRole, loggedInUsername) {
  page.toAccount()
  let actual = page.getAccountInfoByName(name)
  let isDeleteBtnShow = (loggedInUsername === name || name === 'admin' || name === 'support') ? false: true
  expect(actual.includes(expectedRole)).toBe(true)
  expect(isUserEnabledByInfo(actual)).toBe(enabled)
  expect(isActionBtnShownByINfo(actual)).toBe(isDeleteBtnShow)
}
function _verifyInactiveUser() {
  let loginPage = new LoginPage()
  let errors = loginPage.getAlertErrors()
  expect(errors).toContain(uiMsg.loginInactiveUser)
}

module.exports = {
  add,
  genNewName: CommonUtil.timeStampAndRanNum,
  isActionBtnShownByINfo,isUserEnabledByInfo,
  testAddAndDelete,
  testChangeType,
  testEnableAndDisable,
  testEnableAndDisableAction,
  testUpdatePwd,
}
