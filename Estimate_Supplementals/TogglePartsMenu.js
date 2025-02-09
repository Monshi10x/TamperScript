function createOptionsContainer() {
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
    var leftBtn = createButton("Open", "width: 90px; height: 20px;font-size:12px;cursor: pointer;margin:5px", togglePartsOpen, newPanelContent2);
    var rightBtn = createButton("Close", "width: 90px; height: 20px; font-size:12px;cursor: pointer;margin:5px", togglePartsClosed, newPanelContent2);

    newPanel.appendChild(newPanelHeader2);
    newPanel.appendChild(newPanelContent2);

    let togglePartsVisible = createCheckbox_Infield("Toggle Parts Visible", true, "", () => {
        let elements = document.querySelectorAll(".ord-prod-part");
        let elementFooters = document.querySelectorAll(".ord-prod-footer");
        for(let i = 0; i < elements.length; i++) {
            if(togglePartsVisible[1].checked) {
                $(elements[i]).show();
                $(elementFooters[i]).show();
            } else {
                $(elements[i]).hide();
                $(elementFooters[i]).hide();
            }

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