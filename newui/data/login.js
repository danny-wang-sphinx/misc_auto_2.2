const gen = require('../../lib/alphanumgenator')
const pwdExcludeChars = ['#', '\\', '<', '>', '-', '"', '&']

exports.invalidUsername = gen.dataGenerator(seeds='abcAbc09',excludes=['_','-',' '])
exports.validAlphanum = gen.validAlphanum
exports.alphnumUnderscoreDash = gen.alphnumUnderscoreDash
exports.pwdWithOtherChars = gen.dataGenerator(seeds='Admin123',excludes=pwdExcludeChars.concat(' '))
exports.pwdExcludeTestCases = () => {
  let pwdExcludeTestCases = [], pwd= 'Admin123'
  pwdExcludeChars.forEach((val) => {
    pwdExcludeTestCases.push(pwd+val, val+pwd)
  })
  return pwdExcludeTestCases
}
exports.uiMsgTestData = [
  {'title':'username',username:'',pwd:'Admin123', errs:1},
  {'title':'pwd ',username:'admin', pwd:'', errs:1},
  {'title':'username and pwd',username:'',pwd:'', errs:2},
]