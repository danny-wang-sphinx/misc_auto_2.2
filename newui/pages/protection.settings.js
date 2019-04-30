const ProtectionPage = require('./protection.js')

class ProtectionSettings extends ProtectionPage {
  
  setMaxFileSize(val) {
    this.waitUnitlSpinnerGone()
    this._maxFileSizeSel.setValue(val)
  }
  setSourceIpByValue(val) {
    this.waitUnitlSpinnerGone()
    this._seourceIPSel.selectByAttribute('value',val)
  }
  setXffPositionByValue(val) {
    this.waitUnitlSpinnerGone()
    this._xffPositionSel.selectByAttribute('value',val)
  }
  getErrorTemplateStatus(statusCode) {
    return this._getErrorPageCheckbox(statusCode).isSelected()
  }
  getBlockingPageStatus() {
    return this.getErrorTemplateStatus('blocking')
  }
  getGoodbotStatus() {return this.getToggleStatusByBtnEnableOn(this._goodbotToggle)}
  getMaxFileSize() {return this._maxFileSizeSel.getValue()}
  getMsgboxBody() {return this.getTextAndTrim(this._msgBoxConfigIP.$('.modal-body'))}
  getSourceIPVal() {return this._seourceIPSel.getValue()}
  getXffPositionVal() {return this._xffPositionSel.getValue()}
  isMsgBoxShow() {return this._msgBoxConfigIP.isDisplayed()}
  selectNoFromMsgbox() { this._selectBtnFromMsgbox('button.btn-warning') }
  selectYesFromMsgbox() { this._selectBtnFromMsgbox('button.dap-confirm-yes') }
  setGoodbot(enabled) {this.toggleByBtnEnableOn(this._goodbotToggle,enabled)}
  viewErrorPage(errorCode) { $(`#btn_view_${errorCode}`).click() }
  waitTilMsgBoxConfigIPShow() {this.waitUntil(() => this.isMsgBoxShow())}
  toggleErrorTemplate(statusCode,enabled) {
    let currentStatus = this.getErrorTemplateStatus(statusCode)
    if (currentStatus != enabled) {
      this.actionLogger.warn('need toggle template',statusCode,enabled)
      this._getErrorPageCheckbox(statusCode).click()
      this.actionLogger.warn('toggle template done', statusCode)
    }
  }

  open(userName,pwd) {
    super.open(userName,pwd)
    this.toSettingsTab()
  }
  clickSave() {
    super.clickSave()
    let text = ''
    try {
      this.waitTilMsgBoxConfigIPShow()
    } catch (error) {
      this.actionLogger.warn('isMsgBoxShow: false')
    }
    if(this.isMsgBoxShow()) {
      text = this.getMsgboxBody()
      this.selectYesFromMsgbox()
    }
    return text
  }
  _selectBtnFromMsgbox(selString) {
    this._msgBoxConfigIP.$('.modal-footer').$(selString).click()
    this.actionLogger.warn('click modal footer', selString)
    this.waitUntil(() => this.isMsgBoxShow() == false,true)
  }

  get _maxFileSizeSel() {return $('input[name="maxUploadFileSize"]')}
  get _seourceIPSel() {return $('select[name="configSourceIp"]')}
  get _xffPositionSel() {return $('select[name="xffPosition"]')}
  get _msgBoxConfigIP() {return $('#msgbox_configSourceIp')}
  get _goodbotToggle() {return $('#bypassBot').$('..')}
  _getErrorPageTable() {
    const keywords = `id="btn_view_400"`
    let tables = $$('table')
    return this._getEleByKeyword(tables,keywords)
  }
  _getErrorPageRow(name) {
    if (name !== 'blocking') {
      name = `_${name}`
    }
    const keywords = `name="${name}"`
    let rows = this._getErrorPageTable().$('tbody').$$('tr')
    return this._getEleByKeyword(rows,keywords)
  }
  _getEleByKeyword(elements,keywords) {
    for(let i=0; i<elements.length; i++) {
      let ele = elements[i]
      if (ele.getHTML().includes(keywords)) {
        return ele
      }
    }
  }
  _getErrorPageCheckbox(name) {
    return this._getErrorPageRow(name).$('input[type="checkbox"]')
  }
  
}


module.exports = ProtectionSettings
