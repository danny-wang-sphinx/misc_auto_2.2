const BasePage = require('./page-base')

class AccountPage extends BasePage {
  updateOwnPwd(pwd) {
    this.waitTilUpdateUserFormShow()
    this.actionLogger.warn('update own pwd', this.getUser())
    this.inputUser(undefined, pwd, pwd, undefined, undefined)
    this.waitUnitlUserFetchResultSpinnerGone()
  }
  //User List Page
  enableAccountByUserName(name, enabled = true) {
    this._toAccountAndClickByName(name)
    this.actionLogger.warn('enableAccountByUserName', name, enabled)
    this.inputUser(undefined, undefined, undefined, undefined, enabled)
    this.waitInputToAccounts()
  }
  updateTypeByUserName(name, newType = 'Viewer') {
    this._toAccountAndClickByName(name)
    this.actionLogger.warn('updateTypeByUserName', name, newType)
    this.inputUser(undefined, undefined, undefined, newType, undefined)
    this.waitInputToAccounts()
  }
  updatePwdByUserName(name, pwd) {
    this._toAccountAndClickByName(name)
    this.actionLogger.warn('updatePwdByUserName', name)
    this.inputUser(undefined, pwd, pwd, undefined, undefined)
    this.waitInputToAccounts()
  }
  accountList() {
    this._toAccountAndWait()
    return this.getParsedTableRowsValue(this._accountTable)
  }
  clickAddNew() {
    this.waitUntilUsersTableSpinerGone()
    this._selAddNew.click()
    this.waitTilUpdateUserFormShow()
  }
  clickByUserName(name) {
    this.waitUntilUsersTableSpinerGone()
    this.clickByLinkText(name,this._accountTable)
    // this._accountTable.$(`*=${name}`).click()
    this.waitTilUpdateUserFormShow()
  }
  deleteByUserName(name, cancle = false) {
    this._toAccountAndWait()
    let rows = this._accountTable.$('tbody').$$('tr')
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]
      let tds = row.$$('td')
      let userName = this.getTextAndTrim(tds[1])
      if (userName == name) {
        this.actionLogger.warn('deleting ', name)
        row.$('button').click()
        browser.waitUntil(() => $(this._deleteMsgBox).isDisplayed(), this.longWaitTimeout)
        this.clickBtnFromDeleteDialog(cancle)
        return;
      }
    }
  }
  clickBtnFromDeleteDialog(cancl) {
    let noBtn = 'button.btn.btn-warning'
    let yestBtn = 'button.btn.btn-default'
    let buttonToClick = cancl ? noBtn: yestBtn
    this.actionLogger.warn('click btn', buttonToClick)
    $(this._deleteMsgBox).$('div.modal-footer').$(buttonToClick).click()
    browser.waitUntil(() => $(this._deleteMsgBox).isDisplayed() == false, this.longWaitTimeout)
  }
  isUserExistByUserName(name) {
    return this.getAccountInfoByName(name) != undefined
  }
  getAccountInfoByName(name) {
    this._toAccountAndWait()
    return this.getTableRowEntryInfoByKey(this._accountTable,name)
  }
  
  //User Update Page
  inputUser(name, pwd, confirmPwd, type, enabled) {
    //tricky, to gain the racing condition
    this.waitTilUpdateUserFormShow()
    this.actionLogger.warn('initial status', this.isAccountEnabled(),this.isAccountTypeReadonly(),
      this.isUserInputReadonly(), this.isPwdInputVisible())
    if (enabled != undefined) this.toggleByBtnEnableOn(this._selEnabled,enabled) // tricky
    if (type != undefined && !this.isAccountTypeReadonly()) {
      this._selectAccountType.selectByAttribute('value',this.typeValuemap[type])
    }
    if (name != undefined && !this.isUserInputReadonly()) this._selUserInput.setValue(name)
    if (pwd != undefined && this.isPwdInputVisible()) this._selPwdInput.setValue(pwd)
    if (confirmPwd != undefined && this.isPwdInputVisible()) this._selPwdConfirmInput.setValue(confirmPwd)
    this._saveBtn.click()
    this.waitUnitlSpinnerGone()
  }
  getDisplayedUserName() { return this.getValueAndTrim(this._selUserInput)}
  getDisplayedUserTypeValue() { return this.getValueAndTrim(this._selectAccountType)}
  isAccountEnabled() { return this.getToggleStatusByBtnEnableOn(this._selEnabled) }
  isAccountTypeReadonly() { return this._selectAccountType.getAttribute('disabled') === 'true' }
  isEnableButtonReadonly() { return this._selForm.$('#activated').getAttribute('disabled') === 'true' }
  isPwdInputVisible() { return this._selPwdInput.isDisplayed() }
  isUserInputReadonly() { return this._selUserInput.getAttribute('readonly') === 'true' }

  //User List Page
  get _accountTable() { this.waitUntilUsersTableSpinerGone();return this._selUsers.$('.dap-pagingTable').$('table.table-condensed') }
  get _selAddNew() { return $('#btn_addNew') }
  get _selUsers() {return $('.dap-users')}

