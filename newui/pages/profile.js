const BasePage = require('./page-base.js')
const DomainPage = require('./protection.domains')

class ProfilePage extends BasePage {
  clickTabAdvancedSettings() {this._toTabByLinkVisbileText(this.PageContants.profilePageTexts.tabAdvancedSetting)}
  clickTabBasicSetting() {this._toTabByLinkVisbileText(this.PageContants.profilePageTexts.tabBasicSettings)}
  clickTabWaf() {this._toTabByLinkVisbileText(this.PageContants.profilePageTexts.tabWaf)}
  clickTabWebProtectionSetting() {this._toTabByLinkVisbileText(this.PageContants.profilePageTexts.tabWebProtection)}
  enterProfileName(name) { this._profileNameSel.setValue(name) }
  getProtectionModeValue() { return this._getValueByMapAndFuncName(this.protectionModeMap, '_getBlockModeLabelSel') }
  getWafValue() {return this.getToggleStatusByBtnEnableOn(this._wafToggleSel)}
  getWebProtectionValue() {return this.getToggleStatusByBtnEnableOn(this._webProtectionToggleSel)}
  setProtectionMode(mode) { let labelSel = this._getBlockModeLabelSel(mode); this._waitAndToggleLableToTrue(labelSel)}
  setWaf(enabled) { this.toggleByBtnEnableOn(this._wafToggleSel, enabled) }
  setWebProtection(enabled) { this.toggleByBtnEnableOn(this._webProtectionToggleSel, enabled) }

