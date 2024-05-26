class LnmMenu extends LHSMenuWindow {

    constructor(width, height, ID, windowTitle) {
        super(width, height, ID, windowTitle);
        this.addPages(1);
    }

    show() {
        super.show();

        var page = this.getPage(0);

        while(page.hasChildNodes()) {page.removeChild(page.lastChild);}
        while(this.footer.hasChildNodes()) {this.footer.removeChild(this.footer.lastChild);}

        var combinedLnmContainer_addBtn = document.createElement('button');
        var combinedLnmContainer_display = document.createElement('div');

        var combinedLnmContainer_rowsContainer = document.createElement("div");
        combinedLnmContainer_rowsContainer.style = "background-color:white;margin-top:5px;margin-left:0px;margin-right:0px;margin-bottom:0px;min-height:100px;max-height:600px;width:95%;padding:5px;float:left;display:block;color:white;cursor: pointer;border-style:none;overflow-y:scroll";

        combinedLnmContainer_addBtn.innerHTML = "Add Row";
        combinedLnmContainer_addBtn.style = "background-color:" + COLOUR.Blue + ";margin-top:0px;margin-left:10px;margin-right:0px;margin-bottom:0px;min-height:20px;min-width:120px;padding:5px;float:left;display:block;color:white;cursor: pointer;border-style:none;";
        combinedLnmContainer_addBtn.addEventListener("click", function() {
            var cab = document.createElement('div');
            cab.style = "background-color:" + COLOUR.Blue + ";margin-top:10px;margin-left:10px;margin-right:10px;margin-bottom:0px;min-height:30px;min-width:230px;padding:5px;float:left;display:block;color:white;cursor: pointer;";
            var cStyle = "margin-top:5px;margin-left:5px;margin-right:5px;margin-bottom:5px;min-height:10px;width:50px;padding:5px;float:left;display:block;color:black;";
            var c1 = document.createElement('input');
            c1.style = cStyle;
            c1.className = "combinedLnm_Length";
            c1.placeholder = "Length";
            c1.onkeyup = updateStats;
            var c3 = document.createElement('input');
            c3.style = cStyle;
            c3.placeholder = "Qty";
            c3.className = "combinedLnm_Qty";
            c3.onkeyup = updateStats;
            cab.appendChild(c1);
            cab.appendChild(c3);
            combinedLnmContainer_rowsContainer.appendChild(cab);
        });

        var lengths = 0;
        var description = '';
        var partText = '';
        function updateStats() {
            var allLength = combinedLnmContainer_rowsContainer.getElementsByClassName("combinedLnm_Length");
            var allQty = combinedLnmContainer_rowsContainer.getElementsByClassName("combinedLnm_Qty");
            partText = '';
            lengths = 0;
            description = '';
            for(var w = 0; w < allLength.length; w++) {
                var allLengthVal = allLength[w].value;
                var allQtyVal = allQty[w].value;
                lengths += allLengthVal * allQtyVal;
                partText += "x " + allQtyVal + " @ " + allLengthVal + "mm" + "\n";
            }
            partText += "\n" + "TOTAL: " + lengths + " ln mm";
            description = "Stats<br />" + lengths + " ln mm";
            combinedLnmContainer_display.innerHTML = "Stats<br />" + lengths + " ln mm";
        }

        combinedLnmContainer_display.innerHTML = "Stats";
        combinedLnmContainer_display.style = "background-color:#444;color:white;margin-top:10px;margin-left:10px;margin-right:10px;margin-bottom:10px;min-height:30px;min-width:260px;padding:5px;float:left;display:block;color:white;cursor: pointer;";

        var populateButton = createButton("Populate", "width:40%;margin:0px;", populate);
        async function populate() {
            var productNo = parseFloat(populateProductN.value);

            await openPart(productNo, populatePartN.value);
            await setPartWidth(productNo, populatePartN.value, lengths);
            await setPartText(productNo, populatePartN.value, partText);
            await savePart(productNo, populatePartN.value);
            Ordui.Alert("Done.");
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

        page.appendChild(combinedLnmContainer_display);
        page.appendChild(combinedLnmContainer_addBtn);
        page.appendChild(combinedLnmContainer_rowsContainer);

        this.footer.appendChild(draggablePopulator);
    }

    hide() {
        if(this.onDrop) document.removeEventListener("dropEvent", this.onDrop);
        super.hide();
    }

    tick() {
        this.tickUpdate();
    }

    tickUpdate() {

    }
}