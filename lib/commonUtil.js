const childProcess = require('child_process')
function arrayShallowEqual(arr1,arr2) {
  return arr1.length == arr2.length && !arr1.some((v)=>arr2.indexOf(v)<0)
}
function curlRawData(curlUrl, options='') {
  const returnCarr = '\r\n\r\n'
  const statusReg = RegExp(/HTTP\/.+\s([\d]{3})/, 'm')
  //Could have use http.request, but cannot control in sync way
  let cmd = `curl "${curlUrl}" -i ${options}`
  try {
    let rawData = childProcess.execSync(cmd,{encoding:'utf8',stdio:['pipe','pipe','ignore']})
    let index = rawData.indexOf(returnCarr) //FIXME: WINDOWS MIGHT DIFF
    let header = rawData.substring(0,index) 
    let body = rawData.substring(index+4,rawData.length) 
    let status = header.match(statusReg)[1] 
    return {status, header, body} 
  } catch (e) {
    let status = e.status || 'Error'
    let body = e.toString()
    let header = e.toString()
    return {status,header,body}
  }

}

function range(start,end,steps=1) {
  let len = Math.abs((start-end)/steps)
  let res = new Array(len).fill() 
  return res.map((_,i) => start+(i*steps)) 
}
let inRange = (val,start,end) => val>=start && val<end
let isAlphCharCode = (val) => inRange(val, 65,91) || inRange(val, 97,123) 
let isNumCharCode = (val) => inRange(val, 48, 58)
let random = (max) => Math.floor(Math.random()*(max))
let splitStringByNewline = (str) => str.split(/\r?\n/g)

module.exports = {
  arrayShallowEqual,
  inRange,
  range,
  curlRawData,
  isAlphCharCode,
  isNumCharCode,
  random,
  splitStringByNewline
}