const SystemSettingsPage = require('./system.settings')

class SystemSettingGeneralPage extends SystemSettingsPage {
  clickSave() {
    super.clickSave()
    this.toGeneralTab()
  }
  getLoginCaptchaStatus() {
    return this.getToggleStatusByBtnEnableOn(this._divCaptchaDiv)
  }
  toggleCaptcha(status = false) {
    this.toggleByBtnEnableOn(this._divCaptchaDiv, status)
  }
  enterquotaAnalyzerValue(text) {this._selquotaAnalyzer.setValue(text)}
  enterquotaBackupValue(text) {this._selquotaBackup.setValue(text)}
  quotaAnalyzerValue() { return this.getValueAndTrim(this._selquotaAnalyzer) }
  quotaBackupValue() {return this.getValueAndTrim(this._selquotaBackup) }
  maxAnalyzer() {return this._selquotaAnalyzer.getAttribute('max')}
  maxBackup() {return this._selquotaBackup.getAttribute('max')}

  get _divCaptchaDiv() {return $('#tab_1').$('table.dap-enableBtn').$('div.toggle')}
  get _selquotaAnalyzer() {return $('#quotaAnalyzer')}
  get _selquotaBackup() {return $('#quotaBackup')}

  open(username,pwd) {
    super.open(username, pwd)
    this.toGeneralTab()
  }
  toGeneralTab() {
    super.toGeneralTab()
    this.waitUnitlSpinnerGone()
  }
}

module.exports = SystemSettingGeneralPage