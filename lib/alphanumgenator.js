const commonUtil = require('./commonUtil')

const validAlphanum = [
  'abcAbc09', 'Abc09abc', '09Abcabc'
]
const alphnumUnderscoreDash = [
  '-abcA09', 'ab-cA09', 'abcA09-',
  '_abcA09', 'ab_cA09', 'abcA09_',
  '_-abcA09', '-_ab-cA09', 'abcA09-_'
]
function dataGenerator(seeds='abcAbc09',excludes=['_','-']){
  let res = []
  let symobols = symbolGenerator(excludes)
  let prefix = seeds[0]
  let postfix = seeds.substring(1)
  symobols.forEach((val) => {
    let ch = String.fromCharCode(val)
    res.push(`${ch}${seeds}`)
    res.push(`${seeds}${ch}`)
    res.push(`${prefix}${ch}${postfix}`)
  })
  return res
}

function symbolGenerator(excludes=['_','-']) {
  let excludeCharCodes = excludes.map((ch) => ch.charCodeAt(0)) 
  let res = commonUtil.range(32,126,1).filter((val) => {
    return !commonUtil.isAlphCharCode(val) && !commonUtil.isNumCharCode(val) && !excludeCharCodes.includes(val)
  })
  return res
}

module.exports = {
  validAlphanum,
  alphnumUnderscoreDash,
  dataGenerator
}