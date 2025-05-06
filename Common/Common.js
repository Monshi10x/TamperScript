var yes = true;
var no = false;

const assert = function(condition, message) {
    if(!condition)
        throw Error('Assert failed: ' + (message || ''));
};

const KEYCODE = {
    BACKSPACE: 8,        // Backspace
    TAB: 9,              // Tab
    ENTER: 13,           // Enter
    SHIFT: 16,           // Shift
    CTRL: 17,            // Control
    ALT: 18,             // Alt
    PAUSE_BREAK: 19,     // Pause/Break
    CAPS_LOCK: 20,       // Caps Lock
    ESCAPE: 27,          // Escape (Esc)
    SPACE: 32,           // Space
    PAGE_UP: 33,         // Page Up
    PAGE_DOWN: 34,       // Page Down
    END: 35,             // End
    HOME: 36,            // Home
    LEFT_ARROW: 37,      // Left Arrow
    UP_ARROW: 38,        // Up Arrow
    RIGHT_ARROW: 39,     // Right Arrow
    DOWN_ARROW: 40,      // Down Arrow
    INSERT: 45,          // Insert
    DELETE: 46,          // Delete
    KEY_0: 48,           // 0
    KEY_1: 49,           // 1
    KEY_2: 50,           // 2
    KEY_3: 51,           // 3
    KEY_4: 52,           // 4
    KEY_5: 53,           // 5
    KEY_6: 54,           // 6
    KEY_7: 55,           // 7
    KEY_8: 56,           // 8
    KEY_9: 57,           // 9
    A: 65,               // A
    B: 66,               // B
    C: 67,               // C
    D: 68,               // D
    E: 69,               // E
    F: 70,               // F
    G: 71,               // G
    H: 72,               // H
    I: 73,               // I
    J: 74,               // J
    K: 75,               // K
    L: 76,               // L
    M: 77,               // M
    N: 78,               // N
    O: 79,               // O
    P: 80,               // P
    Q: 81,               // Q
    R: 82,               // R
    S: 83,               // S
    T: 84,               // T
    U: 85,               // U
    V: 86,               // V
    W: 87,               // W
    X: 88,               // X
    Y: 89,               // Y
    Z: 90,               // Z
    LEFT_WINDOW_KEY: 91, // Left Windows key (Meta)
    RIGHT_WINDOW_KEY: 92,// Right Windows key (Meta)
    SELECT_KEY: 93,      // Select Key (Context Menu)
    NUMPAD_0: 96,        // Numpad 0
    NUMPAD_1: 97,        // Numpad 1
    NUMPAD_2: 98,        // Numpad 2
    NUMPAD_3: 99,        // Numpad 3
    NUMPAD_4: 100,       // Numpad 4
    NUMPAD_5: 101,       // Numpad 5
    NUMPAD_6: 102,       // Numpad 6
    NUMPAD_7: 103,       // Numpad 7
    NUMPAD_8: 104,       // Numpad 8
    NUMPAD_9: 105,       // Numpad 9
    MULTIPLY: 106,       // Numpad *
    ADD: 107,            // Numpad +
    SUBTRACT: 109,       // Numpad -
    DECIMAL_POINT: 110,  // Numpad .
    DIVIDE: 111,         // Numpad /
    F1: 112,             // F1
    F2: 113,             // F2
    F3: 114,             // F3
    F4: 115,             // F4
    F5: 116,             // F5
    F6: 117,             // F6
    F7: 118,             // F7
    F8: 119,             // F8
    F9: 120,             // F9
    F10: 121,            // F10
    F11: 122,            // F11
    F12: 123,            // F12
    NUM_LOCK: 144,       // Num Lock
    SCROLL_LOCK: 145,    // Scroll Lock
    SEMICOLON: 186,      // ; and :
    EQUAL_SIGN: 187,     // = and +
    COMMA: 188,          // , and <
    DASH: 189,           // - and _
    PERIOD: 190,         // . and >
    FORWARD_SLASH: 191,  // / and ?
    GRAVE_ACCENT_TILDE: 192,   // ` and ~
    OPEN_BRACKET: 219,   // [ and {
    BACKSLASH: 220,      // \ and |
    CLOSE_BRACKET: 221,  // ] and }
    SINGLE_QUOTE: 222    // ' and "
};

function getMHD(minutes) {
    var days = Math.floor((minutes / 60) / dayHours);
    var days_remainderMinutes = minutes - (dayHours * days * 60);
    var hours = Math.floor(days_remainderMinutes / 60);
    var hours_remainderMinutes = days_remainderMinutes - (hours * 60);
    return [hours_remainderMinutes, hours, days];
}

