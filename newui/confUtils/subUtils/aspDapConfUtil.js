const diff = require('deep-diff')

const keyPathMap = {
  'license': ['cluster','license', '_value'],
  'backupDiskQuota': ['rsyslog','logrotate','disk_size','_value'],
  'captcha': ['captcha','_value'],
  'currentFingerprint': ['cluster','fingerprint', '_value'],
  'esDiskQuota': ['rotate_es','max_access_log_index_size','_value'],
  'origLogOutput': ['logserver','export'],
  'formatedLogOutput': ['logserver','parsedlog_export'],
}

function diffAspJsonContent(oldJson,newJson,ignoreBackendUIConf=true) {
  let oldObj = JSON.parse(oldJson)
  let newObj = JSON.parse(newJson)
  if (ignoreBackendUIConf) {
    return diff(oldObj, newObj, (path,key) => path.length === 0 && ~['dap_backend_ui'].indexOf(key))
  } else {
    return diff(oldObj,newObj)
  }
}

function extractBackupDiskQuota(parsedJson) {
  return _getByKey(parsedJson,'backupDiskQuota')
}
function extractCapcha(parsedJson) {
  return _getByKey(parsedJson,'captcha')
}
function extractEsDiskQuota(parsedJson) {
  return _getByKey(parsedJson,'esDiskQuota')
}
function extractFormatedLogOutput(parsedJson) {
  let val = _getByKey(parsedJson,'formatedLogOutput')
  return {
    'type': val.type._value,
    'address': val.address._value,
    'enabled':val.enabled._value,
    'port':val.port._value,
    'proto': val.proto._value
  }
}
function extractActivateFP(parsedJson) {
  let license = _getByKey(parsedJson, 'license')
  let activatedFP = license.match(/:finger_print=([a-zA-Z0-9_]+):/)[1]
  return activatedFP
}
function extractFPs(parsedJson) {
  let current = _getByKey(parsedJson, 'currentFingerprint')
  let activated = extractActivateFP(parsedJson)
  return {
    'activated_finger_print': activated,
    'current_finger_print': current
  }
}
function extractOrigLogOutput(parsedJson) {
  let val = _getByKey(parsedJson,'origLogOutput')
  return {
    'address': val.address._value,
    'enabled':val.enabled._value,
    'port':val.port._value,
    'proto': val.proto._value
  }
}
function extractSupportPwd(parsedJson) {
  let fps = extractFPs(parsedJson)
  let actFp = fps.activated_finger_print
  let curFp = fps.current_finger_print
  let useFp = (actFp == 'evaluation_only') ? curFp : actFp
  return fpStringToSupportpwd(useFp)
}
function fpStringToSupportpwd(fp) {
  if (fp.length <= 16) throw new Error('short fp')
  let res = ''
  for(let end = fp.length -1, start = fp.length -17; end > start; end = end-2) res += fp[end]
  return res
}
//DAP conf file
function extractUsersNameFromDapFile(parsedJson) {
  let users = parsedJson.user
  let res = []
  users.forEach((user) => res.push(user.name))
  return res
}

function _getByKey(data,key) {
  return _getPathValue(data,keyPathMap[key])
}

function _getPathValue(data,path) {
  if(path.length == 0) {
    return data
  }
  let firstPath = path.shift()
  return _getPathValue(data[firstPath],path)
}

module.exports = {
  diffAspJsonContent,
  extractBackupDiskQuota,
  extractCapcha,
  extractEsDiskQuota,
  extractFormatedLogOutput,
  extractFPs,
  extractOrigLogOutput,
  extractSupportPwd,
  extractUserNames: extractUsersNameFromDapFile,
  fpStringToSupportpwd,
}