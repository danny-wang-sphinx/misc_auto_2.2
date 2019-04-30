const BasePage = require('./page-base.js')

class ProtectionPage extends BasePage {
  get _ultabs() {return $('ul.nav-tabs')}

  open(userName,pwd) {
    super.open(userName,pwd)
    this.toProtection()
  }
  toProtection() {
    this.actionLogger.warn('before super toprotection clicked')
    super.toProtection()
    this.actionLogger.warn('super toprotection clicked')
    this.toDomainTab()
    this.actionLogger.warn('toDomainTab ProtectionPage')
  }
  toDomainTab() {
    //delegate domainList page to implement detail waiting, here is just regular action and wait
    this._toTabByLinkId('tab_domains')
    this.waitUnitlFetchResultSpinnerGone()
  }
  toSettingsTab() {
    //delegate protecitonSettings page to implement detail waiting, here is just regular action and wait
    this._toTabByLinkId('tab_settings')
    this.waitUnitlFetchResultSpinnerGone()
  }
  _toTabByLinkId(id) {
    this.waitUnitlFetchResultSpinnerGone()
    this.actionLogger.warn('click tab with id', id)
    this._ultabs.$(`#${id}`).click()
    this.waitUntil(() => this._isCurrentTabHtmlIncludes(id), true)
    this.waitUnitlFetchResultSpinnerGone()
  }
  _isCurrentTabHtmlIncludes(id) {
    return this._ultabs.$('li.active').getHTML().includes(id)
  }
  waitUnitlFetchResultSpinnerGone() {
    this.actionLogger.warn('waitUnitlFetchResultSpinnerGone start')
    this.waitUnitlSpinnerGone($('#tab_main').$('.fetch-result'))
    this.actionLogger.warn('waitUnitlFetchResultSpinnerGone end')
  }
}


module.exports = ProtectionPage
