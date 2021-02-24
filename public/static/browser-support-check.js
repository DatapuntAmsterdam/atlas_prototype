var noSupportPath = '/no-support/'
var onNoSupportPath = location.pathname === noSupportPath
var isSupported = checkIfSupported()
var returnPath = getParam('returnPath')

// Go back to the site if the browser is supported.
if (onNoSupportPath && isSupported && returnPath) {
  location.replace(returnPath)
}

// Go the the no support page if the browser is not supported.
if (!onNoSupportPath && !isSupported) {
  location.replace(noSupportPath + '?returnPath=' + encodeURIComponent(location.pathname + location.search))
}

function checkIfSupported() {
  if (!supportsStaticImport()) {
    return false
  }

  var isFirefox = navigator.userAgent.includes('Firefox')

  // We only support the latest ESR release of Firefox.
  // Make sure to update this with the correct version according to the release schedule:
  // https://wiki.mozilla.org/Release_Management/Calendar
  if (isFirefox && parseVersion().major < 78) {
    return false
  }
  
  return true
}

function supportsStaticImport() {
  return 'noModule' in document.createElement('script')
}

function parseVersion() {
  var versionRaw = navigator.userAgent.split('/').pop()
  var splitVersion = versionRaw.split('.').map(function (part) {
    return parseInt(part, 10)
  })

  return {
    major: splitVersion[0] || 0,
    minor: splitVersion[1] || 0,
    patch: splitVersion[2] || 0
  }
}

function getParam(name) {
  var params = {}
  var query = location.search.substring(1)
  var vars = query.split('&')

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    params[pair[0]] = decodeURIComponent(pair[1])
  }

  return params[name] || null
}
