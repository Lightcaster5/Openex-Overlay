const { ipcRenderer } = require('electron');
const lineReader = require('line-reader');
const homedir = require('os').homedir();
const colorUtils = require("./utils/color");

const Store = require('./utils/Store');

const store = new Store({
    configName: 'openex-properties',
    defaults: {
        api_key: ''
    }
});

var apiKey = store.get('api_key');

const Hypixel = require('hypixel-api-reborn');
var hypixel;

window.onload = function () {
    document.getElementById("close").onclick = function () {
        ipcRenderer.send('closeWindow');
    }
    document.getElementById("minimize").onclick = function () {
        ipcRenderer.send('minimizeWindow');
    }

    mainLoop();
    createLines();
    regenerateAPI();
}

function createLines() {
    var i = 74;
    for (var j = 0; j < 16; j++) {
        var hr = document.createElement("hr");
        hr.setAttribute('style', 'top:' + i + 'px;');
        document.getElementById('content').appendChild(hr);
        i += 19;
    }
}

function mainLoop() {
    setTimeout(function () {
        processLineByLine();
        update();
        mainLoop();
    }, 32);
}

const COLOR_BLUE = "#5555FF";
const COLOR_RED = "#FF5555";

var players = [];

var loadingArray = new Array();
var nickedArray = new Array();

const levelMap = new Map();
const nameMap = new Map();
const fkdrMap = new Map();
const wlrMap = new Map();
const bblrMap = new Map();
const finalKillsMap = new Map();
const winsMap = new Map();
const indexMap = new Map();

function update() {
    var levels = document.getElementById('lvl');
    levels.innerHTML = "";
    var names = document.getElementById('name');
    names.innerHTML = "";
    var fkdr = document.getElementById('fkdr');
    fkdr.innerHTML = "";
    var wlr = document.getElementById('wlr');
    wlr.innerHTML = "";
    var bblr = document.getElementById('bblr');
    bblr.innerHTML = "";
    var fkills = document.getElementById('fkills');
    fkills.innerHTML = "";
    var wins = document.getElementById('wins');
    wins.innerHTML = "";
    var index = document.getElementById('index');
    index.innerHTML = "";

    let sortedPlayers = new Map([...levelMap.entries()].sort((a, b) => b[1] - a[1])); // we dont know what this does so fuck whoever made it

    for (let nicked of nickedArray) {
        var levelLi = document.createElement('li'),
            nameLi = document.createElement('li'),
            fkdrLi = document.createElement('li'),
            wlrLi = document.createElement('li'),
            bblrLi = document.createElement('li'),
            fkillsLi = document.createElement('li'),
            winsLi = document.createElement('li'),
            indexLi = document.createElement('li');

        levelLi.innerHTML = colorUtils.color("-", COLOR_RED);
        nameLi.innerHTML = colorUtils.color(nicked, COLOR_RED);
        fkdrLi.innerHTML = colorUtils.color("-", COLOR_RED);
        wlrLi.innerHTML = colorUtils.color("-", COLOR_RED);
        bblrLi.innerHTML = colorUtils.color("-", COLOR_RED);
        fkillsLi.innerHTML = colorUtils.color("-", COLOR_RED);
        winsLi.innerHTML = colorUtils.color("-", COLOR_RED);
        indexLi.innerHTML = colorUtils.color("-", COLOR_RED);

        levels.appendChild(levelLi);
        names.appendChild(nameLi);
        fkdr.appendChild(fkdrLi);
        wlr.appendChild(wlrLi);
        bblr.appendChild(bblrLi);
        fkills.appendChild(fkillsLi);
        wins.appendChild(winsLi);
        index.appendChild(indexLi);
    }

    for (var i = 0; i < players.length - nickedArray.length - loadingArray.length; i++) {
        let player = Array.from(sortedPlayers.keys())[i];
        var levelLi = document.createElement('li'),
            nameLi = document.createElement('li'),
            fkdrLi = document.createElement('li'),
            wlrLi = document.createElement('li'),
            bblrLi = document.createElement('li'),
            fkillsLi = document.createElement('li'),
            winsLi = document.createElement('li'),
            indexLi = document.createElement('li');

        levelLi.innerHTML = colorUtils.getLevelColor(getData(levelMap, player));
        nameLi.innerHTML = nameMap.has(player) ? nameMap.get(player) : player;
        fkdrLi.innerHTML = colorUtils.getFKDRColor(getData(fkdrMap, player));
        wlrLi.innerHTML = colorUtils.getWLRColor(getData(wlrMap, player));
        bblrLi.innerHTML = colorUtils.getBBLRColor(getData(bblrMap, player));
        fkillsLi.innerHTML = colorUtils.getFinalKillsColor(getData(finalKillsMap, player));
        winsLi.innerHTML = colorUtils.getWinsColor(getData(winsMap, player));
        indexLi.innerHTML = colorUtils.getIndexColor(getData(indexMap, player));

        levels.appendChild(levelLi);
        names.appendChild(nameLi);
        fkdr.appendChild(fkdrLi);
        wlr.appendChild(wlrLi);
        bblr.appendChild(bblrLi);
        fkills.appendChild(fkillsLi);
        wins.appendChild(winsLi);
        index.appendChild(indexLi);
    }
    for (let loading of loadingArray) {
        var levelLi = document.createElement('li'),
            nameLi = document.createElement('li'),
            fkdrLi = document.createElement('li'),
            wlrLi = document.createElement('li'),
            bblrLi = document.createElement('li'),
            fkillsLi = document.createElement('li'),
            winsLi = document.createElement('li'),
            indexLi = document.createElement('li');

        levelLi.innerHTML = colorUtils.color("-", COLOR_BLUE);
        nameLi.innerHTML = colorUtils.color(loading, COLOR_BLUE);
        fkdrLi.innerHTML = colorUtils.color("-", COLOR_BLUE);
        wlrLi.innerHTML = colorUtils.color("-", COLOR_BLUE);
        bblrLi.innerHTML = colorUtils.color("-", COLOR_BLUE);
        fkillsLi.innerHTML = colorUtils.color("-", COLOR_BLUE);
        winsLi.innerHTML = colorUtils.color("-", COLOR_BLUE);
        indexLi.innerHTML = colorUtils.color("-", COLOR_BLUE);

        levels.appendChild(levelLi);
        names.appendChild(nameLi);
        fkdr.appendChild(fkdrLi);
        wlr.appendChild(wlrLi);
        bblr.appendChild(bblrLi);
        fkills.appendChild(fkillsLi);
        wins.appendChild(winsLi);
        index.appendChild(indexLi);
    }
}

