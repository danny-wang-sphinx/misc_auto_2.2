const DomainPage = require('../pages/protection.domains')
const ProfilePage = require('../pages/profile')
const defaultProfile = require('../data/profile').defaultProfile
const admin = require('../data/accounts').admin

function deleteAllProfiles() {
  let page = new DomainPage()
  page.open()
  page.deleteAllProfiles()
}
function setupProfile(keepOld = false,profile=defaultProfile,options=undefined) {
  let page = new DomainPage()
  let profilePage = new ProfilePage()
  page.open()
  try {
    if(!keepOld) _deleteOldProfile(page,profile.name)
    if(page.isProfileExistByName(profile.name)) {
      _domainPageToProfile(page,profilePage,profile.name)
    } else {
      _createNewProfile(page,profilePage,profile)
    }
    if (options && options !== {}) _handleProfileOptions(profilePage,options)
    profilePage.clickSave()
  } catch (error) {
    page.actionLogger.error('setupProfile error:' ,error)
  }
}

function autoTool(profileName,data=undefined,username=admin.username,pwd=admin.pwd) {
  return _openProfilePageAndGetterSetter(profileName,'AutoTool',data,username,pwd)
}
function consoleMonitor(profileName,status=undefined,username=admin.username,pwd=admin.pwd) {
  return _openProfilePageAndGetterSetter(profileName,'Console',status,username,pwd)
}
function crack(profileName,status=undefined,username=admin.username,pwd=admin.pwd) {
  return _openProfilePageAndGetterSetter(profileName,'Crack',status,username,pwd)
}
function entry(profileName,data=undefined,username=admin.username,pwd=admin.pwd) {
  return _openProfilePageAndGetterSetter(profileName,'Entry',data,username,pwd)
}
function formEncryptEss(profileName,data=undefined,username=admin.username,pwd=admin.pwd) {
  return _openProfilePageAndGetterSetter(profileName,'FormEncryptEss',data,username,pwd)
}
function healthExam(profileName,data=undefined,username=admin.username,pwd=admin.pwd) {
  return _openProfilePageAndGetterSetter(profileName,'HealthExam',data,username,pwd)
}
function invalidAction(profileName,mode=undefined,username=admin.username,pwd=admin.pwd) {
  return _openProfilePageAndGetterSetter(profileName,'InvalidAction',mode,username,pwd)
}
function noScript(profileName,mode=undefined,username=admin.username,pwd=admin.pwd) {
  return _openProfilePageAndGetterSetter(profileName,'NoScript',mode,username,pwd)
}
function protectionMode(profileName,mode=undefined,username=admin.username,pwd=admin.pwd) {
  return _openProfilePageAndGetterSetter(profileName,'ProtectionMode',mode,username,pwd)
}
function sessionReplay(profileName,enabled=undefined,username=admin.username,pwd=admin.pwd) {
  return _openProfilePageAndGetterSetter(profileName,'SessionReplay',enabled,username,pwd)
}
function waf(profileName,status=undefined,username=admin.username,pwd=admin.pwd) {
  return _openProfilePageAndGetterSetter(profileName,'Waf',status,username,pwd)
}
function webProtection(profileName,data=undefined,username=admin.username,pwd=admin.pwd) {
  return _openProfilePageAndGetterSetter(profileName,'WebProtection',data,username,pwd)
}
function portOffset(profileName,data=undefined,username=admin.username,pwd=admin.pwd) {
  openPageAndToProfilePage(profileName,username,pwd)
  let profilePage = new ProfilePage(),currentPort
  let currentStatus = profilePage.getPortOffsetToggleStatus()
  if (currentStatus) currentPort = profilePage.getOffsetPort()

  if (data === undefined) return {enabled:currentStatus,port:currentPort}
  
  let needSave = false, enabled = data.enabled, port = data.port
  if(currentStatus!=enabled) {
    needSave = true
    profilePage.actionLogger.warn('current port offset diff', enabled)
    profilePage.toggleOffset(enabled)
  }
  if (enabled && currentPort != port) {
    needSave = true
    profilePage.actionLogger.warn('current port offset diff', port)
    profilePage.setOffsetPort(port)
  }
  if(needSave) {
    profilePage.clickSave()
    profilePage.actionLogger.warn('save data success')
  }
}
function isGetonlyByInfo(info) {
  return info[2] == 'checked'
}
function ipBased(profileName,data=undefined,username=admin.username,pwd=admin.pwd) {
  openPageAndToProfilePage(profileName,username,pwd)
  let profilePage = new ProfilePage(),mode
  let currentMode = profilePage.getIPBasedMode()
  let currentList = profilePage.getIPList(currentMode)
  if (data === undefined) {
    return {mode:currentMode,ipList:currentList}
  }

  //To simplfy, don't compare, just delete all then set 
  if (data.mode !== undefined) {
    mode = data.mode
    profilePage.selectIPBasedMode(mode)
  } else {
    mode = currentMode
  }
  profilePage.deleteIPListAll()
  data.ipList.forEach((ip) => {
    profilePage.clickAddIPList(mode)
    profilePage.enterIPList(ip.ip, ip.netmask,ip.type)
  })
  profilePage.clickSave()
}
function setRequestWhiteList(profileName,whitelist,username=admin.username,pwd=admin.pwd) {
  openPageAndToProfilePage(profileName,username,pwd)
  let profilePage = new ProfilePage()
  profilePage.deleteRequestListAll()
  whitelist.forEach((val) => {
    profilePage.clickAddNewRequestList()
    profilePage.actionLogger.warn('add wt',val)
    profilePage.enterRequestList(val.whitelist,val.note,val.getOnly)
  })
  profilePage.clickSave()
}
function setRequestAndResponseHeader(profileName,reqHeaderObj=undefined,resHeaderObj=undefined,username=admin.username,pwd=admin.pwd) {
  openPageAndToProfilePage(profileName,username,pwd)
  let profilePage = new ProfilePage()
  if(reqHeaderObj) {
    profilePage.actionLogger.warn('set request header to ',reqHeaderObj)
    _setReqFromObj(profilePage,reqHeaderObj)
  }
  if(resHeaderObj) {
    profilePage.actionLogger.warn('set response header to ',resHeaderObj)
    _setResFromObj(profilePage,resHeaderObj)
  }
  profilePage.clickSave()
}
function setResponseWhteList(profilePage,whitelist) {
  profilePage.deleteResponseListAll()
  whitelist.forEach((val) => {
    profilePage.clickAddNewResponseList()
    profilePage.actionLogger.warn('add wt',val)
    profilePage.enterResponseList(val.whitelist,val.note)
  })
  profilePage.clickSave()
}
function openPageAndToProfilePage(profileName,username=admin.username,pwd=admin.pwd) {
  let domainPage = new DomainPage()
  let profilePage = new ProfilePage()
  domainPage.open(username, pwd)
  _domainPageToProfile(domainPage,profilePage,profileName)
}
function browserBlock(profileName,data=undefined,username=admin.username,pwd=admin.pwd) {
  openPageAndToProfilePage(profileName,username,pwd)
  let profilePage = new ProfilePage()
  let currentBrowserStatus = profilePage.getBlockBrowserValue()
  let currentWebviewStatus = profilePage.getBlockWebviewValue()

  if (data === undefined) {
    return {'browserStatus':currentBrowserStatus,'webviewStatus':currentWebviewStatus}
  }

  let needSave = false
  let browserStatus = data.browserStatus, webviewStatus = data.webviewStatus
  if(browserStatus !== undefined && currentBrowserStatus != browserStatus) {
    profilePage.actionLogger.warn('block browser status idff', browserStatus)
    needSave = true
    profilePage.setBlockBrowser(browserStatus)
  }
  if(webviewStatus !== undefined && currentWebviewStatus != webviewStatus) {
    profilePage.actionLogger.warn('block webview status idff', webviewStatus)
    needSave = true
    profilePage.setBlockWebview(webviewStatus)
  }
  if(needSave) {
    profilePage.actionLogger.warn('save browser block',browserStatus,webviewStatus)
    profilePage.clickSave()
    profilePage.actionLogger.warn('saved browser status',browserStatus, webviewStatus)
  } 
}
function _openProfilePageAndGetterSetter(profileName,key,data=undefined,username=admin.username,pwd=admin.pwd) {
  openPageAndToProfilePage(profileName,username,pwd)
  return _getOrSet(key,data)
}
function _getOrSet(key,data) {
  // Naming convention
  let getterFuncName = `get${key}Value`, setterFuncName = `set${key}`
  let profilePage = new ProfilePage()
  let currentVal = profilePage[getterFuncName]()
  if (data === undefined) {
    return currentVal
  } else if(profilePage[getterFuncName]() != data) {
    profilePage.actionLogger.warn('current data diff', data)
    profilePage[setterFuncName](data)
    profilePage.actionLogger.warn('set to', data)
    profilePage.clickSave()
    profilePage.actionLogger.warn('save data success')
  }
}
function _setReqFromObj(profilePage,obj) {
  Object.keys(obj).forEach((key) => {
    const enable = obj[key].enable
    const value = obj[key].value
    profilePage.actionLogger.warn('set req header',key,enable,value)
    profilePage.enterRequestHeader(key,enable,value)
  })
}
function _setResFromObj(profilePage,obj) {
  Object.keys(obj).forEach((key) => {
    const enable = obj[key].enable
    const value = obj[key].value
    profilePage.actionLogger.warn('set req header',key,enable,value)
    profilePage.enterResponseHeader(key,enable,value)
  })
}
function _deleteOldProfile(domainPage,profileName) {
  domainPage.actionLogger.warn('old profile exist, delete it')
  domainPage.deleteProfileByName(profileName)
  domainPage.waitTilDomainTableResultLoaded()
  domainPage.actionLogger.warn('old profile delete, done')
}
function _createNewProfile(domainPage,profilePage,profile) {
  domainPage.actionLogger.warn('profile not exist, create')
  domainPage.clickAddNew()
  profilePage.waitTilProfilePageLoaded()
  profilePage.enterProfileName(profile.name)
  profilePage.setDomain(profile.fqdn,profile.protocol,profile.port)
  if(profile.protocol == 'https') {
    profilePage.setSSL()
  }
  profile.upstreams.forEach((upstream) => {
    profilePage.clickAddUpstream()
    profilePage.enterUpstream(true, upstream.protocol, upstream.ip, upstream.port)
  })
}
function _handleProfileOptions(profilePage,options) {
  if (options.hasOwnProperty('waf'))  profilePage.setWaf(options['waf'])
  if (options.hasOwnProperty('autoTool'))  profilePage.setAutoTool(options['autoTool'])
  if (options.hasOwnProperty('sessionReplay'))  profilePage.setAutoTool(options['sessionReplay'])
}
function _domainPageToProfile(domainPage, profilePage, profileName) {
  domainPage.actionLogger.warn('todomain tab clicked',profileName)
  domainPage.clickByProfileName(profileName)
  domainPage.actionLogger.warn('profilename clicked',profileName)
  profilePage.waitTilProfilePageLoaded()
  domainPage.actionLogger.warn('profilepage open')
}
module.exports = {
  // Getter and Setter Function
  autoTool, 
  browserBlock,
  consoleMonitor,
  crack, 
  entry, 
  formEncryptEss,
  healthExam,
  invalidAction,
  ipBased,
  noScript,
  portOffset,
  protectionMode,
  sessionReplay,
  setRequestAndResponseHeader,
  setRequestWhiteList,
  setResponseWhteList,
  setupProfile,
  waf,
  webProtection, 

  // common utils
  deleteAllProfiles,openPageAndToProfilePage,
  
  // Validator
  isGetonlyByInfo,
  
}
