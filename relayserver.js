const child_process = require('child_process')
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
const aspConfCtrl = `/etc/asp/release/bin/asp_conf_ctrl`
const aspConfFile = '/etc/asp/release/conf_shared/asp_conf.json'

const mimeType = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json'
}

http.createServer((req, res) => {
  console.log(req.url, req.method)
  const parsedUrl = url.parse(req.url)
  const pathname = parsedUrl.pathname
  const query = parsedUrl.query

  if (pathname === '/aspconfctrl') {
    doAspConfCmd(query,res)
    return;
  } 
  if (req.method === 'HEAD') {
    fs.stat(pathname,(err,stats) => {
      err ? sendError(res) : res.end()
    })
  } else if (req.method === 'GET') {
    fs.readFile(pathname,'utf8',(err,data) => {
      if(err) {
        sendError(res)
      } else{
        const ext = path.parse(pathname)
        res.setHeader('Content-type', mimeType[ext] || 'text/plain')
        res.end(data)
      }
    })
  }
}).listen(9000)

function sendError(res) {
  res.statusCode = 500
  res.end('error:500')
}

function doAspConfCmd(aspCmd, res) {
  const fullCmd = `${aspConfCtrl} ${aspCmd}`
  console.log('fullcmd', fullCmd)
  child_process.exec(fullCmd, (err, stdout, stderr) => {
    if(!stdout.includes(`Done ${aspCmd}`)) sendError(res)
    aspCmd === 'set_factory_mode' ? res.end() : res.end(stdout)
  })
}