  //Basic settings tab
  deleteIPListAll() {
    let mode = this.getIPBasedMode()
    let table = this._getIpListTableByMode(mode)
    this.deleteAllTableRowNoDialogNoTraffic(table)
  }
  enterUpstream(enable, protocl, ip, port) {
    this.clickTabBasicSetting()
    let entries = this._getTableValueRows(this._upstreamTable)
    let lastEntry = entries[entries.length - 1]
    let tds = lastEntry.$$('td[track-by="column"')

    //click to make element editable
    let needclick = [tds[0],tds[1],tds[3]]
    needclick.forEach((sel) => {sel.$('span').click()})

    let protoclSel = lastEntry.$('select[name="protocol"')
    let ipSel = lastEntry.$('input[name="ip"]')
    let enableSel = lastEntry.$('input[name="enable"]')
    let portSel = lastEntry.$('input[name="port"]')
    
    if(protoclSel.getValue() != protocl) {
      protoclSel.selectByAttribute('value',protocl)
      this.actionLogger.warn('protocl changed to ', protoclSel.getValue())
    }
    ipSel.setValue(ip)
    this.actionLogger.warn('upstream ip set to ', ip)
    if(enableSel.isSelected() != enable) {
      enableSel.click()
      this.actionLogger.warn('enableSel changed to ', enableSel.isSelected())
    }
    this.jsSetValue(portSel,port)
  }
  enterIPList(ip,netmask='255.255.255.255',type='host') {
    let mode = this.getIPBasedMode()
    let entries = this._getTableValueRows(this._getIpListTableByMode(mode))
    let lastEntry = entries[entries.length - 1]
    this.actionLogger.warn('enterIPList: type', type)
    lastEntry.$$('td')[0].$('span').click()
    lastEntry.$('select[name="ipType"]').selectByAttribute('value',type)
    this.actionLogger.warn('enterIPList: ip', ip)
    lastEntry.$('input[name="ip"]').setValue(ip)
    this.actionLogger.warn('enterIPList: netmask', netmask)
    lastEntry.$$('td')[2].$('span').click()
    let netmaskEle = lastEntry.$('input[name="netmask"]')
    this.jsSetValue(netmaskEle,netmask)
  }
  getSSLAlgorithm() {
    this.clickTabBasicSetting()
    let sslCiphers = this._sslCiphers.getValue()
    let proxySSLCiphers = this._proxySSLCiphers.getValue()
    return {sslCiphers,proxySSLCiphers}
  }
  getHttp2https() {
    this.clickTabBasicSetting()
    let enable = this.getToggleStatusByBtnEnableOn(this._http2httpsToggleSel)
    let originalPort, targetPort
    if(enable) {
      originalPort = this._originalPort.getValue()
      targetPort = this._targetPort.getValue()
    }
    return {enable,originalPort,targetPort}
  }
  clickAddIPList(mode) { this.clickTabBasicSetting(); this._getIpListAddNewButton(mode).click() }
  clickAddUpstream() { this.clickTabBasicSetting(); this._upstreamAddNew.click() }
  setEntry(val) { this.clickTabBasicSetting(); this.jsSetValue(this._entrySel,val) }
  getEntryValue() {this.clickTabBasicSetting(); return this._entrySel.getValue()}
  getHealthExamValue() {this.clickTabBasicSetting(); return this._healthExamSwitch.getValue()}
  getInvalidActionValue() {this.clickTabBasicSetting(); return this._getValueByMapAndFuncName(this.invalidRequestModeMap, '_getInvalidActionValueLabelSel')}
  getIPBasedMode() {this.clickTabBasicSetting(); return this._getValueByMapAndFuncName(this.ipBasedMap, '_getIpBasedLabelSel')}
  getIPList(mode) {this.clickTabBasicSetting(); return this.getParsedTableRowsValue(this._getIpListTableByMode(mode))}
  setInvalidAction(mode) {this.clickTabBasicSetting();let labelSel = this._getInvalidActionValueLabelSel(mode); this._waitAndToggleLableToTrue(labelSel)}
  selectIPBasedMode(mode) {this.clickTabBasicSetting();let labelSel = this._getIpBasedLabelSel(mode);  this._waitAndToggleLableToTrue(labelSel)}
  setDomain(name,protocol='http',port=80) { 
    this.clickTabBasicSetting()
    this._domainDivSel.$('select[name="protocol"]').selectByAttribute('value',protocol)
    this._domainDivSel.$('input[name="host"]').setValue(name) 
    let portSel = this._domainDivSel.$('input[name="port"]')
    this.jsSetValue(portSel,port+'')
  }
  setHealthExam(mode) {
    this.clickTabBasicSetting()
    this._healthExamSwitch.selectByAttribute('value',mode)
    //FIXME: TODO MORE OPTIONS TO CONFIGURE TCP AND HTTP
  }
  setHttp2https(enable,originalPort=80,targetPort=443) {
    this.clickTabBasicSetting()
    this.toggleByBtnEnableOn(this._http2httpsToggleSel,enable)
    if(enable) {
      this.jsSetValue(this._originalPort,originalPort)
      this.jsSetValue(this._targetPort,targetPort)
    }
  }
  setSSL(customized=false) {
    this.clickTabBasicSetting()
    this.toggleByBtnEnableOn($('#certCustomized').$('..'),customized)
    //FIXME: CANNOT UPLOAD SSL CERTS
  }
  setSSLAlgorithm(ciphers,proxyCiphers='DEFAULT') {
    this._sslCiphers.setValue(ciphers)
    this._proxySSLCiphers.setValue(proxyCiphers)
  }
  
