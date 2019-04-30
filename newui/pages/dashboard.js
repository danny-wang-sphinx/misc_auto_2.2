const BasePage = require('../pages/page-base')

class DashboardPage extends BasePage {
  /* high level getter */
  getNodeInfoById(id) { return this._getInfoByKey(this._selNodesTable, id) }
  getNodeInfoByIP(ip) { return this._getInfoByKey(this._selNodesTable, ip)}
  getProfileInfoByName(name) { return this._getInfoByKey(this._selDomainTable, name) }
  isNodeExistByIp(ip) { return this.getNodeInfoByIP(ip) != undefined }
  isProfileExistByName(name) { return this.getProfileInfoByName(name) != undefined }
  isProfileNameClickable(name) { return this._selDomainTable.$(`*=${name}`).isExisting() }
  isProtectionLinkVisible() { this._waitDomainTitleShow(); return this._selProtectionLink.isExisting() }
  isSeeMoreVisible() { this._waitRequestTitleShow();  return this._selSeeMoreLink.isExisting()  }
  nodesList() { return this._toDashboardAndGetList(this._selNodesTable) }
  protectedSites() { return this._toDashboardAndGetList(this._selDomainTable) }

  /* page action */
  clickSeeMore() {
    this._waitRequestTitleShow()
    this._selSeeMoreLink.click()
    this._waitTilSiteMapContains(this.siteMapTexts.Statistics) 
    this._waitTillStatisticPageShow()
  }
  clickProtectionLink() {
    this._waitDomainTitleShow()
    this._selProtectionLink.click()
    this._waitTilSiteMapContains(this.siteMapTexts.Protection)
    this.waitUnitlSpinnerGone()
  }
  clickByProfileName(name) {
    this.toDashboard()
    this.clickByLinkText(name,this._selDomainTable)
    this._waitTilSiteMapContains(this.siteMapTexts.ProtectionProfile)
  }
  clickByNodeIP(ip) {
    this.toDashboard()
    this.clickByLinkText(ip,this._selNodesTable)
    this._waitTilSiteMapContains(this.siteMapTexts.Statistics)
    this._waitTillStatisticPageShow()
  }

  /* low level getter */
  get _selSeeMoreLink() { return this._selRequestTitle.$('a')}
  get _selProtectionLink() { return this._selDomainsTitle.$('a')}
  get _selRequestTitle() {return $('#wgRequestTitle')}
  get _selDomainsTitle() {return $('#wsDomainsTitle')}
  get _selNodesTitle() {return $('#wgNodesTitle')}
  get _selDomains() { return $('#wgDomains')}
  get _selNodes() { return $('#wgNodes')}
  get _selDomainTable() {return this._selDomains.$('table')}
  get _selNodesTable() {return this._selNodes.$('table')}

  open(username, pwd) {
    super.open(username, pwd)
    this.toDashboard(true)
  }
  toDashboard() {
    super.toDashboard()
    this.waitTilDashboardPageLoaded()
  }
  _getInfoByKey(tabelSel,key) {this.toDashboard(true); return this.getTableRowEntryInfoByKey(tabelSel,key)}
  _waitDomainTitleShow() {this._waitTitleShow(this._selDomainsTitle)}
  _waitNodesTitleShow() {this._waitTitleShow(this._selNodesTitle)}
  _waitRequestTitleShow() {this._waitTitleShow(this._selRequestTitle)}
  _waitTitleShow(sel) {this.waitUnitlSpinnerGone();sel.waitForDisplayed(this.longWaitTimeout)}
  _waitTillStatisticPageShow() {
    this.waitUnitlSpinnerGone()
    //FIXME:SHOULD NOT RELY ON ELEMENT OF OTHER PAGES
    $('#v1Frame').waitForDisplayed(this.longWaitTimeout*2)
    this.waitUnitlSpinnerGone()
  }
  _toDashboardAndGetList(table) {
    this.waitTilDashboardPageLoaded()
    return this.getParsedTableRowsValue(table)
  }
  waitTilDashboardPageLoaded() {
    this._waitRequestTitleShow()
    this._waitNodesTitleShow()
    this._waitDomainTitleShow()
    this.waitTilLoadHidenExist(this._selDomains)
    this.waitTilLoadHidenExist(this._selNodes)
    this.waitUnitlSpinnerGone()
  }
}

module.exports = DashboardPage