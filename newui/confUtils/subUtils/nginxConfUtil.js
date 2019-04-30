const commonUtil = require('../../../lib/commonUtil')

function extractMaxUploadFileSzie(fileContent) {
  return _extractItem(fileContent,'client_max_body_size')
}
function extractSrcIPFrom(fileContent) {
  let srcIPFrom = _extractItem(fileContent,'txsafe_real_ip_header')
  let xffPostion = _extractItem(fileContent, 'txsafe_xff_position')
  return {srcIPFrom, xffPostion}
}
function extract400Path(fileContent) {
  return _extractErrorAndBlockPagePath(fileContent,'err_400.html')
}
function extractBlockBrowser(fileContent) {
  return _extractItem(fileContent,'txsafe_block_browser')
}
function extractBlockingPagePath(fileContent) {
  return _extractErrorAndBlockPagePath(fileContent,'blocking_page.html')
}
function extractSecurityLevel(fileContent) {
  let minLevel = _extractItem(fileContent,'txsafe_security_level_min')
  let maxLevel = _extractItem(fileContent,'txsafe_security_level_max')
  return {minLevel, maxLevel}
}
function extractConsoleOpen(fileContent) {
  return _extractItem(fileContent,'txsafe_check_console_open')
}
function _extractErrorAndBlockPagePath(fileContent,key) {
  let str = fileContent.substring(fileContent.indexOf(`location /${key}`)) 
  str = str.substring(str.indexOf('root '),str.indexOf('internal;')) 
  let dirName = _extractItem(str,'root')
  return dirName + key
}
function extractP3P(fileContent) {
  let header = _extractItem(fileContent,'txsafe_p3p_header')
  let rawValue = _extractItem(fileContent,'txsafe_p3p_header_value')
  let startIdx = rawValue[0].indexOf('policyref')
  let endIdx = rawValue[0].lastIndexOf(',')
  let policyref = rawValue[0].substring(startIdx, endIdx)
  let cp = rawValue.slice(1).join(' ')
  endIdx = cp.lastIndexOf("'") /* ? */
  let CP = cp.substring(0,endIdx) 
  let headerValue = {policyref,CP}
  return { header, headerValue }
}

function _extractItem(fileContent, key, trimLastChar=';') {
  let lines = commonUtil.splitStringByNewline(fileContent)
  let filterLines = lines.filter((line) => line.trim().startsWith(key+' '))
  let res = filterLines.map((line) => {
    line = line.trim()
    line = (trimLastChar && line.endsWith(trimLastChar)) ? line.substring(0, line.length-1) : line
    let sections = line.split(' ').filter((val) => val.length > 0) 
    return sections.slice(1)
  })
  //Beautify the result
  let toFlat = res.length == 1 ? res[0] :res
  return (toFlat.length == 1 ? toFlat[0] : toFlat)
}



module.exports = {
  extract400Path,
  extractBlockBrowser,
  extractBlockingPagePath,
  extractConsoleOpen,
  extractMaxUploadFileSzie,
  extractP3P,
  extractSecurityLevel,
  extractSrcIPFrom,
}