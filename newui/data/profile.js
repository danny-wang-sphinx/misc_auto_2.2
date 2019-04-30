const dapConf = require('./dapConf')

let defaultRequestHeaderValues = {
  acceptEncoding: { enable: true, value: '' },
  host: { enable: false, value: '$http_host' },
  xRealIp: { enable: true, value: '$remote_addr' },
  xff: { enable: true, value: '$proxy_add_x_forwarded_for' },
  wlProxyIp: { enable: true, value: '$remote_addr' }
}

let defaultResponseHeaderValues = {
  xFrame: { enable: false, value: 'SAMEORIGIN' },
  xContentType: { enable: false, value: 'nosniff' },
  xss: { enable: false, value: '1; mode=block' },
  p3p: { enable: false, value: 'NOI DSP PSAa OUR BUS IND ONL UNI COM NAV INT LOC' }
}
function _headerEnableDisable(map,status) {
  let res = {}
  Object.keys(map).forEach((key) => {
    res[key] =  { enable: status, value: map[key].value }
  })
  return res
}
function requestHeaderWithChangedValue() {
  //deep copy the object
  let res = JSON.parse(JSON.stringify(defaultRequestHeaderValues))
  res['acceptEncoding'].value = 'gzip'
  res['host'] = { enable: true, value: 'testfire.net' }
  return res
}
function responseHeaderWithChangedValue() {
  //deep copy the object
  let allEnableResponse = _headerEnableDisable(defaultResponseHeaderValues,true)
  let res = JSON.parse(JSON.stringify(allEnableResponse))
  res['xFrame'].value = 'DENY'
  res['xss'].value = '1'
  res['p3p'].value = 'IND'
  return res
}
let ipRange1 = {
  'ip':'50.55.172.224','netmask':'255.255.255.240',
  'type':'subnet',
  'inRange':'50.55.172.225','outRange': '50.55.172.240'
}
let ipRange2 = {
  'ip':'218.205.231.141','netmask':'255.255.255.0',
  'type':'subnet',
  'inRange':'218.205.231.10','outRange': '218.205.232.10'
}
module.exports = {
  allMethods: ['GET','POST','PUT','DELETE','OPTIONS','HEAD'],
  defaultMehtods: ['GET','POST','HEAD'],
  defaultProfile: dapConf.defaultProfile,
  defaultRequestHeaderValues,
  defaultResponseHeaderValues,
  echoProfile: dapConf.echoProfile,
  fakeIpOptions:`-H "X-REAL-IP: 1.2.3.4" -H "X-FORWARDED-FOR: 1.1.1.1, 2.2.2.2, 3.3.3.3"`,
  healthExamProfile: dapConf.healthExamProfile,
  httpsProfile: dapConf.httpsProfile,
  injectionQuery: 'text=print(md5(acunetix_wvs_security_test));$a',
  ipRange1,
  ipRange2,
  jsResource: '/a.js',
  nonWhiteList: '/abcnonwhitelist',
  requestHeaderAllDisbaled: _headerEnableDisable(defaultRequestHeaderValues,false),
  requestHeaderAllEnable: _headerEnableDisable(defaultRequestHeaderValues,true),
  requestHeaderWithChangedValue: requestHeaderWithChangedValue(),
  responseHeaderAllDisbaled: _headerEnableDisable(defaultResponseHeaderValues,false),
  responseHeaderAllEnable: _headerEnableDisable(defaultResponseHeaderValues,true),
  responseHeaderWithChangedValue: responseHeaderWithChangedValue(),
  testIp1: {'ip':'1.2.3.4','netmask':'255.255.255.255'},
  testIp2: {'ip':'5.6.7.7','netmask':'255.255.255.255'},
}
