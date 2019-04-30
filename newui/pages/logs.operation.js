const LogsBasePage = require('./logs')

class LogsOpsPage extends LogsBasePage{  

  opsLogs() {
    this.toOperationTab()
    return this.getParsedTableRowsValue(this._selCurrentTable)
  }
  
  open(username,pwd) {
    super.open(username,pwd)
    this.toLogs()
    this.toOperationTab()
  }
}

module.exports = LogsOpsPage