  //Web Protection tab
  _webProtectionTabGetWrapper(sel) {this.clickTabWebProtectionSetting();return this.getToggleStatusByBtnEnableOn(sel)}
  _webProtectionTabToggleWrapper(sel,enabled) {this.clickTabWebProtectionSetting();this.toggleByBtnEnableOn(sel,enabled) }
  clickAddNewRequestList() {this.clickTabWebProtectionSetting(); this._requestListAddNew.click()}
  clickAddNewResponseList() {this.clickTabWebProtectionSetting(); this._responseWhiteListAddNew.click()}
  deleteRequestListAll() {this.clickTabWebProtectionSetting();this.deleteAllTableRowNoDialogNoTraffic(this._requestListTable)}
  deleteResponseListAll() { this.clickTabWebProtectionSetting(); this.deleteAllTableRowNoDialogNoTraffic(this._responseWhiteListTable)}
  getAutoToolValue() {return this._webProtectionTabGetWrapper(this._autoToolSel)}
  getBlockBrowserValue() {return this._webProtectionTabGetWrapper(this._blockBrowserSel)}
  getBlockWebviewValue() {return this._webProtectionTabGetWrapper(this._blockWebviewSel)}
  getConsoleValue() {return this._webProtectionTabGetWrapper(this._consoleMonitorSel)}
  getCrackValue() {return this._webProtectionTabGetWrapper(this._crackSel)}
  getFormEncryptEssValue() {return this._webProtectionTabGetWrapper(this._formEncryptionEssSel)}
  getRequestList(){ this.clickTabWebProtectionSetting(); return this.getParsedTableRowsValue(this._requestListTable) }
  getResponseList(){ this.clickTabWebProtectionSetting(); return this.getParsedTableRowsValue(this._responseWhiteListTable) }
  getSessionReplayValue()  {return this._webProtectionTabGetWrapper(this._sessionReplaySel)}
  setAutoTool(enabled) { this._webProtectionTabToggleWrapper(this._autoToolSel, enabled) }
  setBlockBrowser(enabled) {return this._webProtectionTabToggleWrapper(this._blockBrowserSel,enabled)}
  setBlockWebview(enabled) {return this._webProtectionTabToggleWrapper(this._blockWebviewSel,enabled)}
  setConsole(enabled) {return this._webProtectionTabToggleWrapper(this._consoleMonitorSel,enabled)}
  setCrack(enabled) { this._webProtectionTabToggleWrapper(this._crackSel, enabled) }
  setFormEncryptEss(enabled) {return this._webProtectionTabToggleWrapper(this._formEncryptionEssSel,enabled)}
  setSessionReplay(enabled) {return this._webProtectionTabToggleWrapper(this._sessionReplaySel,enabled)}
  enterRequestList(whitelist,note,getOnly) {
    let entries = this._getTableValueRows(this._requestListTable)
    let lastEntry = entries[entries.length - 1]
    this.actionLogger.warn('enterIPList: whitelist', whitelist)
    lastEntry.$('span.whitelist').click()
    lastEntry.$('input[name="whiteList"]').setValue(whitelist)
    if(note) {
      this.actionLogger.warn('enterIPList: note', note)
      lastEntry.$$('td')[1].$('span').click()
      let noteEle = lastEntry.$('input[name="note"]')
      this.jsSetValue(noteEle,note)
    }
    this.actionLogger.warn('enterIPList: getonly', getOnly)
    lastEntry.$$('td')[2].$('span').click()
    let getOnlyEle = lastEntry.$('input[name="getOnly"]')
    let currentValue = getOnlyEle.isSelected()
    if(currentValue != getOnly) {
      this.actionLogger.warn('enterIPList: getonly diff from currentvalue, click it', getOnly)
      this.jsClick(getOnlyEle)
      this.actionLogger.warn('enterIPList: after click', getOnlyEle.isSelected())
    }
  }
  enterResponseList(whitelist,note) {
    let entries = this._getTableValueRows(this._responseWhiteListTable)
    let lastEntry = entries[entries.length - 1]
    this.actionLogger.warn('enterIPList: whitelist', whitelist)
    lastEntry.$('span.whitelist').click()
    lastEntry.$('input[name="whiteList"]').setValue(whitelist)
    if(note) {
      this.actionLogger.warn('enterIPList: note', note)
      lastEntry.$$('td')[1].$('span').click()
      let noteEle = lastEntry.$('input[name="note"]')
      this.jsSetValue(noteEle,note)
    }
  }