function clean() {
    if (hypixel == null) return;
    for (var i = 0; i < players.length; i++) {
        let player = players[i];
        var get = false;
        if (!levelMap.has(player)) {
            get = true;
        }
        if (!nameMap.has(player)) {
            get = true;
        }
        if (!fkdrMap.has(player)) {
            get = true;
        }
        if (!wlrMap.has(player)) {
            get = true;
        }
        if (!bblrMap.has(player)) {
            get = true;
        }
        if (!finalKillsMap.has(player)) {
            get = true;
        }
        if (!winsMap.has(player)) {
            get = true;
        }
        if (!indexMap.has(player)) {
            get = true;
        }

        if (get && !loadingArray.includes(player) && !nickedArray.includes(player)) {
            console.log("Getting " + player + "'s stats for updating...")
            loadingArray.push(player);
            hypixel.getPlayer(player).then(playerData => {
                if (playerData) {
                    levelMap.set(player, playerData.stats.bedwars.level);
                    nameMap.set(player, colorUtils.getRankColor(playerData));
                    fkdrMap.set(player, playerData.stats.bedwars.finalKDRatio);
                    wlrMap.set(player, playerData.stats.bedwars.WLRatio);
                    bblrMap.set(player, playerData.stats.bedwars.beds.BLRatio);
                    finalKillsMap.set(player, playerData.stats.bedwars.finalKills);
                    winsMap.set(player, playerData.stats.bedwars.wins);
                    indexMap.set(player, getIndex(playerData));
                    var index = loadingArray.indexOf(player);
                    if (index !== -1) {
                        loadingArray.splice(index, 1);
                    }
                }
            }).catch(() => {
                nickedArray.push(player);
                var index = loadingArray.indexOf(player);
                if (index !== -1) {
                    loadingArray.splice(index, 1);
                }
            });
        }
    }
    for (let [key] of levelMap) {
        if (!players.includes(key)) {
            levelMap.delete(key);
        }
    }
    for (let [key] of fkdrMap) {
        if (!players.includes(key)) {
            fkdrMap.delete(key);
        }
    }
    for (let [key] of wlrMap) {
        if (!players.includes(key)) {
            wlrMap.delete(key);
        }
    }
    for (let [key] of bblrMap) {
        if (!players.includes(key)) {
            bblrMap.delete(key);
        }
    }
    for (let [key] of finalKillsMap) {
        if (!players.includes(key)) {
            finalKillsMap.delete(key);
        }
    }
    for (let [key] of winsMap) {
        if (!players.includes(key)) {
            winsMap.delete(key);
        }
    }
    for (let [key] of indexMap) {
        if (!players.includes(key)) {
            indexMap.delete(key);
        }
    }
    for (let key of loadingArray) {
        if (!players.includes(key)) {
            var index = loadingArray.indexOf(key);
            if (index !== -1) {
                loadingArray.splice(index, 1);
            }
        }
    }
    for (let key of nickedArray) {
        if (!players.includes(key)) {
            var index = nickedArray.indexOf(key);
            if (index !== -1) {
                nickedArray.splice(index, 1);
            }
        }
    }
}

