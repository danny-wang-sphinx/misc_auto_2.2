const BasePage = require('./page-base')

class LogsPage extends BasePage{  

  isOperationTabShow() {
    this.actionLogger.warn('get tab text',this.getTextAndTrim(this._ultabs))
    return this.getTextAndTrim(this._ultabs).includes('Operations')
  }
  
  toggleColumnPicker(status=true) {
    this._toggleDropDownMenu(this._selColPicker,status)
  }
  toggleCatDropdown(status=true) {
    this._toggleDropDownMenu(this._selCatPicker,status)
  }
  toggleCatByText(displayText, checked = true) {
    this.toggleCatDropdown()
    let dropDonwMenu = $(this._selCatPicker).$('.dropdown-menu')
    this._toggleItemFromDropdownMenuByText(dropDonwMenu, displayText, checked)
  }

  toggleColByText(displayText,checked = true) {
    this.toggleColumnPicker()
    let dropDonwMenu = $(this._selColPicker).$('.dropdown-menu')
    this._toggleItemFromDropdownMenuByText(dropDonwMenu, displayText, checked)
  }
  clickSearchButton() {
    this.waitTilResultLoaded()
    this._searchBtn.click()
    this.waitTilResultLoaded()
  }
  clickClearButton() {
    this.waitTilResultLoaded()
    this._clearBtn.click()
    this.waitTilResultLoaded()
  }
  enterFilterFiled(text) {
    this.waitTilResultLoaded()
    this._filterField.setValue(text)
  }
  getCurrentTableHeaders() {
    return this._selCurrentTable.$('thead').$$('th').map((ele) => ele.getText().trim())
  }
  
  keepSearchTillTableContain(toContainStr,maxTimeoutInSeconds = 180) {
    let found = false, tries = 0
    let stopTime = Date.now() + maxTimeoutInSeconds*1000000
    while(!found && Date.now()<stopTime) {
      this.clickSearchButton()
      try {
        browser.waitUntil(()=> this._isTableTextContain(toContainStr),this.waitTimeout,'',this.waitTimeout/3)
      } catch (e) {
        //ignore the error
        tries += 1
      }
      found = this._isTableTextContain(toContainStr)
    }
    this.actionLogger.warn(`keepSearchTillTableContain:tries=${tries},found=${found}`)
  }
  get _selCurrentTable() {return $('#tab_1').$('.dap-pagingTable').$('table')}
  get _selColPicker() {return '.PagingTable-columnPicker'}
  get _selCatPicker() {return 'div.dap-dropdown > div'}
  get _searchToolGroup() {return '.search-toolbar'}
  get _searchBtn() {return $(this._searchToolGroup).$$('button')[2]}
  get _clearBtn() {return $(this._searchToolGroup).$$('button')[0]}
  get _ultabs() {return $('ul.nav-tabs')}
  get _filterField() {return $('input[name="filterField"]')}

  open(username,pwd) {
    super.open(username,pwd)
    this.toLogs()
  }
  toLogs() {
    super.toLogs()
    this.toSecurityTab()
  }
  toSecurityTab() {
    this._toTabByiClassName('fa-shield')
    this.waitTilResultLoaded()
  }
  toOperationTab() {
    this._toTabByiClassName('fa-wrench')
    this.waitTilResultLoaded()
  }
  _toTabByiClassName(className) {
    this.waitUnitlSpinnerGone()
    this.actionLogger.warn('click tab with classname', className)
    let aTags = this._ultabs.$$('a')
    for (let i = 0; i<aTags.length; i++) {
      let ele = aTags[i]
      if (ele.getHTML().includes(className)) {
        ele.click()
        this.actionLogger.warn('click tab with classname clicked', className)
        break;
      }
    }
    this.waitUntil(() => this._isCurrentTabHtmlIncludes(className), true)
    this.waitTilResultLoaded()
  }
  _isCurrentTabHtmlIncludes(searchStr) {
    return this._ultabs.$('li.active').getHTML().includes(searchStr)
  }
  waitTilResultLoaded() {
    this.waitUnitlSpinnerGone()
    this.waitUnitlSpinnerGone($('#tab_1').$('.fetch-result'),true)
    browser.waitUntil(() => $('#tab_1').$('.fetch-result').$('.dap-loading-hidden').isExisting(),this.longWaitTimeout*2)
  }
  _toggleDropDownMenu(pickerStr, status=true) {
    let openText = ' open'
    let classValue = $(pickerStr).getAttribute('class').replace(openText,'')
    let newClass = status ? classValue + openText : classValue
    //make sure only has one open
    let cmd = `document.querySelector('${pickerStr}').setAttribute('class', '${newClass}')`
    this.actionLogger.warn('executeing',cmd)
    browser.execute(cmd)
  }
  _toggleItemFromDropdownMenuByText(dropDonwMenu,displayText,checked=true){
    let lis = dropDonwMenu.$$('li')
    for(let i = 0; i<lis.length; i++) {
      let text = this.getTextAndTrim(lis[i])
      if (text.includes(displayText)) {
        let style = lis[i].$('i.glyphicon').getAttribute('style')
        this.actionLogger.warn('get style', style)
        let status = !style.includes('display: none;')
        this.actionLogger.warn('get status', status)
        if (status != checked) {
          lis[i].$('a').click()
        }
      }
    }
  }
  _isTableTextContain(str) {
    return this._selCurrentTable.getText().includes(str)
  }
}

module.exports = LogsPage