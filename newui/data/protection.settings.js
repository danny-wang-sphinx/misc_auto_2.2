const errorStatusData = [
  {'400':true},
  {'500':true},
  {'400':false,'403':false,'404':false,'500':false,'502':false,'504':false},
  {'400':true,'403':true,'404':true,'500':true,'502':true,'504':true},
  {'400':true,'403':false,'404':false,'500':true,'502':true,'504':false},
]
module.exports = {
  allErrorIds:[400,403,404,500,502,504],
  defaultFileUploadSize: "50",
  errorStatusData,
  fakeIpOptions:`-H "X-REAL-IP: 1.2.3.4" -H "X-FORWARDED-FOR: 1.1.1.1, 2.2.2.2, 3.3.3.3"`,
  first: "first",
  goodbotIPOption:`-H "X-Real-IP:63.123.238.8"`,
  goodbotUAOption:`-A "Mozilla/2.0 (compatible; Ask Jeeves/Teoma)"`,
  last: "last",
  penultimate: "penultimate",
  xff: "X-Forwarded-For",
  xrealIp: "X-Real-IP",
}