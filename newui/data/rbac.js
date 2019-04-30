const menuChekers = ['isDashboardVisible', 'isStaticVisible', 'isLogsVisible', 'isProtectionVisible', 'isAccountVisible',
  'isSystemVisible', 'isScheudleReportVisible'
]
const systemMenuChekers = ['isSystemSettingVisible', 'isSystemUpdateVisible', 'isNetworkSettingsVisible', 'isLicenseVisible',
  'isSSLCertificateVisbile'
]

const menuResult = {
  'Admin': _zipArrays(menuChekers, [true, true, true, true, true, true, true]),
  'Viewer': _zipArrays(menuChekers, [true, true, true, false, false, true, true]),
  'Support': _zipArrays(menuChekers, [true, true, true, true, false, true, true])
}

const systemMenuResult = {
  'Admin': _zipArrays(systemMenuChekers, [true, true, true, true, true]),
  'Viewer': _zipArrays(systemMenuChekers, [false, false, false, true, false]),
  'Support': _zipArrays(systemMenuChekers, [true, true, true, true, true])
}

function mergedResultFunc() {
  let roles = ['Admin','Viewer','Support']
  let res = []
  roles.forEach(role => {
    res[role] = Object.assign({},menuResult[role], systemMenuResult[role])
  })
  return res
}
function _zipArrays(keyArray, valArray) {
  let res = {}
  for (let i = 0; i < keyArray.length; i++) {
    res[keyArray[i]] = valArray[i]
  }
  return res
}

exports.menuChekers = menuChekers
exports.mergedResult = mergedResultFunc()
exports.systemMenuChekers = systemMenuChekers