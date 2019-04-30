 const BasePage = require('./page-base')

class SystemSettingsPage extends BasePage {
  clickSave() {
    super.clickSave()
    this.actionLogger.warn('Clicked save button')
    this.waitUnitlSpinnerGone()
    this.actionLogger.warn('waitUntilSpinerGone...')

    //Having problem to check system settings page fully loaded, so use account page switch back
    this.toAccount()
    this.toSystemSettings()
  }
  waitUnitlSpinnerGone() { 
    for (let i=0; i<5; i++) {
      super.waitUnitlSpinnerGone($('#content').$('.fetch-result'),true)
    }
  }
  
  get _ultabs() {return $('ul.nav-tabs')}

  open(username,pwd) {
    super.open(username, pwd)
    this.toSystemSettings()
  }
  toSystemSettings() {
    super.toSystemSettings()
    this.toGeneralTab()
  }
  toGeneralTab() {
    this._toTabByLinkId('tab_general')
  }
  toLogTab() {
    this._toTabByLinkId('tab_log')
  }
  _toTabByLinkId(id) {
    this.waitUnitlSpinnerGone()
    this.actionLogger.warn('click tab with id', id)
    this._ultabs.$(`#${id}`).click()
    this.waitUntil(() => this._isCurrentTabHtmlIncludes(id), true)
    this.actionLogger.warn('after waiting', this._ultabs.$('li.active').getHTML())
    this.waitUnitlSpinnerGone()
  }
  _isCurrentTabHtmlIncludes(id) {
    return this._ultabs.$('li.active').getHTML().includes(id)
  }
}

module.exports = SystemSettingsPage