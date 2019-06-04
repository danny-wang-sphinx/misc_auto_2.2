
1. Put system.update.upgrade.js under misc_auto/newui/specs/webconsole

2. Put system.update.js under misc_auto/newui/pages

3. Put wdio.conf.upgrade.js under misc_auto/newui/config

3. Move the folder "fw" under misc_auto

4. Download DynaShield image and then put it under misc_auto/fw, currently it only supports the base image.
   For example. forceshield_prod_release_base_2.2.0.77.bin

5.Modify fw-config.json to set build number and do factory default or not after upgrading. 
  #cat fw-config.json
  {
    "build": "2.2.0.77",
    "setFactory": "yes"
  }

  Or you can also use the script inside /fw to modify it.
  #./change-build.sh 2.2.0.78 no
  #cat fw-config.json
  {
    "build": "2.2.0.78",
    "setFactory": "no"
  }

6. Add following lines in misc_auto/package.json
  "upgrade:clean": "./node_modules/.bin/rimraf newui/reports/upgrade",
  "upgrade:run": "./node_modules/.bin/wdio newui/config/wdio.conf.upgrade.js",
  "upgrade": "./node_modules/.bin/run-s upgrade:clean upgrade:run",

7. Execute #npm run upgrade