  //Advance setings tab
  getHttpMethods(key) {this.clickTabAdvancedSettings();return this._getHttpMethodsInput(key).isSelected()}
  getNoScriptValue() {this.clickTabAdvancedSettings();return this.getToggleStatusByBtnEnableOn(this._noscriptToggleSel)}
  getOffsetPort() {this.clickTabAdvancedSettings();return this._offsetPortInput.getValue().trim()}
  getPortOffsetToggleStatus() {this.clickTabAdvancedSettings();return this.getToggleStatusByBtnEnableOn(this._portOffsetToggleSel)}
  getRequestHeaderTableValues() { return this._getReqResTableValues(this.requestHeaderMap) }
  getResponseHeaderTableValues() { return this._getReqResTableValues(this.responseHeaderMap) }
  selectOffsetProtocal(value) {this.clickTabAdvancedSettings(); this._offsetProtocalSel.selectByAttribute('value',`"${value}"`) }
  setOffsetPort(port) {this.clickTabAdvancedSettings();this.jsSetValue(this._offsetPortInput,port)}
  enterRequestHeader(key,enable,value) {this.clickTabAdvancedSettings();this._enterHeaderValue(this.requestHeaderMap[key],enable,value)}
  enterResponseHeader(key,enable,value) {this.clickTabAdvancedSettings();this._enterHeaderValue(this.responseHeaderMap[key],enable,value)}
  setNoScript(enabled) {this.clickTabAdvancedSettings(); this.toggleByBtnEnableOn(this._noscriptToggleSel, enabled) }
  toggleOffset(enabled) {this.clickTabAdvancedSettings(); this.toggleByBtnEnableOn(this._portOffsetToggleSel, enabled) }
  setHttpMethods(key,status) {
    this.clickTabAdvancedSettings()
    let ele = this._getHttpMethodsInput(key)
    if(ele.isSelected() != status) ele.click()
  }

  //WAF tab
  enterWafFilterId(id) {this.clickTabWaf(); this._wafFilterSel.setValue(id)}
  getWafTableContent() {this.clickTabWaf(); return this.getParsedTableRowsValue(this._wafResultTableSel)}
  getWafRuleIdStatusById(id) {
    if(id == undefined || id == '') {
      this.actionLogger.error(`invalid id getWafRuleIdStatusById: ${id}`)
      return;
    }
    this.clickTabWaf()
    this.enterWafFilterId(id)
    let currentTableContent = this.getWafTableContent()
    this.actionLogger.warn('waf rule id status:',id,currentTableContent)
    let info = currentTableContent[0]
    return info.includes('checked')
  }
  toggleWafById(id,status) {
    if(id == undefined || id == '') {
      this.actionLogger.error(`invalid id getWafRuleIdStatusById: ${id}`)
      return;
    }
    let currentStatus = this.getWafRuleIdStatusById(id)
    if(currentStatus != status) {
      this.actionLogger.warn('toggle rule', currentStatus, status)
      let rows = this._getTableValueRows(this._wafResultTableSel)
      let row = rows[0]
      let tds = row.$$('td')
      let td = tds[0]
      td.$('span').click()
      let inputEle = td.$('input[name="enable"]')
      inputEle.click()
      this.actionLogger.warn('toggle rule done',inputEle.isSelected())
    }
  }

