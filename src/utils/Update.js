function updateCheck () {
    const https = require('https')

    var currentVersion = require('../../package.json').version;

    var options = {
        hostname: 'raw.githubusercontent.com',
        port: 443,
        path: '/OpenexOverlay/OpenexData/main/version.json',
        method: 'GET',
        json: true
    }
    
    const req = https.request(options, res => {
        res.on('data', d => {
            var webVersion = JSON.parse(d).version;

            if (webVersion > currentVersion) {
                require("electron").shell.openExternal("https://github.com/Lightcaster5/Openex-Overlay/releases")
            };
            if (webVersion == currentVersion) {
                alert('Openex is up to date!')
            };
        })
    })

    req.on('error', error => {
        console.error(error)
    })

    req.end();
}
module.exports = updateCheck