function getSMHD(seconds) {
    var remainingSeconds = 0;
    var days, hours, minutes, seconds;
    [days, remainingSeconds] = [Math.floor(seconds / (dayHours * 60 * 60)), seconds % (dayHours * 60 * 60)];
    [hours, remainingSeconds] = [Math.floor(remainingSeconds / (60 * 60)), seconds % (60 * 60)];
    [minutes, remainingSeconds] = [Math.floor(remainingSeconds / (60)), seconds % (60)];
    return [days, hours, minutes, remainingSeconds];
}

function getMinutesFromMHD(minutes, hours, days) {
    return minutes + (hours * 60) + (days * dayHours * 60);
}

function roundNumber(number, decimalPlaces) {
    return Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}
function roundNumberUp(number) {
    return Math.ceil(number);
}
function roundNumberDown(number) {
    return Math.floor(number);
}

function toggleLock(element) {
    //if locked, then set unlocked
    if(element.innerHTML == "🔒") {
        element.innerHTML = "🔓";
        return false;
    }
    //if unlocked, then set locked
    else if(element.innerHTML == "🔓") {
        element.innerHTML = "🔒";
        return true;
    }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while(L && this.length) {
        what = a[--L];
        while((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function PrintElem(elem) {
    var divContents = billboardBuilderContainer.innerHTML;
    var a = window.open('', '', 'height=500, width=500');
    a.document.write('<html>');
    a.document.write('<body > <h1>Div contents are <br>');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.print();
}

var clog = console.log.bind(document);

function convertClipboardToMeasure() {
    navigator.clipboard.readText()
        .then(text => {
            var txtSplit = text.replace(/[^\d]/g, ' ').split(" ").filter(function(e) {return e;});
            var txt = "";
            for(var t = 0; t < txtSplit.length; t++) {
                txt += txtSplit[t] + "mm ";
                if(t < txtSplit.length - 1) txt += "x ";
            }
            const selection = window.getSelection();
            if(!selection.rangeCount) return false;
            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(document.createTextNode(txt));
        })
        .catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
}

async function saveToClipboard(string) {
    await navigator.clipboard.writeText(string);
    console.log("string copied to clipboard");
}

function StringCombine(...args) {
    let str = '';
    for(var i = 0; i < args.length; i++) {
        str += args[i];
    }
    return str;
}

/**
 * Returns True|False if a point is in a polygon.
 * @param {Integer} nvert number of vertices
 * @param {Array} vertx array of X vertices
 * @param {Array} verty array of Y vertices
 * @param {Integer} testx x position of test vertex
 * @param {Integer} testy y position of test vertex
 * @returns Boolean
 */
function pointInPolygon(nvert, vertx, verty, testx, testy) {
    var i, j, c = false;
    for(i = 0, j = nvert - 1; i < nvert; j = i++) {
        if(((verty[i] > testy) != (verty[j] > testy)) &&
            (testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i])) {
            c = !c;
        }
    }
    return c;
}

var DPI = 96;//Chrome DPI. TODO: check this across other users
function mmToPixel(mm) {
    return (mm * DPI) / 25.4;
}
function pixelToMM(pixels) {
    return (pixels * 25.4) / DPI;
}


let ArrayContainsAnotherArray = (arr, target) => target.every(v => arr.includes(v));

function stringContainsWords(mainString, searchWordsString) {
    let matchesSearchTerm = false;
    let dropdownContainInstances = 0;

    mainString = mainString.toLowerCase();
    let mainString_AsArray = mainString.split(" ");

    searchWordsString = searchWordsString.toLowerCase().trim();
    let searchWords_AsArray = searchWordsString.split(" ");

    topLoop:
    for(let x = 0; x < searchWords_AsArray.length; x++) {
        secondLoop:
        for(let y = 0; y < mainString_AsArray.length; y++) {
            if(mainString_AsArray[y].includes(searchWords_AsArray[x])) {
                dropdownContainInstances++;
                break secondLoop;
            }
        }
        if(dropdownContainInstances >= searchWords_AsArray.length) matchesSearchTerm = true;
    }

    return matchesSearchTerm;
}

/**
 * Returns a new cloned (non-pointer) array 
 * @param {Array} array 
 * @returns New Array
 */
function arrayAsValuesNotReference(object) {
    return JSON.parse(JSON.stringify(object));
}

function removeAllChildrenFromParent(parent) {
    while(parent.childElementCount > 0) {parent.removeChild(parent.lastChild);}
}

function deleteElement(element) {
    element.remove();
}

function removeElementsFromArrayByIndex(array, arrayOfIndexesToRemove) {
    for(let i = arrayOfIndexesToRemove.length - 1; i >= 0; i--) {
        array.splice(arrayOfIndexesToRemove[i], 1);
    }
}

/**
 * @param {*} array 
 * @returns new array with only unique elements 
 */
function uniqueArray(array) {
    //If you want to keep the last occurrence of a value, simply replace indexOf with lastIndexOf.
    //return array.filter((v, i, a) => a.indexOf(v) === i);
    return [...new Set(array)];
}


function uniqueArray3D(array) {
    let stringArray = array.map(JSON.stringify);
    let uniqueStringArray = new Set(stringArray);
    let uniqueArray = Array.from(uniqueStringArray, JSON.parse);
    return uniqueArray;
}

function uniqueArray3DWithOccurenceCount(array) {
    let stringArray = array.map(JSON.stringify);
    let arrayReduced = uniqueArray3D(array);
    let arrayReducedString = arrayReduced.map(JSON.stringify);

    let tempArr = [];

    for(let i = 0; i < arrayReducedString.length; i++) {
        tempArr.push({'qty': getOccurrenceCountInArray(stringArray, arrayReducedString[i]), 'item': arrayReducedString[i]});
    }

    return tempArr;
}

/**
 * @argument array i.e. [[w,h], [w,h]...]
 * @returns [] i.e. [QWHD(), QWHD(), ...]
 */
function uniqueSizeArrayWithOccurenceCount(array) {
    let returnArray = [];
    for(let i = 0; i < array.length; i++) {
        let itemWidth = array[i][0];
        let itemHeight = array[i][1];
        let itemDepth = array[i][1];
        if(i == 0) {
            returnArray.push(new QWHD(1, itemWidth, itemHeight, itemDepth));
            continue;
        }
        for(let j = 0; j < returnArray.length; j++) {
            if(returnArray[j].width == itemWidth && returnArray[j].height == itemHeight && returnArray[j].depth == itemDepth) {
                returnArray[j].qty += 1;
                break;
            }
            if(j == returnArray.length - 1) {
                returnArray.push(new QWHD(1, itemWidth, itemHeight, itemDepth));
                break;
            }
        }

    }
    return returnArray;
}

function getOccurrenceCountInArray(array, value) {
    return array.filter((v) => (v === value)).length;
}

function mmToM(element) {
    return element / 1000;
}

function mToMM(element) {
    return element * 1000;
}

function mmToInch(value) {
    if(value == 0) return 0;
    return value / 25.4;
}

function inchToMM(element) {
    return element / 25.4;
}

function m2ToMM2(element) {
    return element * 1000000;
}
function mm2ToM2(element) {
    return element * 1000000;
}

function zeroIfNaN(element) {
    if(isNaN(element)) {
        return 0;
    } return parseFloat(element);
}

function zeroIfNull(element) {
    if(element === null) {
        return 0;
    } return parseFloat(element);
}

function zeroIfNaNNullBlank(element) {
    if(isNaN(element) || element === null || element == "") {
        return 0;
    } return parseFloat(element);
}

function clamp(n, min, max) {
    if(n > max) {
        return max;
    } else if(n < min) {
        return min;
    } else {
        return n;
    }
}

function deleteElementsFromArray(array, ...elements) {
    for(var i = 0; i < elements.length; i++) {
        let elementIndex = array.indexOf(elements[i]);
        if(elementIndex !== -1)
            array.splice(elementIndex, 1);
    }
    return array;
}

function stringToBoolean(string) {
    switch(string.toLowerCase().trim()) {
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(string);
    }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function insertBefore(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

function secondsToMinutes(seconds) {
    return seconds / 60;
}

/**
 * @description provides a landscape representation of shape with dimensions A,B
 * @returns [A,B] where A >= B or [B,A] if B > A 
 */
function convertDimensionsToLandscape(dimensionA, dimensionB) {
    dimA = parseFloat(dimensionA);
    dimB = parseFloat(dimensionB);
    if(dimA >= dimB) return [dimA, dimB];
    return [dimB, dimA];
};

function generateUniqueID() {
    return Date.now() + "-" + Math.floor(Math.random() * 100000000);
}

/**
 * 
 * @param {[]} array with objects that contain keys: qty, width, height
 * @example
 * [{qty: 1, width: 1, height: 1},
 * {qty: 1, width: 1, height: 1}
 * ...]
 */
function combinedSqm(array, inMM = true) {
    let sqm = 0;
    for(let i = 0; i < array.length; i++) {
        sqm += zeroIfNaNNullBlank(array[i].qty) *
            zeroIfNaNNullBlank(array[i].width) *
            zeroIfNaNNullBlank(array[i].height) *
            (inMM ? 1 / 1000000 : 1);
    }
    return sqm;
}


/**
 * 
 * @param {[]} array with objects that contain keys: qty, width, height
 * @example
 * [{qty: 1, totalLength: 1},
 * {qty: 1, totalLength: 1}
 * ...]
 */
function combinedLnm(array, inMM = true) {
    let lnm = 0;
    for(let i = 0; i < array.length; i++) {
        lnm += zeroIfNaNNullBlank(array[i].qty) *
            zeroIfNaNNullBlank(array[i].totalLength) *
            (inMM ? 1 / 1000000 : 1);
    }
    return lnm;
}
/**
 * 
 * @returns percentage of browser window zoom as integer (100 is standard no zoom)
 */
function getWindowZoom() {
    return Math.round(window.devicePixelRatio * 100);
}

function RGBToHex(RGBString) {
    let y = RGBString.split("(")[1].split(")")[0].split(",");
    let t = y.map(function(r) {             //For each array element
        r = parseInt(r).toString(16);      //Convert to a base16 string
        return (r.length == 1) ? "0" + r : r;  //Add zero if we get only one character
    });
    t = "#" + t.join("");
    return t;
}

function getSideMargins(element) {
    return parseInt(element.style.marginLeft) + parseInt(element.style.marginRight);
}

function getTopBottomMargins(element) {
    return parseInt(element.style.marginLeft) + parseInt(element.style.marginRight);
}

_todo = [];
function TODO(element) {
    _todo.push(element);
    console.log("%cTODO: " + element, 'background: green; color: white');
}

function HTMLToText(htmlString) {
    let tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = htmlString;

    return tempDivElement.textContent || tempDivElement.innerText || "";
}

function toggle(expression, trueCallback, falseCallback) {
    if(expression) trueCallback();
    else falseCallback();
}

function AddCssStyle(cssStyle, element) {
    element.style.cssText += ";" + cssStyle + ";";
}

function catchNull(value, valueIfNull) {
    if(value == null) return valueIfNull;
    else return value;
}

function IFELSE(expression, valueIfTrue, valueIfFalse) {
    if(expression == true) {
        return valueIfTrue;
    } else {
        return valueIfFalse;
    }
}
/**
 * @param {*} expression 
 * @param {*} functionIf - run function if true
 * @param {*} functionElse - fun function if false
 */
function IFELSEF(expression, functionIfTrue, functionIfFalse) {
    if(expression) {
        functionIfTrue();
    } else {
        functionIfFalse();
    }
}

function isVisible(element) {
    if(element.style.display != "none") return true;
    return false;
}

function getDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //janvier = 0
    let yyyy = today.getFullYear();

    return dd + '/' + mm + '/' + yyyy;
}


class UOM {
    //TIME
    _timeMins = 0;

    //SPEED
    _speedMetresPerMin = 0;

    //LITRES
    _litres = 0;

    constructor(value, unit) {
        unit = unit.toLowerCase();

        if(unit == "seconds" || unit == "secs" || unit == "second") this._timeMins = value / 60;
        if(unit == "mins" || unit == "min" || unit == "minute" || unit == "minutes") this._timeMins = value;
        if(unit == "hours" || unit == "hour") this._timeMins = value * 60;

        if(unit == "mm/min") this._speedMetresPerMin = value / 1000;
        if(unit == "m/min") this._speedMetresPerMin = value;

        if(unit == "litres" || unit == "l") this._litres = value;
        if(unit == "ml" || unit == "millilitres" || unit == "millilitre") this._litres = value / 1000;
    }

    as(unit) {
        unit = unit.toLowerCase();

        if(unit == "seconds" || unit == "secs" || unit == "second") return this._timeMins * 60;
        if(unit == "mins" || unit == "min" || unit == "minute" || unit == "minutes") return this._timeMins;
        if(unit == "hours" || unit == "hour") return this._timeMins / 60;

        if(unit == "mm/min") return this._speedMetresPerMin * 1000;
        if(unit == "m/min") return this._speedMetresPerMin;

        if(unit == "litres" || unit == "l") return this._litres;
        if(unit == "ml" || unit == "millilitres" || unit == "millilitre") return this._litres * 1000;

        return console.error("no conversion found");
    }
}