  get _autoToolSel() {return $('#autoTool').$('..')}
  get _blockBrowserSel() {return $('#blockBrowser').$('..')}
  get _blockWebviewSel() {return $('#blockWebview').$('..')}
  get _consoleMonitorSel() {return $('#browserConsoleMonitoring').$('..')}
  get _crackSel() {return $('#crackBehavior').$('..')}
  get _domainDivSel() {return $('#tab_genernal').$('div.col-md-12')}
  get _entrySel() {return $('input[name="entry"]')}
  get _formEncryptionEssSel() {return $('#enableSubmissionData').$('..')}
  get _healthExamSwitch() {return $('select[name="healthExamSwitch"]')}
  get _http2httpsToggleSel() {return $('#http2https').$('..')}
  get _noscriptToggleSel() {return $('#noScript').$('..')}
  get _offsetPortInput() {return $('input[name="portOffsetPort"]')}
  get _offsetProtocalSel() {return $('select[name="portOffsetProtocol"]')}
  get _originalPort() {return $('input[name="originalPort"]')}
  get _portOffsetToggleSel() {return $('#portOffset').$('..')}
  get _profileNameSel() { return $('input[name="name"]') }
  get _proxySSLCiphers() {return $('input[name="proxySSLCiphers"]')}
  get _requestListAddNew() {return $('#btn_add_config_request')}
  get _requestListTable() { return this._findTableByValuesKey('result.config.requestList') }
  get _responseWhiteListAddNew() {return $('#btn_add_config_response')}
  get _responseWhiteListTable() { return this._findTableByValuesKey('result.config.responseList') }
  get _sessionReplaySel() {return $('#sessionReplay').$('..')}
  get _sslCiphers() {return $('input[name="sslCiphers"]')}
  get _tabMisc() {return $('#tab_misc')}
  get _targetPort() {return $('input[name="targetPort"]')}
  get _ultabs() {return $('ul#feature_tabs')}
  get _upstreamAddNew() { return $('#btn_add_server')  }
  get _upstreamTable() { return this._findTableByValuesKey('result.config.servers')  }
  get _wafFilterSel() {return $('#tab_waf').$('input[type="text"]')}
  get _wafResultTableSel() {return this._findTableByValuesKey('result.waf.ruleList')}
  get _wafToggleSel() {return $('#waf').$('..')}
  get _webProtectionToggleSel() {return $('#web').$('..')}
  get healthExamMap() {return {'off':'off','TCP':'TCP', 'HTTP':'HTTP'}}
  get invalidRequestModeMap() { return { 'reject': 'reject', 'blockingPage': 'blocking_page', 'redirect': 'redirect', 'blank':'blank' } }
  get ipBasedMap() { return { 'whitelist': 'ip_white_list', 'blacklist': 'ip_black_list','default':'all_ip_white_list' } }
  get protectionModeMap() { return { 'block': 'block', 'monitor': 'monitor', 'transparent': 'transparent' } }
  get requestHeaderMap() {
    return {
      'acceptEncoding': 'acceptEncoding',
      'host': 'host',
      'xRealIp': 'remoteIp',
      'xff': 'xForwarded',
      'wlProxyIp': 'proxyClientIp'
    }
  }
  get responseHeaderMap() {
    return {
      'xFrame': 'xFrame',
      'xContentType': 'xContentType',
      'xss': 'xss',
      'p3p': 'p3p',
    }
  }

  _getIpListAddNewButton(mode) { 
    let valueKeys = mode == this.ipBasedMap.whitelist ? 'btn_add_protection_off' : 'btn_add_protection_on'
    return $(`#${valueKeys}`)
  }
  _getIpListTableByMode(mode) {
    let valueKeys = mode == this.ipBasedMap.whitelist ? 'ipProtectionOffList' : 'ipProtectionOnList'
    return this._findTableByValuesKey(`result.config.${valueKeys}`)
  }
  _getActiveTabText() { return this._ultabs.$('li.active').getText().trim() }
  _getBlockModeLabelSel(mode) {return this._getInputSelByNameAndValue('mode',mode).$('..')}
  _getHttpMethodsInput(value) {return $(`input[name="httpMethods"][value="${value}"]`)}
  _getInputSelByNameAndValue(name,value) {let selString = `input[name="${name}"][value="${value}"]`; return $(selString)}
  _getInvalidActionValueLabelSel(mode) {return this._getInputSelByNameAndValue('invalidRequestPolicy',mode).$('..')}
  _getIpBasedLabelSel(mode) {return this._getInputSelByNameAndValue('ipProtection',mode).$('..')}
  _getToggleStatusByLabelClassActive(ele) { return ele.getAttribute('class').includes('active')}
  _toggleByByLabelClassActive(ele,status) { 
    if(this._getToggleStatusByLabelClassActive(ele) != status) {
      ele.click() 
      this.waitUntil(()=>this._getToggleStatusByLabelClassActive(ele) == status, true)
    }
  }
  _waitAndToggleLableToTrue(labelSel) { this.waitUnitlSpinnerGone();this._toggleByByLabelClassActive(labelSel, true) }

