const LogsOpsPage = require('../../pages/logs.operation')

describe('Operation log', () => {
  let page = new LogsOpsPage()
  beforeAll(() => page.open())

  beforeEach(() => { page.toOperationTab() })

  it('show data correctly', () => {
    let actual = page.opsLogs()
    expect(actual.length).toBeGreaterThan(0)
    expect(actual.every((val)=>val.length>0)).toBe(true)
  })
})