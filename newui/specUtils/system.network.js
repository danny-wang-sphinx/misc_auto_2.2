const commonUtil = require('./commonUtil')

function setDnss(page,...dnss) {
  page.toNetworkSettings()
  let currentDnsList = page.dnsLists()
  if(!commonUtil.arrayShowEqual(currentDnsList,dnss)) {
    page.actionLogger.warn('current dnslist is diff from expected',currentDnsList,dnss)
    page.deleteDnsAll()
    dnss.forEach((dns) => page.addDNS(dns))
    page.clickSave()
    page.actionLogger.warn('dns saved, add it',dnss)
    page.toAccount()
    page.toNetworkSettings()
  }
}
function setNtp(page,ntp) {
  page.toNetworkSettings()
  let currentNtp = page.getNtp()
  if(currentNtp != ntp) {
    page.actionLogger.warn('current ntp is diff from expected',currentNtp,ntp)
    page.setNtp(ntp)
    page.clickSave()
    page.toAccount()
    page.toNetworkSettings()
  }
}

module.exports = {
  setDnss,
  setNtp
}