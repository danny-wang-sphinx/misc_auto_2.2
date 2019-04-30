const commonUtil = require('../../lib/commonUtil')
const aspDapConfUtil = require('./subUtils/aspDapConfUtil')
const nginxConfUtil = require('./subUtils/nginxConfUtil')

const _curlRawData = commonUtil.curlRawData

const confFileMap = {
  'aspDapConf': '/etc/asp/release/conf_shared/asp_conf.json',
  'dapConf': '/etc/dap/conf/dyna.conf.json',
  'nginxConfGlobal': '/etc/asp/release/nginx/nginx.conf',
  'nginxConfPrefix': '/etc/asp/release/nginx/sites-enabled/',
  'ntp': '/etc/ntp.conf',
  'dns': '/etc/resolv.conf'
}

//high level
function getAspDapConfFileContent(relayServerUrl) {
  return _curlRawData(`${relayServerUrl}${confFileMap.aspDapConf}`).body
}
function getDapConfFileContent(relayServerUrl) {
  return _curlRawData(`${relayServerUrl}${confFileMap.dapConf}`).body
}
function getNginxConfFileContent(relayServerUrl,profile=undefined) {
  let serverKey = profile ? getServerKey(profile.fqdn,profile.port): undefined
  let nginxFilePath = serverKey ? `${confFileMap.nginxConfPrefix}/${serverKey}` : confFileMap.nginxConfGlobal
  return _curlRawData(`${relayServerUrl}${nginxFilePath}`).body
}
function getDnsFromFile(relayServerUrl) {
  let content = _curlRawData(`${relayServerUrl}${confFileMap.dns}`).body
  let lines = commonUtil.splitStringByNewline(content).filter((line) => line.startsWith('nameserver '))
  return lines.map((line) => line.split(' ')[1])
}
function getNtpFromFile(relayServerUrl) {
  let content = _curlRawData(`${relayServerUrl}${confFileMap.ntp}`).body
  let lines = commonUtil.splitStringByNewline(content).filter((line) => line.startsWith('server ') && line.endsWith(' perfer'))
  return lines.map((line) => line.split(' ')[1])
}

//asp dap conf get && extract
function getSupportPwd(relayServerUrl) {
  let dapConfJson = getDapConfFileContent(relayServerUrl)
  let obj = JSON.parse(dapConfJson)
  let support = obj.user.filter((val) => val['id']=='2')[0]
  if(support.isDefaultPwd) {
    let pwd = _getAspFileAndExtract(relayServerUrl,aspDapConfUtil.extractSupportPwd)
    return {isDefaultPwd:true, pwd}
  }
  console.warn('!!!!Support has changed default password')
  return {isDefaultPwd:false, pwd:''}
}
function getFPs(relayServerUrl) {
  return _getAspFileAndExtract(relayServerUrl,aspDapConfUtil.extractFPs)
}
function getCapcha(relayServerUrl) {
  return _getAspFileAndExtract(relayServerUrl,aspDapConfUtil.extractCapcha)
}
function getBackupDiskQuota(relayServerUrl) {
  return _getAspFileAndExtract(relayServerUrl,aspDapConfUtil.extractBackupDiskQuota)
}
function getFormatedLogOutput(relayServerUrl) {
  return _getAspFileAndExtract(relayServerUrl,aspDapConfUtil.extractFormatedLogOutput)
}
function getEsDiskQuota(relayServerUrl) {
  return _getAspFileAndExtract(relayServerUrl,aspDapConfUtil.extractEsDiskQuota)
}
function getOrigLogOutput(relayServerUrl) {
  return _getAspFileAndExtract(relayServerUrl,aspDapConfUtil.extractOrigLogOutput)
}
function getUserNames(relayServerUrl) {
  let dapConfContent = getDapConfFileContent(relayServerUrl)
  return aspDapConfUtil.extractUserNames(JSON.parse(dapConfContent))
}


// nginx conf get and extract
function getMaxUploadFileSzie(relayServerUrl) {
  return _getNginxFileAndExtract(relayServerUrl,undefined,nginxConfUtil.extractMaxUploadFileSzie)
}
function getServerKey(fqdn,port) {
  return `upstream_${fqdn}_${port}`
}
function getSrcIpFrom(relayServerUrl) {
  return _getNginxFileAndExtract(relayServerUrl,undefined, nginxConfUtil.extractSrcIPFrom)
}
function getBlockPageContent(relayServerUrl,profile) {
  let path = _getNginxFileAndExtract(relayServerUrl, profile, nginxConfUtil.extractBlockingPagePath)
  return _curlRawData(`${relayServerUrl}${path}`).body
}
function getSecurityLevel(relayServerUrl,profile) {
  return _getNginxFileAndExtract(relayServerUrl, profile, nginxConfUtil.extractSecurityLevel)
}
function getConsoleOpen(relayServerUrl,profile) {
  return _getNginxFileAndExtract(relayServerUrl, profile, nginxConfUtil.extractConsoleOpen)
}
function getBlockBrowser(relayServerUrl,profile) {
  return _getNginxFileAndExtract(relayServerUrl, profile, nginxConfUtil.extractBlockBrowser)
}
function getP3P(relayServerUrl,profile) {
  return _getNginxFileAndExtract(relayServerUrl, profile, nginxConfUtil.extractP3P)
}

function _getAspFileAndExtract(relayServerUrl,funcName) {
  let fileContent = getAspDapConfFileContent(relayServerUrl)
  let jsonObj = JSON.parse(fileContent)
  return funcName(jsonObj)
}
function _getNginxFileAndExtract(relayServerUrl,profile,funcName) {
  let fileContent = getNginxConfFileContent(relayServerUrl,profile)
  return funcName(fileContent)
}

// console.log(aspDapConfUtil.fpStringToSupportpwd('8d9e8de68b5ffae4d7d53c016df7cf020d3c69096cb25884d2321b5d3b93a150e8'))
// console.log(aspDapConfUtil.fpStringToSupportpwd('7d4bfa133ce4492e457e4b99128b8902d206f0fe4fb9ede71d5ff6b6cdd4c7702c'))

module.exports = {
  getAspDapConfFileContent, getDnsFromFile, getNginxConfFileContent, getNtpFromFile, getServerKey,
  getP3P,
  getBackupDiskQuota, getCapcha, getEsDiskQuota, getFormatedLogOutput, getFPs, getOrigLogOutput, 
  getSupportPwd, getUserNames,
  getBlockPageContent,getMaxUploadFileSzie,getSecurityLevel, getSrcIpFrom,getConsoleOpen, getBlockBrowser,
}