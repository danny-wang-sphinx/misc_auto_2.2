const BasePage = require('./page-base')

class SystemNetworkPage extends BasePage {
  addDNS(dns) {
    this.clickAddNewInDNSSection()
    this.enterDNSInLastRow(dns)
  }
  clickAddNewInDNSSection() {
    let section = this._getFormSectionByTableTitle(this.PageContants.networkPageTexts.DNSTitle)
    let sel = section.$('.dap-table-toolbar').$('button')
    sel.click()
  }
  deleteDns(dns) {
    this.waitUntilSectionFinishLoading(this._dnsSectionSel)
    let trs = this._DNSTableSel.$$('tr')
    trs.forEach((tr) => {
      let tdsTexts = tr.$$('td').map((td) => td.getText().trim())
      if (tdsTexts.includes(dns)) {
        this.actionLogger.warn('delete dns row', dns)
        tr.$('button').click()
        this.actionLogger.warn('delete done', dns)
      }
    })
  }
  deleteDnsAll() {
    this.waitUntilSectionFinishLoading(this._dnsSectionSel)
    this.deleteAllTableRowNoDialogNoTraffic(this._DNSTableSel)
  }
  dnsLists(onlyDns=true) {
    this.waitUntilSectionFinishLoading(this._dnsSectionSel)
    let res = this.getParsedTableRowsValue(this._DNSTableSel)
    this.actionLogger.warn('raw dns table', res)
    let finalResult = onlyDns ? res.map((val)=>val[0]) : res
    this.actionLogger.warn('retunred result', finalResult)
    return finalResult
  }
  enterDNSInLastRow(val) {
    let table = this._DNSTableSel
    let trs = table.$$('tr')
    this.actionLogger.warn('current rows', trs.length)
    let targeRow = trs[trs.length-1]
    let sel = targeRow.$('input[name="ip"]')
    sel.setValue(val)
  }
  getDnsByIP(ip) {
    this.waitUntilSectionFinishLoading(this._dnsSectionSel)
    return this.getTableRowEntryInfoByKey(this._DNSTableSel,ip)
  }
  getNtp() {
    return this._ntpSel.getValue()
  }
  isDnsExists(dns) { return this.dnsLists().includes(dns) }
  setNtp(val) {this.jsSetValue(this._ntpSel,val) }
  
  //Low level utils
  clickSave() {
    super.clickSave()
    this.actionLogger.warn('Clicked save button')
    this._extremeLongWait()
    this.actionLogger.warn('waitUntilSpinerGone...')
    this._extremeLongWait()
    this.actionLogger.warn('waitUntilSpinerGone...')
    //Make sure the content is refreshed
    this.toAccount()
    this.toNetworkSettings()
  }
  open(username,pwd) {
    super.open(username, pwd)
    this.toNetworkSettings()
  }
  toNetworkSettings() {
    super.toNetworkSettings()
    this._waitUnitlSpinnerGone()
  }
  
  get _routingTableSel() { return this._routingSectionSel.$('table') }
  get _DNSTableSel() { return this._dnsSectionSel.$('table') }
  get _routingSectionSel() { return this._getFormSectionByTableTitle(this.PageContants.networkPageTexts.routingTitle) }
  get _dnsSectionSel() { return this._getFormSectionByTableTitle(this.PageContants.networkPageTexts.DNSTitle) }
  get _ntpSel() {return $(`input[name="ntpServerAddress"]`)}

  _getFormSectionByTableTitle(titleText){
    this._waitUnitlSpinnerGone()
    let divs = $$('div.dap-form-section')
    for(let i=0; i<divs.length; i++) {
      let div = divs[i]
      let h4 = div.$('h4')
      if (this.getTextAndTrim(h4).includes(titleText)) {
        this.actionLogger.warn('Found section', titleText)
        return div
      }
    }
  }
  _extremeLongWait() {
    this.waitUnitlSpinnerGone($('#content'),true)
    const longWaiting = 50000
    //wait for around 4min
    for(let i=0; i<5; i++) {
      browser.waitUntil(() => $('.dap-loading').isExisting() == false, longWaiting)
      browser.waitUntil(() => $('.dap-loading-hidden').isExisting(), longWaiting)
    }

  }
  _waitUnitlSpinnerGone() {
    //The network config change is slow, and Jasmine timeout is 60s, the trick is to wait twice
    this.waitUnitlSpinnerGone($('#content'),true)
    const longWaiting = 50000
    for(let i=0; i<3; i++) {
      browser.waitUntil(() => $('.dap-loading').isExisting() == false, longWaiting)
    }
  }
  waitUntilSectionFinishLoading(sel) {
    this.waitUntil(() => sel.$('.dap-loading-hidden').isExisting() == true, true)
  }
}

module.exports = SystemNetworkPage