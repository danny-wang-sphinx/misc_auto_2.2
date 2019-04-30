const ProtectionPage = require('./protection.js')

class DomainsPage extends ProtectionPage {
  clickAddNew() { $(this._addNew).click(); this._waitTilSiteMapContains(this.siteMapTexts.ProtectionProfile) }
  getDomainList() { this.toDomainTab(); return this.getParsedTableRowsValue(this._domainTableSel) }
  clickConfirmBtnFromDeleteBox(confirmYes=true) {
    let footer = this._msgBoxDeleteSel.$('div.modal-footer')
    let btn = confirmYes ? footer.$('button.dap-confirm-yes') : footer.$('button.btn-warning')
    this.actionLogger.warn('click btn from delete box', confirmYes)
    btn.click()
    this.waitUntil(() => this._msgBoxDeleteSel.isDisplayed() == false,true)
    this.waitTilDomainTableResultLoaded()
  }
  clickByProfileName(name) {
    this.toDomainTab()
    this.clickByLinkText(name,this._domainTableSel)
    // this._domainTableSel.$(`*=${name}`).click()
    this._waitTilSiteMapContains(this.siteMapTexts.ProtectionProfile)
    this.actionLogger.warn('sitemap contains expected')
    this.waitUnitlSpinnerGone()
    this.actionLogger.warn('click profile by name done',name)
  }
  deleteAllProfiles() {
    this.toDomainTab()
    let rows = this._getTableValueRows(this._domainTableSel)
    let profileNames = rows.map((row) => row.$('a').getText())
    profileNames.forEach((name) => this.deleteProfileByName(name))
  }
  deleteProfileByName(name,confirmYes=true) {
    this.toDomainTab()
    let rows = this._getTableValueRows(this._domainTableSel)
    for(let i=0; i<rows.length; i++) {
      let row = rows[i]
      let aText = row.$('a').getText()
      if(aText == name) {
        this.actionLogger.warn('ready to delete the profile', name)
        row.$('button').click()
        this.waitUntil(() => this._msgBoxDeleteSel.isDisplayed(),true)
        this.clickConfirmBtnFromDeleteBox(confirmYes)
        return;
      }
    }
  }
  isProfileExistByName(name) {
    this.waitTilDomainTableResultLoaded()
    return this._domainTableSel.$(`*=${name}`).isExisting()
  }

  get _addNew() {return '#btn_addNew'}
  get _domainTableSel() { return $('#tab_main').$('.fetch-result').$('table')}
  get _msgBoxDeleteSel() {return $('#msgbox_delete')}

  toDomainTab() {
    super.toDomainTab()
    this.waitTilDomainTableResultLoaded()
  }
  waitTilDomainTableResultLoaded() {
    this.actionLogger.warn('wait till spinner gone')
    this.waitUnitlFetchResultSpinnerGone()
    this.actionLogger.warn('wait till table visible')
    browser.waitUntil(() => this._domainTableSel.isDisplayed(), this.longWaitTimeout*2)
    this.actionLogger.warn('wait till table visible, done')
  }
  open(username,pwd) {
    super.open(username,pwd)
    this.toDomainTab()
  }
}


module.exports = DomainsPage
