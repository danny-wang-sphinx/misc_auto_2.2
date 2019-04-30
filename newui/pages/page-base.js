const wdioUtil = require('../../lib/wdioUtils')
const PageContants = require('../constants/page')
const LoginPage = require('./login')
const admin = require('../data/accounts').admin
const logger = require('@wdio/logger').default
const actionLogger = logger('[PageAction]')

class BasePage {
  constructor(waitTimeout = 10000) {
    this.waitTimeout = waitTimeout
    this.longWaitTimeout = 3 * this.waitTimeout
    this.actionLogger = actionLogger
    this.PageContants = PageContants
    this.siteMapTexts = this.PageContants.siteMapTexts
  }

  /* commone util*/
  clickByLinkText(text,parentEle=browser) { this.waitUnitlSpinnerGone(); parentEle.$(`*=${text}`).click(); this.waitUnitlSpinnerGone();}
  getTextAndTrim(ele) { return wdioUtil.getTextAndTrim(ele) }
  getValueAndTrim(ele) { this.waitUnitlSpinnerGone() ;return ele.getValue().trim() }
  isTalbeNoDataDispaly(table=browser) {return table.$('.tableNoData').isDisplayed()}
  isVisibleByText(eleOrSel) { this.waitUnitlSpinnerGone();  return this.safeGetText(eleOrSel) !== '' }
  jsCleanValue(ele) { browser.execute(function(ele){ele.value=''},ele) }
  jsClick(ele) { browser.execute(function(ele){ele.click()},ele) }
  jsSetValue(ele,text) { this.jsCleanValue(ele);ele.setValue(text) }
  safeGetText(eleOrSel) { return wdioUtil.safeGetText(eleOrSel) }
  deleteAllTableRowNoDialogNoTraffic(table) {
    this.waitUnitlSpinnerGone()
    while(table) {
      let rows = this._getTableValueRows(table)
      if(rows.length == 0) {
        this.actionLogger.warn('delete list: no row')
        break;
      } else {
        this.actionLogger.warn('delete list', rows.length)
        this.jsClick(rows[0].$('button'))
      }
    }
  }
  getParsedTableRowsValue(table) {
    this.waitUnitlSpinnerGone()
    if(!table || this.isTalbeNoDataDispaly(table)) {return []}
    let entries = this._getTableValueRows(table)
    return entries.map((entry) => {
      return entry.$$('td[track-by="column"]').map((td) => {
        let text = td.getText().trim(), value = ''
        if (text.length > 0) {
          value = text
        } else if (td.$('.fa-check-square-o').isExisting()) {
          value = 'checked'
        } else if (td.$('.fa-square-o').isExisting()) {
          value = 'unchecked'
        } else if (td.$('button.dap-hidden').isExisting()) {
          value = 'button.hidden'
        } else if (td.$('i').isExisting()) {
          value = td.$('i').getAttribute('data-original-title')
        }
        return value
      })
    })
  }
  getEntryEleByVisibleText(tableOrSel,text) {
    this.waitUnitlSpinnerGone()
    let table = this._eleOrSelWrapper(tableOrSel)
    if(!table || this.isTalbeNoDataDispaly(table)) {return []}
    let entries = this._getTableValueRows(table)
    for(let i =0; i<entries.length; i++) {
      let entry = entries[i]
      let tdTexts = entry.$$('td[track-by="column"]').map((td) => td.getText().trim())
      if(tdTexts.includes(text)) {
        return entry
      }
    }
  }
  
  getToggleStatusByBtnEnableOn(ele,spinnerParent=browser) {
    this.waitUnitlSpinnerGone(spinnerParent)
    let curClass = ele.getAttribute('class')
    this.actionLogger.warn('btn status', curClass)
    return curClass.includes('btn-enable-on')
  }
  getTableRowEntryInfoByKey(tabelSel,key) {
    //find the first matched table row content by key
    this.waitUnitlSpinnerGone()
    return this.getParsedTableRowsValue(tabelSel).filter((val) => val.includes(key))[0]
  }
  toggleByBtnEnableOn(ele,status = false,spinnerParent=browser) {
    this.waitUnitlSpinnerGone(spinnerParent)
    let curStatus = this.getToggleStatusByBtnEnableOn(ele)
    if(curStatus != status) {
      this.actionLogger.warn('toggle btn to', status)
      ele.click()
      this.actionLogger.warn('btn status now', ele.getAttribute('class'))
      this.waitUntil(() => this.getToggleStatusByBtnEnableOn(ele) === status, true)
    }
  }

