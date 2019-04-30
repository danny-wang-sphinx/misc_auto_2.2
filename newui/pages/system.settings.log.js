const SystemSettingsPage = require('./system.settings')

class SystemSettingsLogPage extends SystemSettingsPage {
  clickSave() {
    super.clickSave()
    this.toLogTab()
  }
  getFormattedLogProtocol() {return this.getValueAndTrim(this._logFormatedProtocal)}
  getFormattedLogServer() {return this.getValueAndTrim(this._logFormatedServer)}
  getFormattedLogSource() {return this.getValueAndTrim(this._logFormatedSource)}
  getFormattedLogToggleStatus() {return this.getToggleStatusByBtnEnableOn(this._logFormatedOutput)}
  getRawLogProtocol() {return this.getValueAndTrim(this._logOrigProtocal)}
  getRawLogServer() {return this.getValueAndTrim(this._logOrigServer)}
  getRawLogToggleStatus() {return this.getToggleStatusByBtnEnableOn(this._logRawOutput)}
  toggleFormatedLog(status = true) {this.toggleByBtnEnableOn(this._logFormatedOutput,status)}
  toggleRawLog(status = true) { this.toggleByBtnEnableOn(this._logRawOutput,status) }

  inputRawServer(srv=undefined,port=undefined,protocol=undefined) {
    //FIXME: PORT
    port = undefined
    this.waitUnitlSpinnerGone()
    this.actionLogger.warn('enter raw server', srv,port,protocol)
    if (protocol != undefined) this._logOrigProtocal.selectByAttribute('value',protocol)
    if (srv != undefined) this.jsSetValue(this._logOrigServer,srv)
  }
  inputFormatedServer(srv=undefined,port=undefined,protocol=undefined,source=undefined) {
    //FIXME: PORT
    port = undefined
    this.waitUnitlSpinnerGone()
    this.actionLogger.warn('enter formated server', srv,port,protocol,source)
    if (protocol != undefined) this._logFormatedProtocal.selectByAttribute('value',protocol)
    if (srv != undefined) this.jsSetValue(this._logFormatedServer,srv)
    if (source != undefined) this._logFormatedSource.selectByAttribute('value',source)
  }

  get _logFormatedOutput() {return $('#tab_2').$$('div.toggle')[1]}
  get _logFormatedPort() {return $('input[name="logFormatted.port"]')}
  get _logFormatedProtocal() {return $('select[name="logFormatted.protocol"]')}
  get _logFormatedServer() {return $('input[name="logFormatted.server"]')}
  get _logFormatedSource() {return $('select[name="logFormatted.source"]')}
  get _logOrigPort() {return $('input[name="logOriginal.port"]')}
  get _logOrigProtocal() {return $('select[name="logOriginal.protocol"]')}
  get _logOrigServer() {return $('input[name="logOriginal.server"]')}
  get _logRawOutput() {return $('#tab_2').$$('div.toggle')[0]}

  open(username,pwd) {
    super.open(username, pwd)
    this.toLogTab()
  }
  toLogTab() {
    super.toLogTab()
    this.waitUnitlSpinnerGone()
  }
}

module.exports = SystemSettingsLogPage