//User Update Page
  get _boxTitleSel() {return 'h3.box-title'}
  get _deleteMsgBox() { return '#msgbox_delete'}
  get _saveBtn() { return $('#btn_save') }
  get _selectAccountType() { return $('select[name="accountType"]' )}
  get _selEnabled() { return $('div.toggle.btn') }
  get _selForm() {return $('#content').$('.fetch-result').$('form')}
  get _selPwdConfirmInput() { return $('input[name="confirmPassword"]') }
  get _selPwdInput() { return $('input[name="password"]') }
  get _selUserInput() { return $('input[name="name"]') }
  get typeValuemap() {return {'Admin':'1', 'Viewer':'3','Support':'2'}}

  open(username, pwd) {
    super.open(username, pwd)
    this.toAccount()
  }
  toAccount() {
    super.toAccount()
    this.actionLogger.warn('wait for boxtitle',this.PageContants.accountPageTexts.boxTitle )
    this.waitUntil(() => $(this._boxTitleSel).getText().trim().includes(this.PageContants.accountPageTexts.boxTitle),true)
    this.actionLogger.warn('wait for usertable spiner gone')
    this.waitUntilUsersTableSpinerGone()
  }

  waitUntilUsersTableSpinerGone() {
    this.waitUnitlSpinnerGone()
    this.waitUnitlSpinnerGone(this._selUsers, true)
    this.waitUnitlSpinnerGone(this._selUsers.$('.fetch-result'),true)
  }
  waitUnitlUserFetchResultSpinnerGone() {
    this.waitUnitlSpinnerGone($('#content').$('.fetch-result'))
  }
  _waitTillBoxTitleHasText() {
    this.waitUnitlSpinnerGone()
    this.waitUntil(() => $(this._boxTitleSel).getText().trim().length > 0, true)
  }
  waitTilUpdateUserFormShow() {
    this._waitTilSiteMapContains(this.siteMapTexts.User)
    this._waitTillBoxTitleHasText()
    this.waitUntil(() => this._selForm.isDisplayed(), true)
    this.waitUntil(() => this.getValueAndTrim(this._selectAccountType).length > 0)
    this.waitUnitlUserFetchResultSpinnerGone()
  }
  waitInputToAccounts() {
    this.waitUnitlSpinnerGone()
    this._waitTilSiteMapContains(this.siteMapTexts.Account)
    this.waitUntilUsersTableSpinerGone()
    this.waitUnitlSpinnerGone(browser,true)
  }
  _toAccountAndClickByName(name) {
    this._toAccountAndWait()
    this.clickByUserName(name)
  }
  _toAccountAndWait() {
    this.toAccount()
    this.waitUntilUsersTableSpinerGone()  //tricky
  }
}

module.exports = AccountPage