const lcPath = homedir + "/.lunarclient/offline/1.8/logs/latest.log"
/*
 * hopefully we can make a custom dir here eventually
 * basically just put something in config saying ex.
 * HOMEDIR\AppData\Roaming\.minecraft\logs\ or
 * C:\.minecraft */

var chunkIndex;
var startLineCount = 0;
require('fs').createReadStream(lcPath)
    .on('data', function (chunk) {
        for (chunkIndex = 0; chunkIndex < chunk.length; ++chunkIndex)
            if (chunk[chunkIndex] == 10) startLineCount++;
    })


var currentCount = 0;
async function processLineByLine() {

    var line = 0;
    lineReader.eachLine(lcPath, function (lineData) {
        if (line > currentCount) {
            if (isValidLine(line)) {
                if (lineData.includes('[Client thread/INFO]: [CHAT] ')) {
                    let data = stripLine(lineData.substring(40));
                    if (!data.startsWith("From")) { 
                        if (!data.includes(":") && (data.includes("joined the lobby!" || data.includes("spooked into the lobby!") || data.includes("sled into the lobby!")) || data.startsWith("Sending you to mini") || data.includes("unclaimed leveling rewards") || data.includes("unclaimed achievement rewards"))) {
                            players = [];
                            nickedArray = new Array();
                            loadingArray = new Array();
                            if (hypixel != null)
                                hypixel.sweepCache();
                        } else if (data.includes("has joined (") && data.endsWith(")!")) {
                            var player = data.split(" ")[0].replace(" ", "");
                            players.push(player);
                            clean();
                        } else if (data.includes("has quit!")) {
                            var index = players.indexOf(data.split(" ")[0].replace(" ", ""));
                            if (index !== -1) {
                                players.splice(index, 1);
                                clean();
                            }
                        } else if (data.startsWith("ONLINE: ")) {
                            players = [];
                            var p = data.replace("ONLINE: ", "").replace(/\s+/g, "").split(",");
                            players = p;
                            clean();
                        } else if (data.startsWith("Your new API key is ")) {
                            var key = data.split(" ")[5];
                            store.set('api_key', key);
                            apiKey = key;
                            regenerateAPI();
                        } else if (data.endsWith("FINAL KILL!")) {
                            var index = players.indexOf(data.split(" ")[0].replace(" ", ""));
                            if (index !== -1) {
                                players.splice(index, 1);
                                clean();
                            }
                        } else if (data.endsWith("disconnected") || data.endsWith("disconnected.")) {
                            var index = players.indexOf(data.split(" ")[0].replace(" ", ""));
                            if (index !== -1) {
                                players.splice(index, 1);
                                clean();
                            }
                        } else if (data.endsWith("reconnected") || data.endsWith("reconnected.")) {
                            var player = data.split(" ")[0].replace(" ", "");
                            players.push(player);
                            clean();
                        }
                    }
                }
            }
            currentCount = line;
        }
        line++;
    });
}

function isValidLine(lineNumber) {
    return lineNumber > startLineCount;
}

function stripLine(line) {
    const regex = "§[0-9A-FK-ORa-fk-or]";
    const secondRegex = "�[0-9A-FK-ORa-fk-or]";
    return line.replace(regex, "").replace(secondRegex, "");
}

function getIndex(playerData) {
    let index = Math.round(playerData.stats.bedwars.WLRatio * 50 + playerData.stats.bedwars.finalKDRatio * 25 + playerData.stats.bedwars.level * 10);
    return index > 20000 ? "fold rn" : index;
}

function getData(map, player) {
    if (map.has(player)) {
        return map.get(player);
    } else {
        return "-";
    }
}

function regenerateAPI() {
    if (apiKey == "") return;
    hypixel = new Hypixel.Client(`${apiKey}`, {
        silent: true,
    });
}