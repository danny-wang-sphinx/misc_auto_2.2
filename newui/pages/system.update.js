const BasePage = require('./page-base')

class SystemUpdatePage extends BasePage {
  constructor(waitTimeout = 30000) {
    super()
    this.longWaitTimeout = 20 * this.waitTimeout
  }
  open(username,pwd) {
    super.open(username, pwd)
  }
  
  toSystemUpdate() {
    super.toSystemUpdate()
  }
  
  upgradeFw(FwPath, FwVersion) {
    this.toSystemUpdate()
    this._uploadFwField.addValue(FwPath)
    browser.pause(3000)
    this._uploadFwBtn.click()
    this.waitUnitlSpinnerGone()
    this._upgradeFwBtn.click()
    this.waitUnitlSpinnerGone()
    this.waitUntil(() => this._upgradeMsgBox.isDisplayed() == true)
    //this._upgradeMsgBox.$('.modal-footer').$('button.btn.btn-warning').click()  //Click No for testing
    this._upgradeMsgBox.$('.modal-footer').$('button.btn.btn-default.dap-confirm-yes').click()
    this.actionLogger.warn(`Start to upgrade DynaShield to ${FwVersion}`)
    this.waitUntil(() => this._upgradeMsgBox.isDisplayed() == false)
    this.waitUnitlSpinnerGone()
    browser.pause(20000)
    let redirectToLogin = this.isLoginUrl()
    if ( redirectToLogin === true) {
      this.actionLogger.warn(`Redirect to login page after upgrading - ${redirectToLogin}, login again`)
      this.open()
    } else {
      this.actionLogger.warn(`Redirect to login page after upgrading - ${redirectToLogin}`)
    }
  }
  
  getCurrentVersion() {
    return this._currentVersion.getText()
  }

  doFactoryDefault() {
    this.longWaitTimeout = 6 * this.waitTimeout
    this.toSystemUpdate()
    this._factoryDefaultBtn.click()
    this.actionLogger.warn('Do facotry default')
    this.waitUntil(() => this._factoryConfirmMsgBox.isDisplayed() == true)
    this._factoryConfirmMsgBox.$('.modal-footer').$('button.btn.btn-default.dap-confirm-yes').click()
    this.waitUntil(() => this._factoryConfirmMsgBox.isDisplayed() == false)
    this.waitUntil(() => this._factorySuccessMsgBox.isDisplayed() == true)
    this._factorySuccessMsgBox.$('.modal-footer').$('button').click()
    this.waitUntil(() => this._factorySuccessMsgBox.isDisplayed() == false)
    this.waitUntil(() => this._wizardPage.isDisplayed() == true)
  }

  get _uploadFwField() {return $('#updateFile')}
  get _uploadFwBtn() {return $("#btn_save")}
  get _upgradeFwBtn() {return $("#content > div:nth-child(1) > div.fetch-result.col-md-12 > div > div > div:nth-child(1) > div.box-body > a")}
  get _upgradeMsgBox() {return $('#msgbox_update')}
  get _loginBtn() {return $("#submitBtn")}
  get _currentVersion() {return $("#app > div > footer > div > span")}
  get _factoryDefaultBtn() {return $("#content > div:nth-child(1) > div.fetch-result.col-md-12 > div > div > div:nth-child(3) > div.box-body > a")}
  get _factoryConfirmMsgBox() {return $("#msgbox_factory_reset")}
  get _factorySuccessMsgBox() {return $("#msgbox_factory_reset_success")}
  get _wizardPage() {return $("#__WIZARD__")}
}

module.exports = SystemUpdatePage