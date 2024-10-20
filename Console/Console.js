let error_global_orderMinimum_Price_Install = null;
let error_global_orderMinimum_Profit = null;
let error_global_orderMinimum_Profit_InstallJob = null;
let error_global_orderMinimum_Price = null;
let warning_global_containsOtherInformation = {name: 'warning_global_containsOtherInformation', value: 'Warning -> Add Other Information item'};
var log;
let logText = new Map();
var logTextObject;
var err;

function updateErrors() {
    error_global_orderMinimum_Price_Install = {name: 'error_global_orderMinimum_Price_Install', value: 'Error -> Install Prices must sum greater than ' + global_orderMinimum_Price_Install + '$ total'};
    error_global_orderMinimum_Profit = {name: 'error_global_orderMinimum_Profit', value: 'Error -> Minimum Profit must be over ' + global_orderMinimum_Profit + '$'};
    error_global_orderMinimum_Profit_InstallJob = {name: 'error_global_orderMinimum_Profit_InstallJob', value: 'Error -> Minimum Profit for Jobs including Install must sum greater than ' + global_orderMinimum_Profit_InstallJob + '$ total'};
    error_global_orderMinimum_Price = {name: 'error_global_orderMinimum_Price', value: 'Error -> Minimum Order Price must be over ' + global_orderMinimum_Price + '$ total'};
}

function createLog() {
    log = document.createElement('div');
    var logContainer = document.createElement('div');
    var header = document.createElement("p");
    header.innerText = "Console";
    header.style = "width:100%;padding:8px;font:14px;margin:0px;color:white;text-align:center;font-weight:bold;";
    logContainer.style = "width:160px;min-height:50px;max-height:200px;position:fixed;left:0px;bottom:50px;background-color:" + "rgb(36 36 36)" + ";display:block;z-index:900;border-bottom: 1px solid " + "rgb(36 36 36)" + ";border-top: 1px solid " + "rgb(36 36 36)" + ";";
    log.style = "overflow-y: scroll;";
    log.id = "Log";
    logTextObject = document.createElement('p');
    logTextObject.style = "color:white; padding:5px";
    log.appendChild(logTextObject);
    logContainer.appendChild(header);
    logContainer.appendChild(log);

    document.getElementsByTagName('body')[0].appendChild(logContainer);
}
function showLog() {
    log.style.display = "block";
}
function hideLog() {
    log.style.display = "none";
}

function addLogText(key, value) {
    if(logText == null) return;
    logText.set(key, value);
    showLog();
    logTextObject.innerHTML = "";
    for(let [k, v] of logText.entries()) {
        logTextObject.innerHTML += v + "<br>";
    }
}
function removeLogText(key) {
    if(logText == null) return;
    if(!logText.has(key)) return;
    else logText.delete(key);
    logTextObject.innerHTML = "";
    if(logText.size != 0) {
        for(let [k, v] of logText.entries()) {
            logTextObject.innerHTML += v + "<br>";
        }
    } else {
        hideLog();
    }
}
function logContainsErrors() {
    if(logText.has("error_global_orderMinimum_Price_Install") ||
        logText.has("error_global_orderMinimum_Profit") ||
        logText.has("error_global_orderMinimum_Profit_InstallJob") ||
        logText.has("error_global_orderMinimum_Price")) {
        return true;
    } else {return false;}
}

function consoleTick() {
    if(!global_containsOtherInformation) {
        addLogText(warning_global_containsOtherInformation.name, warning_global_containsOtherInformation.value);
    } else {
        removeLogText(warning_global_containsOtherInformation.name);
    }
}
