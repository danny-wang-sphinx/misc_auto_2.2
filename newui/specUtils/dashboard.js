
function isDeleteBtnShowByInfo(info) {
  return info[info.length-1].length>0
}
function testClickSeeMore(page,username,pwd) {
  page.open(username,pwd)
  page.clickSeeMore()
  expect(page.getSiteMap()).toContain(page.siteMapTexts.Statistics)
}
function testClickNodeIP(page,username,pwd,ip) {
  page.open(username,pwd)
  page.clickByNodeIP(ip)
  expect(page.getSiteMap()).toBe(page.siteMapTexts.Statistics)
}
function testClickProtectionLink(page,username,pwd) {
  page.open(username,pwd)
  page.clickProtectionLink()
  expect(page.getSiteMap()).toContain(page.siteMapTexts.Protection)
}
function testClickProfileName(page,username,pwd,profileName) {
  page.open(username,pwd)
  page.clickByProfileName(profileName)
  expect(page.getSiteMap()).toBe(page.siteMapTexts.ProtectionProfile)
}

module.exports = {
  isDeleteBtnShowByInfo,
  testClickSeeMore,
  testClickNodeIP,
  testClickProtectionLink,
  testClickProfileName,
}