  _getValueByMapAndFuncName(valueMap,funcName) {
    let filteredModes = Object.values(valueMap).filter((mode) => {
      let ele = this[funcName](mode)
      return this._getToggleStatusByLabelClassActive(ele)
    })
    this.actionLogger.warn('current mode:', filteredModes)
    return filteredModes[0]
  }
  _findTableByValuesKey(keyString) { 
    this.waitUnitlSpinnerGone()
    let tables = $$('div.dap-pagingTable')
    for(let i=0; i<tables.length; i++) {
      let table = tables[i]
      let htmlText = table.getHTML()
      if(htmlText.includes(keyString)) {
        this.actionLogger.warn('found table by key', keyString)
        return table.$('table')
      }
    }
   }
  waitTilProfilePageLoaded() {
    this._waitTilSiteMapContains(this.siteMapTexts.ProtectionProfile)
    this.waitUnitlSpinnerGone()
  }
  waitTilFetchResultLoaded() {
    this.waitTilProfilePageLoaded()
    this.waitUnitlSpinnerGone($('#content').$('.fetch-result'))
    this.waitUntil(() => {
      let value = this._profileNameSel.getValue()
      return value.length > 0 && value != 'Name'
    }, true)
    this.waitUnitlSpinnerGone()
  }
  clickSave() {
    super.clickSave()
    this._waitTilSiteMapContains(this.siteMapTexts.Protection)
    this.waitUnitlSpinnerGone()
  }
  _toTabByLinkVisbileText(text) {
    //FIXME: NOT GOOD ON I18N
    this.waitTilFetchResultLoaded()
    if(this._getActiveTabText() != text) {
      this.actionLogger.warn('click tab with text', text)
      this._ultabs.$(`*=${text}`).click()
      this.waitUntil(() => this._getActiveTabText().includes(text), true)
      this.actionLogger.warn('after waiting', this._getActiveTabText())
      this.waitTilFetchResultLoaded()
    }
  }
  _getReqResTableValues(map) {
    this.clickTabAdvancedSettings()
    let res = {}
    Object.keys(map).forEach((key) => {
      let enable = this._tabMisc.$(`[name="${map[key]}Enable"]`).isSelected()
      let value = this._tabMisc.$(`[name="${map[key]}"]`).getValue()
      res[key] = {enable,value}
    })
    this.actionLogger.warn('_getReqResTableValues',res)
    return res
  }
  _enterHeaderValue(nameIdx,enabled=undefined,value=undefined) {
    let enableCtrl = this._tabMisc.$(`[name="${nameIdx}Enable"]`)
    let valueCtrl = this._tabMisc.$(`[name="${nameIdx}"]`)
    let currentValue = valueCtrl.getValue().trim()
    if(enabled!==undefined && enabled!=enableCtrl.isSelected()) {
      this.actionLogger.warn('click to enable', nameIdx)
      enableCtrl.click()
    }
    if(value!==undefined && !valueCtrl.getAttribute('readOnly') && value!=currentValue) {
      this.actionLogger.warn('set inputvalue to ', nameIdx, currentValue, value)
      if(valueCtrl.getTagName() == 'select') {
        valueCtrl.selectByAttribute('value',value)
      } else {
        valueCtrl.setValue(value)
        this.actionLogger.warn('set value success', value)
      }
      this.actionLogger.warn('after set, current value',valueCtrl.getValue().trim())
    }
  }
}

module.exports = ProfilePage