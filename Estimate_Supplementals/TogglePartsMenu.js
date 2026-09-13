function createTogglePartsContainer(options = {}) {
    sidePanel = document.getElementById('divLeftColumn');
    var newPanel = document.createElement('div');
    newPanel.className = "ord-box";
    newPanel.style = "margin-top: 10px;border: 1px solid #999;float: left;width: 219px;overflow: hidden;background: #fff;";

    newPanelHeader2 = document.createElement('span');
    newPanelHeader2.className = "ord-box ord-title";
    newPanelHeader2.style = "background-color:" + COLOUR.Blue + ";";
    newPanelHeader2.innerHTML = "Toggle Parts";

    newPanelContent2 = document.createElement('div');
    newPanelContent2.className = "ord-box ord-body";
    newPanelContent2.style = "font-family: 'Roboto', sans-serif, Arial;font-style: normal;font-weight: 400;font-size: 13px;color: #444;float: left; width: 100%; padding: 5px; box-sizing: border-box; border-bottom: 1px solid rgb(204, 204, 204); display: block;";

    var togglePartsText = document.createElement('div');
    togglePartsText.style = "float:left;width:150px;margin-bottom:5px;";
    togglePartsText.innerText = "Toggle All Parts";

    newPanelContent2.appendChild(togglePartsText);
    let loadStatus = document.createElement('div');
    loadStatus.style = "clear:both;width:190px;margin:0 5px 3px;text-align:center;font-size:11px;";
    loadStatus.innerText = "Load full part details in advance";
    let loadAllButton = createButton("Load all", "clear:both;width:190px;height:24px;font-size:12px;cursor:pointer;margin:2px 5px 5px;", async () => {
        if(typeof options.onLoadAll !== "function" || loadAllButton.disabled) return;

        loadAllButton.disabled = true;
        loadAllButton.setAttribute("aria-busy", "true");
        updateLoadButtonProgress({completed: 0, total: 0});
        try {
            let result = await options.onLoadAll({onProgress: progress => {
                updateLoadButtonProgress(progress);
                loadStatus.innerText = progress.total === 0
                    ? "All parts are already loaded"
                    : "Loading " + progress.completed + " of " + progress.total + " parts";
            }});
            loadStatus.innerText = result.total === 0
                ? "All parts are already loaded"
                : "Loaded " + result.completed + " parts";
        } catch(error) {
            console.warn("[Corebridge preload] Load all failed.", error);
            loadStatus.innerText = "Some parts could not be loaded";
        } finally {
            loadAllButton.disabled = false;
            loadAllButton.setAttribute("aria-busy", "false");
            loadButtonLabel.innerText = "Load all";
            loadButtonProgress.style.width = "0%";
        }
    }, newPanelContent2);
    loadAllButton.style.position = "relative";
    loadAllButton.style.overflow = "hidden";
    loadAllButton.innerText = "";

    let loadButtonProgress = document.createElement("span");
    loadButtonProgress.style = "position:absolute;left:0;top:0;width:0%;height:100%;background:rgba(255,255,255,0.35);transition:width 150ms linear;pointer-events:none;";
    loadButtonProgress.setAttribute("aria-hidden", "true");
    loadAllButton.appendChild(loadButtonProgress);

    let loadButtonLabel = document.createElement("span");
    loadButtonLabel.style = "position:relative;z-index:1;pointer-events:none;";
    loadButtonLabel.innerText = "Load all";
    loadAllButton.appendChild(loadButtonLabel);

    let updateLoadButtonProgress = progress => {
        let percent = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
        loadButtonProgress.style.width = percent + "%";
        loadButtonLabel.innerText = progress.total > 0
            ? "Loading " + progress.completed + "/" + progress.total
            : "Loading...";
        loadAllButton.setAttribute("aria-valuemin", "0");
        loadAllButton.setAttribute("aria-valuemax", progress.total.toString());
        loadAllButton.setAttribute("aria-valuenow", progress.completed.toString());
    };
    newPanelContent2.appendChild(loadStatus);
    var leftBtn = createButton("Open", "width: 90px; height: 20px;font-size:12px;cursor: pointer;margin:5px", togglePartsOpen, newPanelContent2);
    var rightBtn = createButton("Close", "width: 90px; height: 20px; font-size:12px;cursor: pointer;margin:5px", togglePartsClosed, newPanelContent2);

    newPanel.appendChild(newPanelHeader2);
    newPanel.appendChild(newPanelContent2);

    let togglePartsVisible = createCheckbox_Infield("Toggle Parts Visible", true, "", () => {
        let elements = document.querySelectorAll(".showProductParts");

        for(let i = 0; i < elements.length; i++) {

            IFELSEF(togglePartsVisible[1].checked && elements[i].innerHTML == "▼", () => {$(elements[i]).click();}, () => { });
            IFELSEF(!togglePartsVisible[1].checked && elements[i].innerHTML == "▲", () => {$(elements[i]).click();}, () => { });
        }

    }, newPanelContent2);

    sidePanel.appendChild(newPanel);
}
function togglePartsOpen() {
    $('.partExpander').not('.partExpander.collapse').click();
    $('.partExpander.collapse').show();
}
function togglePartsClosed() {
    $('.partExpander.collapse').click();
    $('.partExpander').not('.partExpander').show();
}
