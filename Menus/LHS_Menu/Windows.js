class WindowMenu extends LHSMenuWindow {
    #rows = [
        /*
        {
            uniqueID: null,
            artworkObject: null,
        }
        */
    ];

    constructor(width, height, ID, windowTitle) {
        super(width, height, ID, windowTitle);
        this.addPages(1);
        this.doesTick = false;
    }

    show() {
        super.show();

        var page = this.getPage(0);
        var footer = this.footer;

        while(page.hasChildNodes()) {page.removeChild(page.lastChild);}
        while(footer.hasChildNodes()) {footer.removeChild(footer.lastChild);}

        this.createContent();
    }

    createContent() {
        var page = this.getPage(0);
        var footer = this.footer;
        let thisClass = this;
        var windowContainer_addBtn = createButton("Add Row", "margin-top:6px", addRow);

        function addRow() {
            let uniqueRowID = "ROW-" + generateUniqueID();

            var row = document.createElement('div');
            row.style = STYLE.BillboardMenus;
            row.id = "windowField_Row";
            windowContainer_rowsContainer.appendChild(row);

            var deleteRowButton = createButton("X", "float:left;width:10%;margin-left:90%;", () => {
                console.log(thisClass.#rows);
                for(let i = 0; i < thisClass.#rows.length; i++) {
                    if(thisClass.#rows[i].uniqueID === uniqueRowID) {
                        thisClass.#rows.splice(i, 1);
                        break;
                    }
                }
                console.log(thisClass.#rows);
                $(row).remove();
            });
            row.appendChild(deleteRowButton);

            var vinylType = createDropdown_Infield("Type", 0, "width:47%",
                [createDropdownOption("Whiteback", "Whiteback"),
                createDropdownOption("Greyback", "Greyback"),
                createDropdownOption("Oneway Vision (Laminated)", "Oneway Vision (Laminated)"),
                createDropdownOption("Oneway Vision (Un-Laminated)", "Oneway Vision (Un-Laminated)"),
                createDropdownOption("Whiteback Reverse (Inside Apply)", "Whiteback Reverse (Inside Apply)"),
                createDropdownOption("Frosting (Blank)", "Frosting (Blank)"),
                createDropdownOption("Frosting (Printed)", "Frosting (Printed)")], updateCalculatedFields, row);
            vinylType[1].id = "windowField_VinylType";
            var cuttingType = createDropdown_Infield("Cutting Type", 0, "width:47%",
                [createDropdownOption("Rectangular", "Rectangular"),
                createDropdownOption("Circular or Plotted 1-piece", "Circular or Plotted 1-piece"),
                createDropdownOption("Cut Lettering or Intracut", "Cut Lettering or Intracut")], updateCalculatedFields, row);
            cuttingType[1].id = "windowField_CuttingType";

            var production = createInputCalculated_Infield("Production (1 Person $135/h)", 0, "width:47%", null, true, row);
            production[1].id = "windowField_Production";
            var install = createInputCalculated_Infield("Install (2 Person $270/h)", 0, "width:47%", null, true, row);
            install[1].id = "windowField_Install";

            var setup = createCheckbox_Infield("Include Setup/Travel", false, "width:47%;margin-right:47%;", function() {
                if(setup[1].checked) {
                    travelMinutes[0].style.display = "block";
                    travelRate[0].style.display = "block";
                } else {
                    travelMinutes[0].style.display = "none";
                    travelRate[0].style.display = "none";
                }
            }, row);
            setup[1].id = "windowField_Setup";
            var travelMinutes = createInput_Infield('Travel Minutes', null, "margin-left:50px;width:100px;display:none", null, row, false, 10);
            travelMinutes[1].id = "windowField_TravelMinutes";

            var travelRate = createDropdown_Infield("Travel Rate", 1, null, [], () => { }, row);
            travelRate[1].id;
            let dropdownOptions = [];
            let modifierOptions = getModifierDropdown_Name_Price_Cost("Travel IH (ea)");
            modifierOptions.forEach((element) => {
                dropdownOptions.push(createDropdownOption(element.Name, element.Name));
            });
            if(dropdownOptions != null) {
                dropdownOptions.forEach((item) => {
                    travelRate[1].add(item);
                });
            }

            let artwork = new Artwork(row, null, function() { });

            var addSizeGroupButton = createButton("+", "width:96%", addSizeGroup);
            row.appendChild(addSizeGroupButton);

            addSizeGroup();
            function addSizeGroup() {
                var qty = createInput_Infield("Quantity", null, "width:25%", updateCalculatedFields, row, true, 1);
                qty[1].id = "windowField_Qty";
                var width = createInput_Infield("Width", null, "width:25%", updateCalculatedFields, row, true, 100);
                width[1].id = "windowField_Width";
                var height = createInput_Infield("Height", null, "width:25%", updateCalculatedFields, row, true, 100);
                height[1].id = "windowField_Height";
                var deleteButton = createButton("X", "width:10%;", deleteThisGroup);
                row.appendChild(deleteButton);

                function deleteThisGroup() {
                    $(qty).remove();
                    $(width).remove();
                    $(height).remove();
                    $(deleteButton).remove();
                    updateCalculatedFields();
                }
            }

            function updateCalculatedFields() {
                console.log(row);
                var productionTime = 0;
                var installTime = 0;
                var quantitys = row.querySelectorAll("#windowField_Qty");
                var widths = row.querySelectorAll("#windowField_Width");
                var heights = row.querySelectorAll("#windowField_Height");
                for(var l = 0; l < quantitys.length; l++) {
                    var isRectangular = (cuttingType[1].value == "Rectangular" ? true : false);
                    var requiresLaminating = (vinylType[1].value == "Oneway Vision (Un-Laminated)" ||
                        vinylType[1].value == "Oneway Vision (Un-Laminated)" ||
                        vinylType[1].value == "Frosting (Blank)" ||
                        vinylType[1].value == "Frosting (Printed)" ? false : true);
                    var requiresPlotting = (cuttingType[1].value == "Rectangular" ? false : true);
                    productionTime += getProductionTime(quantitys[l].value, widths[l].value, heights[l].value, isRectangular, requiresLaminating, !requiresPlotting, requiresPlotting, requiresPlotting);
                    installTime += getInstallTime(quantitys[l].value, widths[l].value, heights[l].value);
                }
                $(production[2]).val(productionTime).change();
                $(install[2]).val(installTime).change();
            }

            thisClass.#rows.push({
                uniqueID: uniqueRowID,
                artworkObject: artwork
            });
            console.log(thisClass.#rows);
        }

        var windowContainer_rowsContainer = document.createElement("div");
        windowContainer_rowsContainer.style = "background-color:white;margin-top:5px;margin-left:0px;margin-right:0px;margin-bottom:0px;min-height:500px;max-height:700px;width:98%;padding:5px;float:left;display:block;color:white;cursor: pointer;border-style:none;overflow-y:scroll;background-color:" + COLOUR.MediumGrey + ";";

        var createProductsButton = createButton("Create Multiple Products", "width:50%;margin:0px;", function() {create(true);});
        var createProductsButton2 = createButton("Create Merged Product", "width:50%;margin:0px;", function() {create(false);});
        async function create(multipleProductsTF) {
            thisClass.minimize();
            var rows = page.querySelectorAll("#windowField_Row");
            for(var r = 0; r < rows.length; r++) {
                var productWording = '';
                //if 'spread into multiple products' ticked then
                if(multipleProductsTF) {
                    await AddBlankProduct();
                    var productNo = getNumProducts();
                    await setProductName(productNo, "WINDOW GRAPHICS");
                    var partNo = 0;
                } else {
                    if(r == 0) {
                        await AddBlankProduct();
                        var productNo = getNumProducts();
                        await setProductName(productNo, "WINDOW GRAPHICS");
                        var partNo = 0;
                    }
                }

                var dimensionDescription = '';
                var totalSqm = 0;

                var quantitys = rows[r].querySelectorAll("#windowField_Qty");
                var widths = rows[r].querySelectorAll("#windowField_Width");
                var heights = rows[r].querySelectorAll("#windowField_Height");
                for(var l = 0; l < quantitys.length; l++) {
                    var rowSqm = parseFloat(quantitys[l].value) *
                        (parseFloat(widths[l].value) / 1000) *
                        (parseFloat(heights[l].value) / 1000);
                    totalSqm += rowSqm;
                    dimensionDescription += "x" + quantitys[l].value + " @ " + widths[l].value + "mmW " + "x " + heights[l].value + "mmH" + "\n";
                }

                let mergedAverageSqrt = Math.sqrt(totalSqm);
                let mergedAverageSqrt_mm = mergedAverageSqrt * 1000;

                var cuttingType = rows[r].querySelector("#windowField_CuttingType");

                //----------------CREATE VINYL--------------//
                var vinylType = rows[r].querySelector("#windowField_VinylType");
                switch(vinylType.value) {
                    case "Whiteback":
                        await q_AddPart_DimensionWH(productNo, partNo, true, VinylLookup["Whiteback"], 1, roundNumber(mergedAverageSqrt_mm, 2), roundNumber(mergedAverageSqrt_mm, 2), VinylLookup["Whiteback"], dimensionDescription, true);
                        partNo++;
                        await q_AddPart_DimensionWH(productNo, partNo, true, LaminateLookup["Gloss"], 1, roundNumber(mergedAverageSqrt_mm, 2), roundNumber(mergedAverageSqrt_mm, 2), LaminateLookup["Gloss"], dimensionDescription, true);
                        partNo++;
                        productWording = "Window Graphics" +
                            "<ul>" +
                            "<li>" + "TYPE: Digitally printed Whiteback Vinyl Laminated in gloss" + "</li>" +
                            "<li>" + "CUTTING TYPE: " + cuttingType.value + "</li>" +
                            "<br>" +
                            "</ul>" +
                            "Includes Install";
                        break;
                    case "Whiteback Reverse (Inside Apply)":
                        await q_AddPart_DimensionWH(productNo, partNo, true, VinylLookup["Clear"], 1, roundNumber(mergedAverageSqrt_mm, 2), roundNumber(mergedAverageSqrt_mm, 2), VinylLookup["Clear"], dimensionDescription, true);
                        partNo++;
                        await q_AddPart_DimensionWH(productNo, partNo, true, VinylLookup["Whiteback"], 1, roundNumber(mergedAverageSqrt_mm, 2), roundNumber(mergedAverageSqrt_mm, 2), VinylLookup["Whiteback"], dimensionDescription, true);
                        partNo++;
                        productWording = "Window Graphics" +
                            "<ul>" +
                            "<li>" + "TYPE: Digitally printed Clear Vinyl Laminated in White (for Inside Apply)" + "</li>" +
                            "<li>" + "CUTTING TYPE: " + cuttingType.value + "</li>" +
                            "<br>" +
                            "</ul>" +
                            "Includes Install";
                        break;
                    case "Greyback":
                        await q_AddPart_DimensionWH(productNo, partNo, true, VinylLookup["Blockout"], 1, roundNumber(mergedAverageSqrt_mm, 2), roundNumber(mergedAverageSqrt_mm, 2), VinylLookup["Blockout"], dimensionDescription, true);
                        partNo++;
                        await q_AddPart_DimensionWH(productNo, partNo, true, LaminateLookup["Gloss"], 1, roundNumber(mergedAverageSqrt_mm, 2), roundNumber(mergedAverageSqrt_mm, 2), LaminateLookup["Gloss"], dimensionDescription, true);
                        partNo++;
                        productWording = "Window Graphics" +
                            "<ul>" +
                            "<li>" + "TYPE: Digitally printed Greyback Vinyl Laminated in gloss" + "</li>" +
                            "<li>" + "CUTTING TYPE: " + cuttingType.value + "</li>" +
                            "<br>" +
                            "</ul>" +
                            "Includes Install";
                        break;
                    case "Oneway Vision (Laminated)":
                        await q_AddPart_DimensionWH(productNo, partNo, true, VinylLookup["Oneway Shopfront"], 1, roundNumber(mergedAverageSqrt_mm, 2), roundNumber(mergedAverageSqrt_mm, 2), VinylLookup["Oneway Shopfront"], dimensionDescription, true);
                        partNo++;
                        await q_AddPart_DimensionWH(productNo, partNo, true, LaminateLookup["3m Gloss (Standard)"], 1, roundNumber(mergedAverageSqrt_mm, 2), roundNumber(mergedAverageSqrt_mm, 2), LaminateLookup["3m Gloss (Standard)"], dimensionDescription, true);
                        partNo++;
                        productWording = "Window Graphics" +
                            "<ul>" +
                            "<li>" + "TYPE: Digitally printed Oneway Vinyl Laminated in gloss" + "</li>" +
                            "<li>" + "CUTTING TYPE: " + cuttingType.value + "</li>" +
                            "<br>" +
                            "</ul>" +
                            "Includes Install";
                        break;
                    case "Oneway Vision (Un-Laminated)":
                        await q_AddPart_DimensionWH(productNo, partNo, true, VinylLookup["Oneway Shopfront"], 1, roundNumber(mergedAverageSqrt_mm, 2), roundNumber(mergedAverageSqrt_mm, 2), VinylLookup["Oneway Shopfront"], dimensionDescription, true);
                        partNo++;
                        productWording = "Window Graphics" +
                            "<ul>" +
                            "<li>" + "TYPE: Digitally printed Oneway Vinyl, no laminate" + "</li>" +
                            "<li>" + "CUTTING TYPE: " + cuttingType.value + "</li>" +
                            "<br>" +
                            "</ul>" +
                            "Includes Install";
                        break;
                    case "Frosting (Blank)":
                        await q_AddPart_DimensionWH(productNo, partNo, true, VinylLookup["Frosting"], 1, roundNumber(mergedAverageSqrt_mm, 2), roundNumber(mergedAverageSqrt_mm, 2), VinylLookup["Frosting"], dimensionDescription, true);
                        partNo++;
                        productWording = "Window Graphics" +
                            "<ul>" +
                            "<li>" + "TYPE: Blank Light-silver Frosting" + "</li>" +
                            "<li>" + "CUTTING TYPE: " + cuttingType.value + "</li>" +
                            "<br>" +
                            "</ul>" +
                            "Includes Install";
                        break;
                    case "Frosting (Printed)":
                        await q_AddPart_DimensionWH(productNo, partNo, true, VinylLookup["Frosting Printed"], 1, roundNumber(mergedAverageSqrt_mm, 2), roundNumber(mergedAverageSqrt_mm, 2), VinylLookup["Frosting Printed"], dimensionDescription, true);
                        partNo++;
                        productWording = "Window Graphics" +
                            "<ul>" +
                            "<li>" + "TYPE: Digitally-printed Light-silver Frosting" + "</li>" +
                            "<li>" + "CUTTING TYPE: " + cuttingType.value + "</li>" +
                            "<br>" +
                            "</ul>" +
                            "Includes Install";
                        break;
                    default:
                        alert("error");
                }


                //--------------CREATE APP-TAPE---------------//
                if(cuttingType.value == "Cut Lettering or Intracut") {
                    await q_AddPart_DimensionWH(productNo, partNo, true, AppTapeLookup["Medium Tack"], 1, roundNumber(mergedAverageSqrt_mm, 2), roundNumber(mergedAverageSqrt_mm, 2), AppTapeLookup["Medium Tack"], dimensionDescription, true);
                    partNo++;
                    await GroupParts(productNo);
                } else {
                    await GroupParts(productNo);
                }

                //--------------CREATE PRODUCTION---------------//
                var production = rows[r].querySelector("#windowField_Production");
                await AddPart("Production (ea)", productNo);
                partNo++;
                await setPartQty(productNo, partNo, 1);
                await setPartDescription(productNo, partNo, "Production");
                await setProductionTime(productNo, partNo, parseFloat(production.value));
                await savePart(productNo, partNo);

                //-------------CREATE ARTWORK------------------//
                partNo = await thisClass.#rows[r].artworkObject.Create(productNo, partNo);


                //-------------CREATE INSTALL------------------//
                var install = rows[r].querySelector("#windowField_Install");
                var setup = rows[r].querySelector("#windowField_Setup");
                var travelMinutes = rows[r].querySelector("#windowField_TravelMinutes");
                var travelRate = rows[r].querySelector("#windowField_TravelRate");
                await AddPart("Install - IH (ea)", productNo);
                partNo++;
                await setPartQty(productNo, partNo, 1);
                await setPartDescription(productNo, partNo, "Install");
                await setInstallTimeEa(productNo, partNo, parseFloat(install.value));
                await setInstallPartTypeEa(productNo, partNo, InstallLookup["2P $270"]);
                if(setup.checked) {
                    await setTravelTimeEa(productNo, partNo, travelMinutes.value);
                    await setTravelTypeEa(productNo, partNo, travelRate.value);
                    await setPartDescription(productNo, partNo, "Install + Setup/Travel");
                }
                await savePart(productNo, partNo);

                await setProductSummary(productNo, productWording);
                /*
    
                */
            }

            Toast.notify("Done.", 3000, {position: "top-right"});
        }

        page.appendChild(windowContainer_addBtn);
        page.appendChild(windowContainer_rowsContainer);
        footer.appendChild(createProductsButton);
        footer.appendChild(createProductsButton2);
    }

    hide() {
        super.hide();
    }

    tick() {
        this.tickUpdate();
    }

    tickUpdate() {

    }
}



/*
function createWindowContainer() {
    var windowContainer;
    windowContainer = document.createElement('div');
    windowContainer.id = "windowContainer";

    document.getElementsByTagName('body')[0].appendChild(windowContainer);

    windowContainer.style = "z-index:100;background-color:" + COLOUR.MediumGrey + ";color:white;width:600px;min-height:400px;position:fixed;top:82px;left:" + menuXOffset + "px;display:none;overflow:auto;";
}*/
/*function showWindowContainer() {
    
}
function hideWindowContainer() {
    windowContainer.style.display = "none";

    while(windowContainer.childElementCount > 0) {windowContainer.removeChild(windowContainer.lastChild);}
    maximizeWindowContainer();
}
function minimizeWindowContainer() {
    windowContainer.style.width = "100px";
}
function maximizeWindowContainer() {
    windowContainer.style.width = "600px";
}*/
