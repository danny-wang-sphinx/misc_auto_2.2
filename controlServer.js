const net = require('net')
const dgram = require('dgram')
const http = require('http')
const url = require('url')
// ~2KB/parsedLog. sometimes we use curl to retrieve the raw/parsed logs
// childprocess has limited buffer size, default 200K. so we set the array 
// maxsize 20, to make sure it is under 200KB
const MAXLENGTH = 20
let rawLogs = new Array(MAXLENGTH), rawIndex
let parsedLogs = new Array(MAXLENGTH),parsedIndex
const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <a href='/'>ToMainPage</a>
  <p>Received raw headers</p>
  <pre>{{ extra }}</pre>
  <form id="form1" action="/" method="post">
    <input type="text" name="abc">
    <input type="submit">
  </form>
  <pre id="result"></pre>
</body>
<script>
(function log_debug() { 
  document.querySelector('#result').innerHTML = '<p>hello</p>'
})();
</script>
</html>`

/* start servers */
resetLogArrays()
const tcpServer1 = net.createServer(tcpServerListener)
const udpServer1 = dgram.createSocket('udp4')
const controlServer = http.createServer(controlServerRequestListener)
const echoServer1 = http.createServer(echoServerCb)
const echoServer2 = http.createServer(echoServerCb)
const echoServerObj1 = {name:'echoServer1',port:19002, obj:echoServer1}
const echoServerObj2 = {name:'echoServer2',port:19003, obj:echoServer2}
udpServer1.on('message', (data) => {
  let dataString = data.toString()
  logServerParseLogs('udp:' + dataString)
})
echoServer1.on('close', ()=>console.log('close server1'))
echoServer2.on('close', ()=>console.log('close server2'))
echoServer1.on('listening', ()=>console.log(`http echo server listen on ${echoServerObj1.port}`))
echoServer2.on('listening', ()=>console.log(`http echo server listen on ${echoServerObj2.port}`))

tcpServer1.listen(514, () => console.log('tcp listen on 514'))
udpServer1.bind(514, () => console.log('udp bind on 514'))
controlServer.listen(19001,() => console.log('http control listen on 19001'))
echoServer1.listen(echoServerObj1.port)
echoServer2.listen(echoServerObj2.port)

function echoServerCb(req,res) {
  console.log(req.url,req.method)
  const parsedUrl = url.parse(req.url,true)
  const query = parsedUrl.query
  const pathName = parsedUrl.pathname
  if (pathName.startsWith('/favicon.ico')) {
    return204(res)
    return;
  }
  res.setHeader('Content-Type','text/html; charset=utf-8')
  let headers = _handleHeaders()
  if (req.method === 'POST') {
    let body = ''
    req.on('data',chunk => body += chunk.toString())
    req.on('end',() => {
      headers['bodyText'] = body
      _sendResponse()
    })
  } else {
    _sendResponse()
  }

  function _sendResponse() {
    res.end(htmlTemplate.replace('{{ extra }}',JSON.stringify(headers,null,2)))
  }

  function _handleHeaders() {
    let headers = {};
    for (let i = 0; i < req.rawHeaders.length; i = i + 2) {
      headers[req.rawHeaders[i]] = req.rawHeaders[i + 1];
    }
    const returnCode = query['returnCode'] || 200;
    headers['returnCode'] = returnCode;
    res.statusCode = returnCode;
    return headers;
  }
}
function return204(res) {
  res.statusCode = 204
  res.end()
}

function controlServerProcessCommand(query) {
  if (query.stop) {
    let targetServer = controlServerCalculateServer(query.stop)
    console.log('stop server', targetServer.name)
    targetServer.obj.close()
  } else if (query.start) {
    let targetServer = controlServerCalculateServer(query.start)
    if (!targetServer.obj.listening) {
      console.log('start', targetServer.name)
      targetServer.obj.listen(targetServer.port)
    } else {
      console.log('already bind, ingore', targetServer.name)
    }
  }
}

function controlServerCalculateServer(val) {
  if (val == 'server1') {
    return echoServerObj1
  } else if (val = 'server2') {
    return echoServerObj2
  }
}

function sendLogQueryResult(logArray,res) {
  let logs = logArray.filter((log)=>log != undefined)
  res.end(logs.toString())
}

function logServerParseLogs(dataString) {
  let idx
  if((idx=dataString.indexOf('ParsedAccessLog:')) > -1) {
    parsedLogs.splice(parsedIndex,1,dataString)
    parsedIndex = (parsedIndex+1)%MAXLENGTH
  } else if((idx=dataString.indexOf('nginxAccess:')) > -1) {
    rawLogs.splice(rawIndex,1,dataString)
    rawIndex = (rawIndex+1)%MAXLENGTH
  }
}
function resetLogArrays() {
  rawLogs.fill(undefined)
  parsedLogs.fill(undefined)
  rawIndex = 0
  parsedIndex = 0
}

function controlServerRequestListener(req,res) {
  let parsedUrl = url.parse(req.url, true)
  let pathName = parsedUrl.pathname, query = parsedUrl.query
  if(pathName == '/rawLogs') {
    sendLogQueryResult(rawLogs,res)
  } else if (pathName == '/parsedLogs') {
    sendLogQueryResult(parsedLogs,res)
  } else if (pathName == '/clearLogs') {
    resetLogArrays()
    return204(res)
  } else if(pathName == '/command') {
    controlServerProcessCommand(query)
    return204(res)
  }
}

function tcpServerListener(conn) {
  conn.setEncoding('utf-8')
  conn.on('data', (data) => {
    logServerParseLogs('tcp:'+data)
  })
}