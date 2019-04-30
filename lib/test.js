let util = require('./commonUtil')
try {
  let res = util.curlRawData('http://a.com/')
  console.log(res)
} catch (e) {
  console.log(e)
}

