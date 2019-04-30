
const profileUtil = require('./profile')
const commonUtil = require('./commonUtil')
const profileData = require('../data/profile')

function isAddWhitelistBtnShowByInfo(info) {
  return info[info.length-1].length>0
}
function setUpWafAndWaitTillLogShow(logPage,nonWhiteListUrl,injectUrl,profile=profileData.defaultProfile) {
  profileUtil.setupProfile(false,profile,{waf:true})
  logPage.toLogs()
  commonUtil.curlResource(profile.protectedSite,nonWhiteListUrl)
  commonUtil.curlResource(profile.protectedSite, injectUrl, profileData.injectionQuery)
  logPage.keepSearchTillTableContain(nonWhiteListUrl)
  logPage.keepSearchTillTableContain(injectUrl)
}

module.exports = {
  isAddWhitelistBtnShowByInfo,
  setUpWafAndWaitTillLogShow
}