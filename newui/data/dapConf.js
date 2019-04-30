
const dapConf = require('../config/globalConf')
const controlServerIp = dapConf.controlServerIp
const dapServer = dapConf.dapServer

let defaultProfile = dapConf.defaultProfile
defaultProfile.protectedSite = `${defaultProfile.protocol}://${defaultProfile.fqdn}:${defaultProfile.port}`
dapConf['defaultProfile'] = defaultProfile

let httpsProfile = JSON.parse(JSON.stringify(defaultProfile))
httpsProfile.protocol = 'https'
httpsProfile.port = 443
httpsProfile.protectedSite = `${httpsProfile.protocol}://${httpsProfile.fqdn}:${httpsProfile.port}`
dapConf['httpsProfile'] = httpsProfile

let echoSrv1 = { "ip": controlServerIp, "port": "19002", "protocol": "http" }
let echoSrv2 = { "ip": controlServerIp, "port": "19003", "protocol": "http" }
let echoProfile = JSON.parse(JSON.stringify(defaultProfile))
echoProfile.upstreams = [echoSrv1]
dapConf['echoProfile'] = echoProfile

let healthExamProfile = JSON.parse(JSON.stringify(defaultProfile))
healthExamProfile.upstreams = [echoSrv1,echoSrv2]
dapConf['healthExamProfile'] = healthExamProfile

dapConf['logQueryServer'] = dapConf.controlServer
dapConf['relayServer'] = `${dapServer}:9000`
dapConf['webConsoleUrl'] = `https://${dapServer}:20145`
dapConf['wizardUrl'] = `http://${dapServer}:20146`

const controlServer = `${controlServerIp}:19001`
dapConf.controlServer = controlServer
dapConf.logQueryServer = controlServer
dapConf.logServerIp = controlServerIp

module.exports = dapConf