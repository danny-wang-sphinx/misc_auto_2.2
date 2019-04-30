const logger = require('@wdio/logger').default
const wdioUtil = require('../../lib/wdioUtils')
const actionLogger = logger('[PageAction]')
class WizardPage {
  constructor() {
    this.actionLogger = actionLogger
  }
  basicSetup(pwd, timezone, postApplyWaitTimeInSec=300) {
    this.clickStart()
    this.acceptEula()
    this.clickNext()
    this.clickNext()
    this.enterPwd(pwd)
    this.confirmPwd(pwd)
    this.clickNext()
    this.setTImeZone(timezone)
    this.clickApply(postApplyWaitTimeInSec)
  }

  clickApply(postApplyWaitTimeInSec=300) {
    this.actionLogger.warn('click apply button')
    this._apply.click()
    this.actionLogger.warn('wait the loading show')
    browser.waitUntil(this._isBodyLoading,10000)
    this.actionLogger.warn(`wait the loading gone in ${postApplyWaitTimeInSec} sec`)
    browser.waitUntil(() => this._isBodyLoading() == false, postApplyWaitTimeInSec*1000)
    this.actionLogger.warn('apply finished')
  }
  clickStart() { this._startBtn.click() }
  clickNext() {this._next.click()}
  enterPwd(pwd) {this._pwd.setValue(pwd)}
  confirmPwd(pwd) {this._confirmPwd.setValue(pwd)}
  acceptEula() { this.enableEulaButton(); this._eulaBtn.click() }
  enableEulaButton() { browser.execute("document.querySelector('#eula-agreen-btn').removeAttribute('disabled')") }
  safeGetText(eleOrSel) { return wdioUtil.safeGetText(eleOrSel) }
  stepProgressNumberText() { return this.safeGetText(this._stepProgressNumber)}
  setTImeZone(text) {this._timezone.selectByVisibleText(text)}
  clickFinishBtn() {this._finishBtn.click()}
  isWizardUrl() {return browser.getUrl().includes('/wizard')}

  get _finishBtn() {return $('#finishBtn')}
  get _startBtn() {return $('#__WIZARD__ > div > div:nth-child(2) > button')}
  get _eulaBtn() {return $('#eula-agreen-btn')}
  get _selectCategory() { return $('.selectCategory')}
  get _stepProgressNumber() { return $('#__FORM__ > form > div')}
  get _next() {return $('#__WIZARD__ > div > div.bottomPanel > button.item.solid-button')}
  get _apply() { return $('#__WIZARD__ > div > div.bottomPanel > button.item.solid-button.nextOrApplyBtn') }
  get _pwd() {return $('#__WIZARD__ > div > div.contentPanel > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="password"]')}
  get _confirmPwd() { return $('#__WIZARD__ > div > div.contentPanel > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type="password"]')}
  get _timezone() { return $('#timezone') }

  _isBodyLoading() { return $('body.loading').isExisting() }
}

module.exports = WizardPage