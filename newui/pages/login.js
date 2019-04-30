class LoginPage {
  login(userName, pwd) {
    this._userInput.setValue(userName)
    this._pwdInput.setValue(pwd)
    this._submitBtn.click()
  }
  getAlertErrors() {
    this._alertError.waitForDisplayed()
    return this._alertError.getText()
  }
  getErrorMsgs() {
    let res = []
    $$('.errmsg').forEach(errmsg => { res.push((errmsg.getText()))});
    return res
  }

  /* low level getter */
  get _userInput() { return $('#username') }
  get _pwdInput() { return $('#password') }
  get _submitBtn() { return $('#submitBtn')}
  get _alertError() { return $('div.alert-error') } 
}

module.exports = LoginPage
