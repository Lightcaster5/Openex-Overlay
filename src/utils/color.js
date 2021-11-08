const COLOR_BLACK = "#000000";
const COLOR_DARK_BLUE = "#0000AA";
const COLOR_DARK_GREEN = "#00AA00";
const COLOR_DARK_AQUA = "#00AAAA";
const COLOR_DARK_RED = "#AA0000";
const COLOR_DARK_PURPLE = "#AA00AA";
const COLOR_GOLD = "#FFAA00";
const COLOR_GRAY = "#AAAAAA";
const COLOR_DARK_GRAY = "#555555";
const COLOR_BLUE = "#5555FF";
const COLOR_GREEN = "#55FF55";
const COLOR_AQUA = "#55FFFF";
const COLOR_RED = "#FF5555";
const COLOR_LIGHT_PURPLE = "#FF55FF";
const COLOR_YELLOW = "#FFFF55";
const COLOR_WHITE = "#FFFFFF";

function getLevelColor(level) {
    if (level >= 1000) {
        return color(level.toString().charAt(0), COLOR_RED) +
            color(level.toString().charAt(1), COLOR_GOLD) +
            color(level.toString().charAt(2), COLOR_YELLOW) +
            color(level.toString().charAt(3), COLOR_GREEN);
    } else if (level >= 900) {
        return color(level, COLOR_DARK_PURPLE);
    } else if (level >= 800) {
        return color(level, COLOR_BLUE);
    } else if (level >= 700) {
        return color(level, COLOR_LIGHT_PURPLE);
    } else if (level >= 600) {
        return color(level, COLOR_DARK_RED);
    } else if (level >= 500) {
        return color(level, COLOR_DARK_AQUA);
    } else if (level >= 400) {
        return color(level, COLOR_DARK_GREEN);
    } else if (level >= 300) {
        return color(level, COLOR_AQUA);
    } else if (level >= 200) {
        return color(level, COLOR_GOLD);
    } else if (level >= 100) {
        return color(level, COLOR_WHITE);
    } else {
        return color(level, COLOR_GRAY);
    }
}

function getFKDRColor(fkdr) {
    if (fkdr >= 10) {
        return color(fkdr, COLOR_DARK_RED);
    } else if (fkdr >= 5) {
        return color(fkdr, COLOR_RED);
    } else if (fkdr >= 3) {
        return color(fkdr, COLOR_GOLD);
    } else if (fkdr >= 2) {
        return color(fkdr, COLOR_YELLOW);
    } else if (fkdr >= 1) {
        return color(fkdr, COLOR_GREEN);
    } else {
        return color(fkdr, COLOR_DARK_GREEN);
    }
}

function getWLRColor(wlr) {
    if (wlr >= 5) {
        return color(wlr, COLOR_DARK_RED);
    } else if (wlr >= 2.5) {
        return color(wlr, COLOR_RED);
    } else if (wlr >= 1.5) {
        return color(wlr, COLOR_GOLD);
    } else if (wlr >= 1) {
        return color(wlr, COLOR_YELLOW);
    } else if (wlr >= 0.5) {
        return color(wlr, COLOR_GREEN);
    } else {
        return color(wlr, COLOR_DARK_GREEN);
    }
}

function getBBLRColor(bblr) {
    if (bblr >= 5) {
        return color(bblr, COLOR_DARK_RED);
    } else if (bblr >= 2.5) {
        return color(bblr, COLOR_RED);
    } else if (bblr >= 1.5) {
        return color(bblr, COLOR_GOLD);
    } else if (bblr >= 1) {
        return color(bblr, COLOR_YELLOW);
    } else if (bblr >= 0.5) {
        return color(bblr, COLOR_GREEN);
    } else {
        return color(bblr, COLOR_DARK_GREEN);
    }
}

function getFinalKillsColor(finalKills) {
    if (finalKills >= 1000) {
        return color(finalKills, COLOR_WHITE);
    } else {
        return color(finalKills, COLOR_GRAY);
    }
}

function getWinsColor(wins) {
    if (wins >= 100) {
        return color(wins, COLOR_WHITE);
    } else {
        return color(wins, COLOR_GRAY);
    }
}

function getIndexColor(index) {
    if (index == "fold rn") {
        return color(index, COLOR_BLACK);
    }
    if (index >= 10000) {
        return color(index, COLOR_DARK_RED);
    } else if (index >= 5000) {
        return color(index, COLOR_RED);
    } else if (index >= 2500) {
        return color(index, COLOR_GOLD);
    } else if (index >= 1500) {
        return color(index, COLOR_YELLOW);
    } else if (index >= 750) {
        return color(index, COLOR_GREEN);
    } else {
        return color(index, COLOR_DARK_GREEN);
    }
}

function getRankColor(playerData) {
    switch (playerData.rank) {
        case "Default":
            return color(playerData.toString(), COLOR_GRAY);
        case "VIP":
        case "VIP+":
            return color(playerData.toString(), COLOR_GREEN);
        case "MVP":
        case "MVP+":
            return color(playerData.toString(), COLOR_AQUA);
        case "MVP++":
            return color(playerData.toString(), COLOR_GOLD);
        case "Game Master":
            return color(playerData.toString(), COLOR_DARK_GREEN);
        case "Admin":
            return color(playerData.toString(), COLOR_DARK_RED);
        case "YouTube":
            return color(playerData.toString(), COLOR_RED);
    }
}

function color(data, color) {
    return "<span style=\"color:" + color + "\">" + data + "</span>";
}

module.exports = {
    getLevelColor,
    getFKDRColor,
    getWLRColor,
    getBBLRColor,
    getFinalKillsColor,
    getWinsColor,
    getIndexColor,
    getRankColor,
    color,
    COLOR_RED,
    COLOR_BLUE
}