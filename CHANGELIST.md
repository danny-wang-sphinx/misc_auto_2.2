# controlserver
1. Add: support error status code response
2. Enhance: More readable
# misc_auto
## Add
1. Error template case
1. waf rule Id case
1. Good bot
1. Session replay
1. Form encryption
1. IP based case: IP range
1. Wizard support if DAP already went throught Wizard
## Enhace
1. support provide browsername from command line rather than changing the config file. eg: BROWSER_NAME=firefox npm run all. If no env BROWSER_NAME provided, then will run specs on chrome.
1. seperate healthExamprofile from echoProfile.
1. refine the globalConf.json, reduce the duplication about echoProfile/healthExamProfile.
1. wdio.conf.dapbase.js change the default jasmine_interval time from 60s to 180s.
1. specUtil/profile.js unify the interface for getter and setter. 
```
  function set(data) {
    const name = defaultProfile.name
    profileUtil.autoTool(name,data) // setter
    uiStatus = profileUtil.autoTool(name) // getter
  }
  ```
1. refine the specs/profile.xxx.js, read the uiStatus after setting the status, so lower the possibility failure by racing condition.
```
  function set(data) {
    const name = defaultProfile.name
    profileUtil.autoTool(name,data) // setter
    uiStatus = profileUtil.autoTool(name) // getter
  }
  ```
1. specUtil/profile.js support customized options when setup profile. options supported: autoTool, waf,sessionReplay.
1. specUtil/profile.js replace domainPageToProfilePage with openPageAndToProfilePage, so the spec doesn't need care about domainPage, thus reduce dependcy on domainPage
1. add controlServerUtil, so the spec doesn't need care about url to start/stop echo server, and query logs.
