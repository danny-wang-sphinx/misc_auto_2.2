const LogsBasePage = require('./logs')

class LogsSecurityPage extends LogsBasePage{  

  securityLogs() {
    this.toSecurityTab()
    return this.getParsedTableRowsValue(this._selCurrentTable)
  }

  clickWhiteListBtnByPath(path) {
    let btn = this._selCurrentTable.$(`button[data-record-path="${path}"]`)
    this.actionLogger.warn('click button to add white list')
    btn.click()
    this.waitUntil(() => this._whiteListMod.isDisplayed(), true)
  }
  clickUrlFromSecurityTable(partialText) {
    this.actionLogger.warn(`click linkText: ${partialText}`)
    this.clickByLinkText(partialText,this._selCurrentTable)
    this.waitUntil(() => this._detailMod.isDisplayed())
    this.actionLogger.warn('detail modal show')
  }

  //Modal dialog
  whiteListPathInputVal() {
    let ele = this._whiteListModBody.$('#pathInput')
    return this.getValueAndTrim(ele)
  }
  clickNoFromDialog() {
    this._clickBtnFromDialog(false)
  }
  clickYesFromDialog() {
    this._clickBtnFromDialog()
  }
  dismissDetailDialog() {
    this.actionLogger.warn('dismissDetailDialog')
    this._detailMod.$('.modal-footer').$('button').click()
    this.waitUntil(() => this._detailMod.isDisplayed() == false)
    this.actionLogger.warn('dismissDetailDialog done')
  }
  getDetailModalTableContent() {
    let table = $('table.dap-log-security-detail')
    let res = {}
    table.$$('tr').forEach((row) => {
      let tds = row.$$('td')
      let key = this.getTextAndTrim(tds[0])
      let value = this.getTextAndTrim(tds[1])
      res[key] = value
    })
    this.actionLogger.warn('get detail table',res)
    return res
  }
  
  get _whiteListMod() {return $('#msgbox_confirm_whiteList')}
  get _whiteListModBody() {return this._whiteListMod.$('div.modal-body')}
  get _detailMod() {return $('#msgbox_detail')}

  //modal dialog
  _clickBtnFromDialog(accept=true) {
    let btnSel = accept ? 'button.btn-default' : 'button.btn-warning'
    let ele = this._whiteListMod.$(btnSel)
    this.actionLogger.warn(`Click ${btnSel} from dialog`)
    ele.click()
    this.waitUntil(() => this._whiteListMod.isDisplayed()==false)
  }
}

module.exports = LogsSecurityPage