  /* get status or properties */
  getAlertErrorText() { return this.isAlertErrorDisplay() ? this._alertError.getText().trim() :'' }
  getSiteMap() { this.waitUnitlSpinnerGone(); return this.getTextAndTrim($('#breadcrumb-path')) }
  getUser() { this.waitUnitlSpinnerGone(); return this.safeGetText($('.hidden-xs'))}
  isAccountInUserMenu() {this.toggleUserMemu(); return this._selUserBody.$('.fa-user').isExisting() }
  isAccountVisible() { return this._isSideMenuLinkVisible(this._menuAccount) }
  isAlertErrorDisplay() {return this._alertError.isDisplayed()}
  isDashboardVisible() { return this._isSideMenuLinkVisible(this._menuDashboard) }
  isLicenseVisible() { return this._isSystemSubMenuVisble(this._menuLicense)}
  isLoginUrl() { return browser.getUrl().includes('/login.html') }
  isLogsVisible() { return this.isVisibleByText(this._menuLogs) }
  isNetworkSettingsVisible() { return this._isSystemSubMenuVisble(this._menuNetworkSettings)}
  isProtectionVisible() { return this._isSideMenuLinkVisible(this._menuProtection) }
  isScheudleReportVisible() { return this._isSideMenuLinkVisible(this._menuScheduleReport) }
  isSSLCertificateVisbile() { return this._isSystemSubMenuVisble(this._menuSSLCertificate)}
  isStaticVisible() { return this._isSideMenuLinkVisible(this._menuStatistics) }
  isSystemSettingVisible() { return this._isSystemSubMenuVisble(this._menuSystemSettings)}
  isSystemUpdateVisible() { return this._isSystemSubMenuVisble(this._menuSystemUpdate)}
  isSystemVisible() { return this._isSideMenuLinkVisible(this._menuSystem) }
  _isSideMenuLinkVisible(sel) {
    try {
      return sel.isDisplayed() && sel.$('a').isDisplayed()
    } catch (error) {
      // Some browser driver doesn't support isDisplayed()
      return this.isVisibleByText(sel)
    }
  }
  
  /* high level page action */
  clickSave() {$('#btn_save').click();this.waitUnitlSpinnerGone();}
  clickUserMenu() {  this.jsClick(this._userMenuLink) }
  toAccount() { this._clickMenuAndWaitTilSiteMapText(this._menuAccount, this.siteMapTexts.Account) }
  toDashboard() { this._clickMenuAndWaitTilSiteMapText(this._menuDashboard, this.siteMapTexts.Dashboard) }
  toLicense() { this._toSystemSubMenu(this._menuLicense);}
  toLogs() { this._clickMenuAndWaitTilSiteMapText(this._menuLogs, this.siteMapTexts.Logs) }
  toNetworkSettings() { this._toSystemSubMenu(this._menuNetworkSettings); this._waitTilSiteMapContains(this.siteMapTexts.NetworkSettings)}
  toProtection() { this._clickMenuAndWaitTilSiteMapText(this._menuProtection, this.siteMapTexts.Protection) }
  toScheduleReport() { this._clickMenuAndWaitTilSiteMapText(this._menuScheduleReport, this.siteMapTexts.Schedule) }
  toSSLCertificate() { this._toSystemSubMenu(this._menuSSLCertificate) }
  toStatistics() { this._clickMenuAndWaitTilSiteMapText(this._menuStatistics, this.siteMapTexts.Statistics) }
  toSystemSettings() { this._toSystemSubMenu(this._menuSystemSettings); this._waitTilSiteMapContains(this.siteMapTexts.SystemSettings) }
  toSystemUpdate() { this._toSystemSubMenu(this._menuSystemUpdate) }
  toggleUserMemu(status = true) {
    this.actionLogger.warn('toogle user menu', status)
    if (this._isUserMenuExpanded() != status) {
      this.clickUserMenu()
      this.waitUntil(() => this._isUserMenuExpanded()==status,true)
    }
  }
  clickPasswordFromUserMenu() {
    this.toggleUserMemu()
    this._userPwd.click()
    this.waitUnitlSpinnerGone()
    this._waitTilSiteMapContains(this.siteMapTexts.User)
  }
  clickAccountsFromUserMenu() {
    this.toggleUserMemu()
    this._accountFromUserMenu.click()
    this.waitUnitlSpinnerGone()
    this._waitTilSiteMapContains(this.siteMapTexts.Account)
  }

