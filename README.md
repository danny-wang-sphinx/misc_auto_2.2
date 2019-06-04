# Introduction
基于webdriverio 5.x + Jasmine实现对new webconsole的测试用例。用例实现基于pageobject风格，以达到当page变更时，仅需要更改page.js而无须更改spec.js,以达到最小化变动。
# Feature
- 多浏览器支持
- 当用例失败，自动获取以及保存以下信息，存放于reports中，以便用allure report可视化呈现: browser screenshot, browser current url, case test error and trace, page source
- 通过logger将page action logger,Jasmine logger集中存放于同一个文件中wdio-x-y.log，以便错误排查。
# Limitation
- upstream servers >1 && port!=443, when add second upstream, the port of first upstream will be reverted to 443. DAP BUG. 
- system settings -> logs page, cannot change port number
- cannot upload file: customized ssl
# Folder Structure
```
├── README.md
├── lib
│   ├── commonUtil.js #其它通用，当前仅使用到curl
│   └── wdioUtils.js #selenium通用
├── newui #new webconsole test project
│   ├── config #wdio针对dynaShield相关配置, ** 仅需修改此目录下的globalConf.json内容 **
│   ├── confUtils #confUtils: aspDapConfUtil,由于最终使用为asp_conf.json，故提供该文件一个通用方法，后续若换为dap.conf.json,仅需修改aspDapConfUtil文件，无需修改specs，保存接口不变.
│   ├── constants #ui相关的字串常量(pages以及specs)会使用到，以便后续i18n替换
│   ├── data #specs/pages使用，参考指导规则
│   ├── pages #pageObject,供specs使用
│   ├── preparation #分为:1.[wizard](wizard).2.根据globalConf，对DAP进行必要的准备工作[Preparation](#preparation)，减少specs对环境的依赖
│   ├── reports
│   ├── specUtils #specs helper，当多个specs文件共用同一个方法时使用
│   ├── specs #test cases
│   ├── utils #DEPENDENCY: RELAYSERVER。
│   └── wizardSpec #wizard相关测试用例，暂无价值实现。可自行参照preparation/wizard的方式自行实现
├── package.json
├── testfire #testfire consistency check test project
│   ├── pages
│   ├── specUtil.js
│   ├── specs
│   ├── wdio.conf.base.js
│   ├── wdio.conf.domain.js
│   └── wdio.conf.ip.js
├── testweb #testweb test project
│   ├── consistencySpecs
│   ├── pages
│   ├── reports
│   ├── specUtils
│   └── wdio.conf.js
├── wdio.conf.js #wdio top level配置，仅webconsole test project以及testweb/testfire继承

```
# System Requirements
## 命名约定: 
- 脚本运行机器: host test script以及发起test script的机器
- Webdriver Hub & Webdriver Node: 由Hub管理以及分发，实际browser 运行于Node所在机器
- Relay Server: 运行于DAP Server的一个进程，负责读取本地config,执行asp_conf相关命令，读取本地文件。在Utils中大量使用
- Control Server: 运行于任意有Node.js环境的机器，须与脚本运行机器以及DAP server网络相通。其主要功能: 
1. Log output server： TCP AND UDP ON 514
2. Log output result query server: HTTP ON 19001
3. Upstream echoserver1&2 :HTTP ON 19002 & 19003, to test HealthCheck function
4. Upstream echoserver1&2: echo request header received from DAP, to test request and response hader configuration cases
5. Control Server: HTTP on 19001, listen to command to start/stop upstream echoserver.
## 运行环境
- 脚本运行机器: NodeJS 10+, curl
- Webdriver Hub: Java, Selenium server 3.141.59(实测)
- Webdriver Node: 浏览器，curl, Java, Selenium server 3.141.59(实测)，浏览器所需driver:chromedriver/Edge/IEWebDriver/GeckoDriver [下载连接](https://www.seleniumhq.org/download/)
- Relay Server: 无(由于DynaShield ova自带NodeJS，无依赖)
- Control Server: NodeJS
## 运行环境补充
- Webdriver Hub与Webdriver Node可运行于同一台机器
- 脚本运行机器可与Webdriver Hub以及Webdriver Node运行于同一台机器
# Install
- 根据运行环境以及运行环境补充，进行下载与安装
- 脚本运行机器
```
cd /path/to/misc_auto
npm i
```
- scp relayserver.js to DAP server
- Webdriver Node: 将对应的driver加入path 
1. IE要做一些必要设置，参考[Required Configruation](https://github.com/SeleniumHQ/selenium/wiki/InternetExplorerDriver#required-configuration)
2. Safari需打开Allow remote Automation [Saari Driver for Safari 10](https://webkit.org/blog/6900/webdriver-support-in-safari-10/)
- Windows: 将cURL加入PATH
# Setup
- Webdriver Hub: 启动hub: 
```
java -jar 
selenium-server-standalone-3.x.jar -role hub -host 192.168.254.27 (注:最好指定所绑定的host,不指定的话有可能有惊喜哦)
```
- Webdriver Node: 加入Hub
```
java -jar selenium-server-standalone-3.1x.0.jar -role node -hub http://192.168.254.27:4444
```
- Webdriver Node: 修改/etc/hosts文件：根据globalConf文件中指定的defaultProfile的website修改，以使该机器执行用例时找到对应的host

- Relay Server: 运行relayserver进程
```
node path/to/relayserver.js
```
- Control Server
```
node path/to/controlserver.js
```
# 运行
## 按需修改config/globalConf.json文件内容
***以下步骤均于脚本运行机，且约定cwd为:/path/to/misc_auto***
## execute cases
### scriptTable
scriptName | Description| specsFolder | reportFolder |  
--- | --- | --- | --- | ---
all | webconsole and protection functional testing | specs/webconsole & specs/protection | reports/all | 
prep | setup accounts and default profile | preparation/setup*.js | reports/prep  | 
ui | pure front end validation cases | specs/ui | reports/ui  | 
wi | wizard: quick deploy mode | preparation/wizard | reports/wizard  | 
执行以下命令，完成用例集测试
```
npm run scriptName (Note:将scriptName替换为需要测试的用例集)
```
# Report
- 根据[scriptTable](#scriptTable)找到reportFolder
- 运行以下命令查看allurereport
```
npm run serve reportFolder (Note:将reportFolder替换为需要测试的用例集,Windows: path/to/node_modules/.bin/allure serve path/to/report/folder)
```
- 需要更多日志? open reportFolder/wdio-x-y.log
# Developement
- 基于pageObject原则，尽量将page相关内容与specs隔离
- 单一source原则，即:dapConf仅与globalConf通信，data仅与dapConf通信，page/specs/specUtil/utils仅与data打交道，不跳跃通信
- data里面存放内容:
1. globalConf 指定的数据,如network
2. 根据globalConf，由dapConf计算出的testdata, 如profile
1. 通过function自动generate testdata(如：login)；
1. DAP default value, 如system.settings
