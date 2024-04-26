class LEDMenu extends LHSMenuWindow {

    constructor(width, height, ID, windowTitle) {
        super(width, height, ID, windowTitle);
        this.addPages(1);
    }

    show() {

        super.show();
        let thisClass = this;

        var page = this.getPage(0);
        var footer = this.footer;

        while(page.hasChildNodes()) {page.removeChild(page.lastChild);}
        while(footer.hasChildNodes()) {footer.removeChild(footer.lastChild);}

        //this.sizeContainer = new Size(page, null);
        //this.LedContainer = new LED(page, null, function() {}, "LEDs");

        var fieldHR = document.createElement('hr');
        var productionMinsPerLED = 120 / (144);//2 hours for 2440 lightbox
        var distanceToOutsideBox = 0;
        var ledWidth = 66;
        var ledAllowanceW = 0;
        var ledAllowanceH = 0;
        var numberRows = 0;
        var numberColumns = 0;
        var totalLEDs = 0;
        var totalAmp = 0;

        var LEDBuilderContainer_Sub = document.createElement("div");
        LEDBuilderContainer_Sub.style = STYLE.BillboardMenus;

        //********************************************//
        //                  WIDTH
        //********************************************//
        var fieldBoxWidth = createInput_Infield("Box Width", null, "width:30%", LEDUpdate, LEDBuilderContainer_Sub, true, 100);

        //********************************************//
        //                  HEIGHT
        //********************************************//
        var fieldBoxHeight = createInput_Infield("Box Height", null, "width:30%", LEDUpdate, LEDBuilderContainer_Sub, true, 100);

        //********************************************//
        //                  DEPTH
        //********************************************//
        var fieldBoxDepth = createInput_Infield("Depth to Face (Overall)", null, "width:30%", LEDUpdate, LEDBuilderContainer_Sub, true, 10);

        //********************************************//
        //                  DOUBLE-SIDED
        //********************************************//
        var fieldIsDoubleSided = createCheckbox_Infield('Double-sided', null, "width:30%;margin-right:60%;", LEDUpdate, LEDBuilderContainer_Sub);

        //********************************************//
        //                  LED WATT
        //********************************************//
        var fieldLEDWatt = createDropdown_Infield("LED Brightness", 0, "width:40%",
            [createDropdownOption("1.08w (Standard Brightness)", "1.08"),
            createDropdownOption("1.50w (Premium Brightness)", "1.50")], LEDUpdate, LEDBuilderContainer_Sub);

        //********************************************//
        //                  LED COLOUR
        //********************************************//
        var fieldLEDColour = createDropdown_Infield("LED Colour", 1, "width:40%",
            [createDropdownOption("3000K", "3000K"),
            createDropdownOption("6500K", "6500K"),
            createDropdownOption("10000K", "10000K"),
            createDropdownOption("Red", "Red"),
            createDropdownOption("Green", "Green"),
            createDropdownOption("Blue", "Blue"),
            createDropdownOption("RGB", "RGB")], LEDUpdate, LEDBuilderContainer_Sub);

        //********************************************//
        //                  LED COLOUR DEPICTION
        //********************************************//
        var fieldLEDColourDepiction = document.createElement('div');
        fieldLEDColourDepiction.style = STYLE.Depictions;
        fieldLEDColourDepiction.style.width = "10%";
        LEDBuilderContainer_Sub.appendChild(fieldLEDColourDepiction);

        //********************************************//
        //                  LED LOADING
        //********************************************//
        var fieldLoading = createInput_Infield('Transformer Loading(%)', 80, "width:30%", LEDUpdate, LEDBuilderContainer_Sub, false, 1);

        //********************************************//
        //                  LED AMP ALLOWANCE
        //********************************************//
        var fieldAmpAllowance = createInput_Infield('Amperage Allowance', 0, "width:30%", LEDUpdate, LEDBuilderContainer_Sub, false, 1);

        //********************************************//
        //                  LED VOLTAGE
        //********************************************//
        var fieldVoltage = createDropdown_Infield("Voltage", 0, "width:30%",
            [createDropdownOption("12", "12"),
            createDropdownOption("24", "24")], LEDUpdate, LEDBuilderContainer_Sub);

        //********************************************//
        //                  DIMMABLE
        //********************************************//
        var fieldDimmable = createCheckbox_Infield('Dimmable', null, "width:30%;margin-right:60%;", LEDUpdate, LEDBuilderContainer_Sub);

        page.appendChild(LEDBuilderContainer_Sub);

        //********************************************//
        //                  LED SUMMARY
        //********************************************//
        var fieldSummary = document.createElement('p');
        fieldSummary.style = "display: block; float: left; width: 95%; background-color:" + COLOUR.DarkGrey + "; color:white; min-height: 50px; margin: 10px; box-shadow: rgba(0, 0, 0, 0.3) 0px 4px 8px 0px;padding:5px;";
        page.appendChild(fieldSummary);

        var fieldCreateLEDProductNew = createButton("Create New Product", "margin:0px;width:40%", () => {createLEDProduct(false);});
        footer.appendChild(fieldCreateLEDProductNew);
        var fieldCreateLEDProductExisting = createButton("Create Product In Existing", "margin:0px;width:40%", () => {createLEDProduct(true);});
        //footer.appendChild(fieldCreateLEDProductExisting);
        var input_createInExisting = createInput("P.No", null, "width:18%;margin:0px;box-shadow:0px;height:23px;", null);
        //footer.appendChild(input_createInExisting);

        let draggablePopulator = createButton("Drag and Drop Over Part to Populate", "width:60%;margin:0px;", () => { }, null);
        draggablePopulator.draggable = true;
        draggablePopulator.addEventListener("dragstart", function(e) {
            //console.log(e.target);
        });

        this.onDrop = async function(e) {
            let dropOverElement = e.dropOverElement;
            if(!e) return;
            input_createInExisting.value = e.detail.productNo;
            //populatePartN.value = e.detail.partNo;
            await createLEDProduct(true);
        };
        console.log("in");

        document.removeEventListener("dropEvent", this.onDrop);
        document.addEventListener("dropEvent", this.onDrop);
        footer.appendChild(draggablePopulator);

        function LEDUpdate() {
            var tempDTF = 0;
            if(fieldIsDoubleSided[1].checked) {
                tempDTF = parseFloat(fieldBoxDepth[1].value) / 2;//fieldVoltage[1].value
            } else {
                tempDTF = parseFloat(fieldBoxDepth[1].value);
            }
            distanceToOutsideBox = parseFloat(tempDTF) / 2;
            numberRows = Math.ceil(((parseFloat(fieldBoxHeight[1].value) - 2 * distanceToOutsideBox) / (tempDTF + ledAllowanceH)) + 1);
            numberColumns = Math.ceil((((parseFloat(fieldBoxWidth[1].value) - 2 * distanceToOutsideBox) - ledWidth) / (tempDTF + ledAllowanceW)) + 1);
            totalLEDs = numberRows * numberColumns * (fieldIsDoubleSided[1].checked ? 2 : 1);
            totalAmp = ((totalLEDs * (parseFloat(fieldLEDWatt[1].value.replace(/[^0-9\.]+/g, "")) / (fieldLoading[1].value / 100))) / fieldVoltage[1].value);
            var transformerName = getCheapestTransformer(totalAmp, fieldAmpAllowance[1].value, fieldDimmable[1].checked, fieldVoltage[1].value).name;
            var transformerQty = getCheapestTransformer(totalAmp, fieldAmpAllowance[1].value, fieldDimmable[1].checked, fieldVoltage[1].value).i_totalComputedQuantity;
            fieldSummary.innerHTML = "Total LEDs: " + totalLEDs + "<br> Total Amp: " + totalAmp + " @ " + fieldLoading[1].value + "% loading" + "<br> Best Transformer: (x" + transformerQty + ") " + transformerName;

            if(fieldLEDColour[1].selectedIndex == 0) {fieldLEDColourDepiction.style.background = "linear-gradient(to right, #FFFF83 0%, #FFFF83 100%)";}
            else if(fieldLEDColour[1].selectedIndex == 1) {fieldLEDColourDepiction.style.background = "linear-gradient(to right, white 0%, white 100%)";}
            else if(fieldLEDColour[1].selectedIndex == 2) {fieldLEDColourDepiction.style.background = "linear-gradient(to right, #97D3FF 0%, #97D3FF 100%)";}
            else if(fieldLEDColour[1].selectedIndex == 3) {fieldLEDColourDepiction.style.background = "linear-gradient(to right, red 0%, red 100%)";}
            else if(fieldLEDColour[1].selectedIndex == 4) {fieldLEDColourDepiction.style.background = "linear-gradient(to right, green 0%, green 100%)";}
            else if(fieldLEDColour[1].selectedIndex == 5) {fieldLEDColourDepiction.style.background = "linear-gradient(to right, blue 0%, blue 100%)";}
            else if(fieldLEDColour[1].selectedIndex == 6) {fieldLEDColourDepiction.style.background = "linear-gradient(to right, red 0%, green 50%, blue 100%)";}
        }

        async function createLEDProduct(inExisting = true) {
            thisClass.minimize();

            let productNo = 0, partIndex = 0;

            if(inExisting) {
                if(input_createInExisting.value == "") {
                    alert("Product Number must not be empty");
                    return;
                } else {
                    productNo = parseFloat(input_createInExisting.value);
                }
                partIndex = getNumPartsInProduct(productNo);
            } else {
                await AddBlankProduct();
                productNo = getNumProducts();
                await setProductName(productNo, "LED Panels");
            }

            if(totalLEDs != null) {
                //ACM
                await q_AddPart_DimensionWH(productNo, partIndex, true, ACMLookup["Standard White Gloss"], fieldIsDoubleSided[1].checked ? 2 : 1, fieldBoxWidth[1].value, fieldBoxHeight[1].value, "[LED] ACM Panel",
                    false);
                partIndex++;

                //LED
                var knownStartingName = "LED Module - " + fieldLEDColour[1].value + " " + fieldLEDWatt[1].value + "W";
                var fullName = $.grep(predefinedParts_Name_Id, function(obj) {return obj.key.startsWith(knownStartingName);})[0].key;
                await AddPart(fullName, productNo);
                partIndex++;
                await setPartQty(productNo, partIndex, totalLEDs);
                await setPartDescription(productNo, partIndex, '[LED] ' + knownStartingName);
                await savePart(productNo, partIndex);

                //TRANSFORMER
                var transformerName = getCheapestTransformer(totalAmp, fieldAmpAllowance[1].value, fieldDimmable[1].checked, fieldVoltage[1].value).name;
                var transformerQty = getCheapestTransformer(totalAmp, fieldAmpAllowance[1].value, fieldDimmable[1].checked, fieldVoltage[1].value).i_totalComputedQuantity;
                await AddPart(transformerName, productNo);
                partIndex++;
                await setPartQty(productNo, partIndex, transformerQty);
                await setPartDescription(productNo, partIndex, '[LED] ' + transformerName);
                await savePart(productNo, partIndex);

                //PRODUCTION
                await AddPart("Production (ea)", productNo);
                partIndex++;
                var ledMins = roundNumber(productionMinsPerLED * totalLEDs, 2);
                await setProductionTime(productNo, partIndex, ledMins);
                await setPartDescription(productNo, partIndex, "[LED] Production @ (" + (60 / productionMinsPerLED) + " LED/h) = " + ledMins + "mins");
                await savePart(productNo, partIndex);


            }
            if(!inExisting) {
                await setProductSummary(productNo, "<div>LED light panels</div><div><ul><li>Single-Sided<br></li><li>6500K (Cool White) Bright LED Lighting</li><li>Outdoor use<br></li></ul></div><div>Includes supply of transformers and connectors.</div><div>Install price not included - see install item below if applicable.</div><div>Final connection to mains to be done by licenced electrician - see other information below.</div>");
            }
            Ordui.Alert("Done.");
        }
    }

    hide() {
        if(this.onDrop) document.removeEventListener("dropEvent", this.onDrop);

        super.hide();
    }

    tick() {
        super.tick();
    }
}