  promiseLogin(userName = admin.username, pwd = admin.pwd) {
    browser.url('/')
    this.actionLogger.warn(`isLoginUrl, ${this.isLoginUrl()}, ${browser.getUrl()}`)
    if (!this.isLoginUrl() && this.getUser() == userName) {
      this.actionLogger.warn(`Already login as ${userName}`)
      return;
    } else if (!this.isLoginUrl() && this.getUser() != '' && this.getUser() != userName) {
      this.actionLogger.warn(`Need logout first`)
      this.logout()
    }
    this.login(userName, pwd)
    this.actionLogger.warn('logged in', this.getUser())
    this.waitUnitlSpinnerGone();
  }

  login(userName, pwd) {
    this.actionLogger.warn('Login', userName)
    new LoginPage().login(userName, pwd)
  }

  logout() {
    if (!this.isLoginUrl()) {
      this.actionLogger.warn('Ready to logout')
      this.toggleUserMemu()
      $('.fa-sign-out').click()
      this.waitUntil(this.isLoginUrl)
      this.actionLogger.warn('Logout Done')
      expect(this.isLoginUrl()).toBe(true)
    } else {
      this.actionLogger.warn('Not logged in, no need logout')
    }
  }

  open(userName = admin.username, pwd = admin.pwd) {
    this.promiseLogin(userName, pwd)
  }

  waitUntil(conditionFunc, isLongongWait = true) {
    browser.waitUntil(conditionFunc, this._getWaitTime(isLongongWait))
  }
  waitUnitlSpinnerGone(sel=browser, isLongongWait = true) {
    this.waitUntil(() => this._isSpinnerExisting(sel) == false, isLongongWait)
  }
  waitTilLoadHidenExist(sel) {
    this.waitUntil(() => sel.$('.dap-loading-hidden').isExisting(), true)
  }

  /* low level getter and status */
  get _accountFromUserMenu() { return this._selUserBody.$('.fa-user').$('..') }
  get _alertError() {return $('div.alert-error')}
  get _menuAccount() { return $('.dap-menu-users') }
  get _menuDashboard() { return $('.dap-menu-overview') }
  get _menuLicense() { return $('.dap-menu-system-license') }
  get _menuLogs() { return $('.dap-menu-log') }
  get _menuNetworkSettings() { return $('.dap-menu-system-network') }
  get _menuProtection() { return $('.dap-menu-protection') }
  get _menuScheduleReport() { return $('.dap-menu-schedule') }
  get _menuSSLCertificate() { return '.dap-menu-system-certificate' }
  get _menuStatistics() { return $('.dap-menu-statistics') }
  get _menuSystem() { return $('#menu-system') }
  get _menuSystemSettings() { return $('.dap-menu-system-setting') }
  get _menuSystemUpdate() { return $('.dap-menu-system-update') }
  get _selUserBody() {return $('.user-body') }
  get _userMenuLink() {return $('.user-menu > a')}
  get _userPwd() { return $('.fa-key')}
  get _sideMenu() { return $('#sidebar-menu')}

  /* low level page action */
  _toSystemSubMenu(sel) {
    this._promiseSystemMenuOpen()
    sel.waitForDisplayed(this.longWaitTimeout)
    sel.click()
    this.waitUnitlSpinnerGone()
  }
  _promiseSystemMenuOpen() {
    if(!this._isSystemMenuOpen()) { 
      this._menuSystem.click() 
      this.actionLogger.warn('_promiseSystemMenuOpen clicked')
      this.waitUntil(() => this._isSystemMenuOpen(), true)
    }
    this.actionLogger.warn('_promiseSystemMenuOpen status', this._isSystemMenuOpen())
  }
  _isSpinnerExisting(sel=browser) {
    try {
      return sel.$('.dap-loading').isExisting()
    } catch (error) {
      return false
    }
  }

  _clickMenuAndWaitTilSiteMapText(sel,mapText) {
    this.waitUnitlSpinnerGone()
    sel.click()
    this._waitTilSiteMapContains(mapText)
    this.waitUnitlSpinnerGone()
  }
  _eleOrSelWrapper(eleOrSel) { return wdioUtil.eleOrSelWrapper(eleOrSel) }
  _getTableValueRows(table) { return (table? table.$$('tr[track-by="entry"]'): []) }
  _getWaitTime(isLongongWait) { return isLongongWait ? this.longWaitTimeout : this.waitTimeout; }
  _isSystemMenuOpen() {return this._menuSystem.getAttribute('class').includes('menu-open')}
  _isSystemSubMenuVisble(selecotr) { this._promiseSystemMenuOpen(); return this._isSideMenuLinkVisible(selecotr) }
  _isUserMenuExpanded() {return this._userMenuLink.getAttribute('aria-expanded') == 'true'}
  _waitTilSiteMapContains(text) { this.waitUntil(() => this.getSiteMap().includes(text)) }
}

module.exports = BasePage