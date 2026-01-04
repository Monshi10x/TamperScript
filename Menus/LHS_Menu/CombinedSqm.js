class AreaMenu extends LHSMenuWindow {

    constructor(width, height, ID, windowTitle) {
        super(width, height, ID, windowTitle);
        this.addPages(1);
    }

    show() {
        super.show();

        var page = this.getPage(0);

        while(page.hasChildNodes()) {page.removeChild(page.lastChild);}
        while(this.footer.hasChildNodes()) {this.footer.removeChild(this.footer.lastChild);}

        var combinedSqmContainer_addBtn = document.createElement('button');
        //combinedSqmContainer_calcSqmBtn=document.createElement('button');
        var combinedSqmContainer_display = document.createElement('div');

        var combinedSqmContainer_rowsContainer = document.createElement("div");
        combinedSqmContainer_rowsContainer.style = "background-color:white;margin-top:5px;margin-left:0px;margin-right:0px;margin-bottom:0px;min-height:100px;max-height:600px;width:95%;padding:5px;float:left;display:block;color:white;cursor: pointer;border-style:none;overflow-y:scroll";

        combinedSqmContainer_addBtn.innerHTML = "Add Row";
        combinedSqmContainer_addBtn.style = "background-color:" + COLOUR.Blue + ";margin-top:0px;margin-left:10px;margin-right:0px;margin-bottom:0px;min-height:20px;min-width:120px;padding:5px;float:left;display:block;color:white;cursor: pointer;border-style:none;";
        combinedSqmContainer_addBtn.addEventListener("click", function() {
            var cab = document.createElement('div');
            cab.style = "background-color:" + COLOUR.Blue + ";margin-top:10px;margin-left:10px;margin-right:10px;margin-bottom:0px;min-height:30px;min-width:230px;padding:5px;float:left;display:block;color:white;cursor: pointer;";
            var cStyle = "margin-top:5px;margin-left:5px;margin-right:5px;margin-bottom:5px;min-height:10px;width:50px;padding:5px;float:left;display:block;color:black;";
            var c1 = document.createElement('input');
            c1.style = cStyle;
            c1.className = "combinedSqm_Width";
            c1.placeholder = "Width";
            c1.onkeyup = updateStats;
            var c2 = document.createElement('input');
            c2.style = cStyle;
            c2.placeholder = "Height";
            c2.className = "combinedSqm_Height";
            c2.onkeyup = updateStats;
            var c3 = document.createElement('input');
            c3.style = cStyle;
            c3.placeholder = "Qty";
            c3.className = "combinedSqm_Qty";
            c3.onkeyup = updateStats;
            cab.appendChild(c1);
            cab.appendChild(c2);
            cab.appendChild(c3);
            combinedSqmContainer_rowsContainer.appendChild(cab);
        });

        combinedSqmContainer_display.innerHTML = "Stats";
        combinedSqmContainer_display.style = "background-color:#444;color:white;margin-top:10px;margin-left:10px;margin-right:10px;margin-bottom:10px;min-height:30px;min-width:260px;padding:5px;float:left;display:block;color:white;cursor: pointer;";
        var areas;
        var area_sqSide;
        var totalDescription;
        function updateStats() {
            var allWidth = combinedSqmContainer_rowsContainer.getElementsByClassName("combinedSqm_Width");
            var allHeight = combinedSqmContainer_rowsContainer.getElementsByClassName("combinedSqm_Height");
            var allQty = combinedSqmContainer_rowsContainer.getElementsByClassName("combinedSqm_Qty");
            areas = 0;
            var description = '';
            for(var w = 0; w < allWidth.length; w++) {
                var allWidthVal = allWidth[w].value;
                var allHeightVal = allHeight[w].value;
                var allQtyVal = allQty[w].value;
                areas += (allWidthVal / 1000) * (allHeightVal / 1000) * allQtyVal;
                description += "x" + allQtyVal + " @ " + allWidthVal + "mm x " + allHeightVal + "mm" + "\n";
            }
            var sqrtMeasures = (Math.sqrt(areas) * 1000).toFixed(2) + "mm x " + (Math.sqrt(areas) * 1000).toFixed(2) + "mm";
            area_sqSide = (Math.sqrt(areas) * 1000).toFixed(2);
            var statsText = "Stats" + "<br />" + areas.toFixed(2) + "m²" + "<br />" + sqrtMeasures;
            combinedSqmContainer_display.innerHTML = statsText;
            var statDescription = "Stats" + "\n" + areas.toFixed(2) + "m²" + "\n" + sqrtMeasures;
            totalDescription = statDescription + "\n\n" + description;
        }

        var populateButton = createButton("Populate", "width:60%;margin:0px;", populate);
        async function populate() {
            var productNo = parseFloat(populateProductN.value);
            await openPart(productNo, populatePartN.value);
            await setPartWidth(productNo, populatePartN.value, area_sqSide);
            await setPartHeight(productNo, populatePartN.value, area_sqSide);
            await setPartText(productNo, populatePartN.value, totalDescription);
            await savePart(productNo, populatePartN.value);
            Toast.notify("Done.", 3000, {position: "top-right"});
        }
        var populateProductN = createInput("P.No", null, "width:15%;margin:0px;height:24px", null);
        var populatePartN = createInput("Part", 1, "width:15%;margin:0px;height:24px", null);


        let draggablePopulator = createButton("Drag and Drop Over Part to Populate", "width:100%;margin:0px;", () => { }, null);
        draggablePopulator.draggable = true;
        draggablePopulator.addEventListener("dragstart", function(e) {
            //console.log(e.target);
        });

        this.onDrop = async function(e) {
            let dropOverElement = e.dropOverElement;
            if(!e) return;
            populateProductN.value = e.detail.productNo;
            populatePartN.value = e.detail.partNo;
            await populate();
        };
        document.removeEventListener("dropEvent", this.onDrop);
        document.addEventListener("dropEvent", this.onDrop);

        page.appendChild(combinedSqmContainer_display);
        page.appendChild(combinedSqmContainer_addBtn);
        page.appendChild(combinedSqmContainer_rowsContainer);

        this.footer.appendChild(draggablePopulator);


        //this.interval = setInterval(() => {this.tick();}, 1000 / 2);
    }

    hide() {
        if(this.onDrop) document.removeEventListener("dropEvent", this.onDrop);
        super.hide();
        //clearInterval(this.interval);
    }

    tick() {
        this.tickUpdate();
    }

    tickUpdate() {

    }
}
