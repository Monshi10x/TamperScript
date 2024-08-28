class LightboxMenu extends LHSMenuWindow {

    constructor(width, height, ID, windowTitle) {
        super(width, height, ID, windowTitle);
        this.addPages(1);
    }

    show() {
        super.show();
        var thisClass = this;

        var page = this.getPage(0);

        while(page.hasChildNodes()) {page.removeChild(page.lastChild);}
        while(this.footer.hasChildNodes()) {this.footer.removeChild(this.footer.lastChild);}

        var lightboxContentContainer = document.createElement('div');
        lightboxContentContainer.style = "z-index: 100; background-color: " + COLOUR.MediumGrey + "; color: white; width: 100%;min-height: 400px; max-height: 700px; overflow-y: scroll;";
        page.appendChild(lightboxContentContainer);

        var distanceToOutsideBox = 0;
        var ledWidth = 66;
        var ledAllowanceW = 0;
        var ledAllowanceH = 0;
        var numberRows = 0;
        var numberColumns = 0;
        var totalLEDs = 0;
        var totalAmp = 0;
        var productionMinsPerLED = 120 / (144);//2 hours for 2440 lightbox

        var faceToBoxReductionAmount = 10;
        var supportSpacing = 600;
        var supportSpacing_ReinforcedFrame = 1000;
        var supportReductionAmount = 4;
        var supportOrientation = 'vertical';

        var spraying_2pac_LitrePerM2 = 0.5;
        var spray_MinsPerLnm = 1.5;

        var ACMReductionAmount = 4;
        var ACMReductionAmount_IfReinforced = 45 * 2;

        let totalQuantity = new TotalQuantity(lightboxContentContainer, null, lightboxUpdate);

        var c1 = document.createElement('div');
        c1.style = STYLE.BillboardMenus;
        var fieldMakeInhouse = createCheckbox_Infield("Make Inhouse", true, "width:96%", lightboxUpdate, c1);

        var fieldMakeInhouse_OutsourceOption_Cost = createInput_Infield('Supplier Cost', null, "display:none;margin-right:500px;margin-left:50px;", lightboxUpdate, c1);

        var fieldMakeInhouse_OutsourceOption_Markup = createInput_Infield('Supplier Markup', null, "display:none;margin-right:500px;margin-left:50px;", lightboxUpdate, c1);
        lightboxContentContainer.appendChild(c1);

        var c2 = document.createElement('div');
        c2.style = STYLE.BillboardMenus;

        var fieldBoxWidth = createInput_Infield("Box Width", null, "width:47%", lightboxUpdate, c2, true, 100, {postfix: "mm"});
        fieldBoxWidth.id = "LightboxBuilder_BoxWidth";

        var fieldBoxHeight = createInput_Infield("Box Height", null, "width:47%", lightboxUpdate, c2, true, 100, {postfix: "mm"});
        fieldBoxHeight.id = "LightboxBuilder_BoxHeight";

        var fieldBoxDepth = createDropdown_Infield('Box Depth', 0, "margin-right:500px;width:47%;",
            [createOptGroup("Single-sided", [createDropdownOption("150 (SS Acrylic)", "150"),
            createDropdownOption("175 (SS Flexface)      *Outsourced", "175")]),
            createOptGroup("Double-sided", [createDropdownOption("300 (DS Acrylic)", "300"),
            createDropdownOption("350 (DS Flexface)      *Outsourced", "350")])], lightboxUpdate, c2);

        var fieldIsDoubleSided = createCheckbox_Infield("Double-sided", null, "margin-right:500px;border:2px solid #ccc;background-color:#ededed;width:47%", lightboxUpdate, c2);
        fieldIsDoubleSided.disabled = true;

        var fieldIsDoubleSidedReinforcementRequired = createCheckbox_Infield('Requires Central Reinforcing Frame', null, "display:none;margin-left:50px;margin-right:500px;width:47%",
            function() {
                if(fieldIsDoubleSidedReinforcementRequired[1].checked) {
                    fieldIsDoubleSidedReinforcementMaterial[0].disabled = false;
                    fieldIsDoubleSidedReinforcementMaterial[0].style.display = "block";
                } else {
                    fieldIsDoubleSidedReinforcementMaterial[0].disabled = true;
                    fieldIsDoubleSidedReinforcementMaterial[0].style.display = "none";
                }
                lightboxUpdate();
            }, c2);

        var moOptions = [];
        for(var mo = 0; mo < RHSList[2].length - 1; mo++) {
            moOptions[mo] = document.createElement("option");
            moOptions[mo].text = RHSList[2][mo + 1];
        }
        var fieldIsDoubleSidedReinforcementMaterial = createDropdown_Infield("Aluminium RHS Material", 12, "display:none;margin-left:50px;margin-right:1000px;width:47%", moOptions, lightboxUpdate, c2);

        lightboxContentContainer.appendChild(c2);

        var c3 = document.createElement('div');
        c3.style = STYLE.BillboardMenus;

        var fieldFaceTypeOptions = [createDropdownOption("Acrylic (Printed Translucent with Laminate)", "4.5mm Opal Acrylic with Printed Translucent Vinyl and Laminate"),
        createDropdownOption("Acrylic (Blank)", "Acrylic (Blank)"),
        createDropdownOption("none (Acrylic type)", "none (Acrylic type)"),
        createDropdownOption("ACM Push-through Type [NOT READY]", "ACM Push-through Type"),
        createDropdownOption("ACM Intracut Type [NOT READY]", "ACM Intracut Type"),
        createDropdownOption("Flexface Banner", "Flexface Banner"),
        createDropdownOption("none (Flexface type)", "none (Flexface type)")];
        var fieldFaceType = createDropdown_Infield("Face Type", 0, "margin-right:500px;width:96%", fieldFaceTypeOptions,
            function() {
                if(fieldFaceType[1].value == "ACM Push-through Type" || fieldFaceType[1].value == "ACM Intracut Type") {
                    fieldFaceType_FaceVinylRequired[0].disabled = false;
                    fieldFaceType_FaceVinylRequired[0].style.display = "block";
                    fieldFaceType_LetterVinylRequired[0].disabled = false;
                    fieldFaceType_LetterVinylRequired[0].style.display = "block";
                    showRouterBuilder(emptyContainerForRouterBuilder);
                    //showRouterBuilder();
                } else {
                    fieldFaceType_FaceVinylRequired[0].disabled = true;
                    fieldFaceType_FaceVinylRequired[0].style.display = "none";
                    fieldFaceType_LetterVinylRequired[0].disabled = true;
                    fieldFaceType_LetterVinylRequired[0].style.display = "none";
                    hideRouterBuilder();
                }
                lightboxUpdate();
            }, c3
        );

        var fieldFaceType_FaceVinylRequired = createCheckbox_Infield('Face Requires Vinyl', null, "display:none;margin-left:50px;margin-right:500px;width:47%", lightboxUpdate, c3);

        var fieldFaceType_LetterVinylRequired = createCheckbox_Infield('Letters Require Vinyl', null, "display:none;margin-left:50px;margin-right:500px;width:47%", lightboxUpdate, c3);

        var emptyContainerForRouterBuilder = document.createElement('div');
        emptyContainerForRouterBuilder.style = "width:100%;display:block;float:left";
        c3.appendChild(emptyContainerForRouterBuilder);


        var fieldSprayType = createDropdown_Infield("Spray Type", 0, "width:30%",
            [createDropdownOption("Powdercoat", "Powdercoat"),
            createDropdownOption("2pac", "2pac"),
            createDropdownOption("No Painting", "No Painting")], lightboxUpdate, c3);

        var fieldSprayFinish = createDropdown_Infield("Spray Finish", 0, "width:30%",
            [createDropdownOption("Gloss", "Gloss"),
            createDropdownOption("Satin", "Satin"),
            createDropdownOption("Matte", "Matte")], lightboxUpdate, c3);

        var fieldSprayColour = createInput_Infield("Spray Colour", null, "width:30%", lightboxUpdate, c3);

        var fieldLightboxShape = createDropdown_Infield("Lightbox Shape", 0, "width:47%",
            [createDropdownOption("Rectangle or Square", "Rectangle or Square"),
            createDropdownOption("Circular *Not Supported", "Circular *Not Supported")], lightboxUpdate, c3);

        var fieldMountingType = createDropdown_Infield("Mounting Type", 0, "width:47%",
            [createDropdownOption("Back Mounted", "Back Mounted"),
            createDropdownOption("Bottom Mounted", "Bottom Mounted"),
            createDropdownOption("Side Mounted", "Side Mounted"),
            createDropdownOption("Top Mounted", "Top Mounted")], lightboxUpdate, c3);

        lightboxContentContainer.appendChild(c3);

        var c4 = document.createElement('div');
        c4.style = STYLE.BillboardMenus;
        var fieldIsIlluminated = createCheckbox_Infield('Is Illuminated', true, "width:96%", lightboxUpdate, c4);

        var fieldLEDWatt = createDropdown_Infield("LED Brightness", 1, "width:47%",
            [createDropdownOption("1.08w (Standard Brightness)", "1.08"),
            createDropdownOption("1.50w (Premium Brightness)", "1.50")], lightboxUpdate, c4);

        var fieldLEDColour = createDropdown_Infield_Icons_Search("LED Colour",
            1,
            "width:47%",
            30,
            true,
            [["3000K", "#f1ff94"],
            ["6500K", "white"],
            ["10000K", "#94e8ff"],
            ["Red", "Red"],
            ["Green", "Green"],
            ["Blue", "Blue"],
            ["RGB", "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(255,0,0,1) 15%, rgba(255,248,0,1) 29%, rgba(0,255,29,1) 44%, rgba(0,231,240,1) 59%, rgba(0,13,245,1) 74%, rgba(248,0,242,1) 87%, rgba(0,212,255,1) 100%)"]],
            lightboxUpdate,
            c4);

        var fieldLoading = createInput_Infield('Transformer Loading', 80, "width:47%", lightboxUpdate, c4, true, 1, {postfix: "%"});

        var fieldAmpAllowance = createInput_Infield('Amperage Allowance', 0, "width:47%", lightboxUpdate, c4, true, 1, {postfix: "A"});

        var fieldVoltage = createDropdown_Infield("Voltage", 0, "width:47%",
            [createDropdownOption("12", "12"),
            createDropdownOption("24", "24")], lightboxUpdate, c4);

        var fieldDimmable = createCheckbox_Infield('Dimmable', null, "width:47%", lightboxUpdate, c4);

        var fieldSummary = document.createElement('p');
        fieldSummary.style = "display: block; float: left; width: 95%; background-color: rgb(221, 221, 221); color:black; min-height: 50px; margin: 10px; box-shadow: rgba(0, 0, 0, 0.3) 0px 4px 8px 0px;padding:5px;";
        c4.appendChild(fieldSummary);

        lightboxContentContainer.appendChild(c4);

        let production = new Production(lightboxContentContainer, null, lightboxUpdate);

        let install = new Install(lightboxContentContainer, null, lightboxUpdate);

        let artwork = new Artwork(lightboxContentContainer, null, lightboxUpdate);

        var fieldCreateLEDProduct = createButton('Create New Lightbox Product',
            "margin:0px;width:100%", function() {
                createLightboxProduct(0);
                console.log("----------routerBuilder_ChosenMaterials------------");
                //console.log(routerBuilder_ChosenMaterials);
            });
        this.footer.appendChild(fieldCreateLEDProduct);

        function lightboxUpdate() {
            var tempDTF = 0;

            if(fieldBoxDepth[1].value == 300 || fieldBoxDepth[1].value == 350) {
                fieldIsDoubleSided[1].checked = true;
            } else {
                fieldIsDoubleSided[1].checked = false;
            }
            if(fieldBoxDepth[1].value == 175 || fieldBoxDepth[1].value == 350) {
                fieldMakeInhouse[1].checked = false;
                setFieldDisabled(true, fieldMakeInhouse[1], fieldMakeInhouse[0]);
            }
            else {
                setFieldDisabled(false, fieldMakeInhouse[1], fieldMakeInhouse[0]);
            }

            if(fieldIsDoubleSided[1].checked) {
                tempDTF = parseFloat(fieldBoxDepth[1].value) / 2;
            } else {
                tempDTF = parseFloat(fieldBoxDepth[1].value);
            }

            if(!fieldMakeInhouse[1].checked) {
                fieldMakeInhouse_OutsourceOption_Cost[0].disabled = false;
                fieldMakeInhouse_OutsourceOption_Cost[0].style.display = "block";
                fieldMakeInhouse_OutsourceOption_Markup[0].disabled = false;
                fieldMakeInhouse_OutsourceOption_Markup[0].style.display = "block";
            } else {
                fieldMakeInhouse_OutsourceOption_Cost[0].disabled = true;
                fieldMakeInhouse_OutsourceOption_Cost[0].style.display = "none";
                fieldMakeInhouse_OutsourceOption_Markup[0].disabled = true;
                fieldMakeInhouse_OutsourceOption_Markup[0].style.display = "none";
            }

            if(fieldIsDoubleSided[1].checked) {
                fieldIsDoubleSidedReinforcementRequired[0].disabled = false;
                fieldIsDoubleSidedReinforcementRequired[0].style.display = "block";
                fieldIsDoubleSidedReinforcementRequired[0].style.visibility = "visible";

                fieldIsDoubleSidedReinforcementMaterial[0].disabled = false;
                fieldIsDoubleSidedReinforcementMaterial[0].style.visibility = "visible";
            } else {
                fieldIsDoubleSidedReinforcementRequired[0].disabled = true;
                fieldIsDoubleSidedReinforcementRequired[1].checked = false;
                fieldIsDoubleSidedReinforcementRequired[0].style.display = "none";
                fieldIsDoubleSidedReinforcementRequired[0].style.visibility = "hidden";

                fieldIsDoubleSidedReinforcementMaterial[0].disabled = true;
                fieldIsDoubleSidedReinforcementMaterial[0].style.display = "none";
                fieldIsDoubleSidedReinforcementMaterial[0].style.visibility = "hidden";
            }


            distanceToOutsideBox = parseFloat(tempDTF) / 2;
            numberRows = Math.ceil(((parseFloat(fieldBoxHeight[1].value) - 2 * distanceToOutsideBox) / (tempDTF + ledAllowanceH)) + 1);
            numberColumns = Math.ceil((((parseFloat(fieldBoxWidth[1].value) - 2 * distanceToOutsideBox) - ledWidth) / (tempDTF + ledAllowanceW)) + 1);
            totalLEDs = numberRows * numberColumns * (fieldIsDoubleSided[1].checked ? 2 : 1);
            totalAmp = ((totalLEDs * (parseFloat(fieldLEDWatt[1].value.replace(/[^0-9\.]+/g, "")) / (fieldLoading[1].value / 100))) / fieldVoltage[1].value);
            var transformerName = getCheapestTransformer(totalAmp, fieldAmpAllowance[1].value, fieldDimmable[1].checked, fieldVoltage[1].value).name;
            var transformerQty = totalQuantity.qty * getCheapestTransformer(totalAmp, fieldAmpAllowance[1].value, fieldDimmable[1].checked, fieldVoltage[1].value).i_totalComputedQuantity;

            console.log(getCheapestTransformersInOrder(totalAmp, fieldAmpAllowance[1].value, fieldDimmable[1].checked, fieldVoltage[1].value));

            fieldSummary.innerHTML = "Total LEDs: " + totalQuantity.qty + "x " + " " + totalLEDs + "<br> Total Amp: " + totalQuantity.qty + "x " + totalAmp + "A @ " + fieldLoading[1].value + "% loading" + "<br> Best Transformer: (x" + transformerQty + ") " + transformerName;

            var allFields = [fieldLEDWatt[0], fieldLoading[0], fieldVoltage[0], fieldLEDColour[0], fieldAmpAllowance[0], fieldDimmable[0], fieldSummary];
            for(var a = 0; a < allFields.length; a++) {
                allFields[a].disabled = false;
                allFields[a].style.visibility = "visible";
                allFields[a].style.display = "block";
            }

            var fieldIsIlluminatedUnchecks = [fieldLEDWatt[0], fieldLoading[0], fieldVoltage[0], fieldLEDColour[0], fieldAmpAllowance[0], fieldDimmable[0], fieldSummary];
            if(!fieldIsIlluminated[1].checked) {
                for(var c = 0; c < fieldIsIlluminatedUnchecks.length; c++) {
                    fieldIsIlluminatedUnchecks[c].disabled = true;
                    fieldIsIlluminatedUnchecks[c].style.visibility = "hidden";
                    fieldIsIlluminatedUnchecks[c].style.display = "none";
                }
            }

            var fieldMakeInhouseUnchecks = [fieldLEDWatt[0], fieldLoading[0], fieldVoltage[0], fieldAmpAllowance[0], fieldSummary, fieldIsDoubleSidedReinforcementRequired[0], fieldIsDoubleSidedReinforcementMaterial[0]];
            if(!fieldMakeInhouse[1].checked) {
                for(var d = 0; d < fieldMakeInhouseUnchecks.length; d++) {
                    fieldMakeInhouseUnchecks[d].disabled = true;
                    fieldMakeInhouseUnchecks[d].style.visibility = "hidden";
                    fieldMakeInhouseUnchecks[d].style.display = "none";
                }
                fieldIsDoubleSidedReinforcementRequired[1].checked = false;
            }

            var acrylicTypeSelected = (fieldBoxDepth[1].selectedIndex == 0 || fieldBoxDepth[1].selectedIndex == 2);

            var fieldFaceAcrylicUnchecks = [0, 1, 2, 3, 4];
            var fieldFaceFlexfaceUnchecks = [5, 6];
            var numFaceTypes = fieldFaceTypeOptions.length;
            for(var l1 = numFaceTypes - 1; l1 >= 0; l1--) {
                if(acrylicTypeSelected) {
                    if(fieldFaceAcrylicUnchecks.contains(l1)) {
                        fieldFaceTypeOptions[l1].disabled = false;
                        fieldFaceTypeOptions[l1].style.display = "block";
                        fieldFaceType[1].selectedIndex = l1;
                    } else {
                        fieldFaceTypeOptions[l1].disabled = true;
                        fieldFaceTypeOptions[l1].style.display = "none";
                    }
                }
                else {
                    if(fieldFaceFlexfaceUnchecks.contains(l1)) {
                        fieldFaceTypeOptions[l1].disabled = false;
                        fieldFaceTypeOptions[l1].style.display = "block";
                        fieldFaceType[1].selectedIndex = l1;
                    } else {
                        fieldFaceTypeOptions[l1].disabled = true;
                        fieldFaceTypeOptions[l1].style.display = "none";
                    }
                }
            }
        }

        //********************************************//
        //                  CREATE CB ITEMS
        //********************************************//
        async function createLightboxProduct(partIndex) {
            thisClass.minimize();

            var makeInhouse = fieldMakeInhouse[1].checked;
            var makeInhouse_OutsourceMarkup = parseFloat(fieldMakeInhouse_OutsourceOption_Markup[1].value);
            var makeInhouse_OutsourceCost = parseFloat(fieldMakeInhouse_OutsourceOption_Cost[1].value);
            var boxWidth = parseFloat(fieldBoxWidth[1].value);
            var boxHeight = parseFloat(fieldBoxHeight[1].value);
            var boxQty = totalQuantity.qty;
            var boxIsDoubleSided = fieldIsDoubleSided[1].checked;
            var boxDoubleSided_RequiresReinforcement = fieldIsDoubleSidedReinforcementRequired[1].checked;
            var boxDoubleSided_ReinforcementMaterial = fieldIsDoubleSidedReinforcementMaterial[1].value;
            var boxDepth = parseFloat(fieldBoxDepth[1].value);
            var isIlluminated = fieldIsIlluminated[1].checked;
            var faceType = fieldFaceType[1].value;
            var sprayFinish = fieldSprayFinish[1].value;
            var sprayColour = fieldSprayColour[1].value;
            var sprayType = fieldSprayType[1].value;
            var ledColour = fieldLEDColour[1].value;
            var ledWatt = fieldLEDWatt[1].value;
            var isDimmable = fieldDimmable[1].checked;
            var voltage = fieldVoltage[1].value;
            var ampAllowance = fieldAmpAllowance[1].value;

            //----------MAKE INHOUSE-----------//
            var IH_OS;
            if(makeInhouse) IH_OS = "IH";
            else IH_OS = "OS";

            //----------NON ILLUMINATED-------//
            var BOX_LIGHTBOX;
            if(isIlluminated) BOX_LIGHTBOX = "LIGHTBOX";
            else BOX_LIGHTBOX = "NONILLUMINATED BOX";

            //-----------FACE TYPE------------//
            var FACETYPE;
            if(faceType == '4.5mm Opal Acrylic with Printed Translucent Vinyl and Laminate' || faceType == 'Acrylic (Blank)' || faceType == 'none (Acrylic type)') FACETYPE = "(Acrylic face Type)";
            else if(faceType == 'Premium Translucent Flexface Banner with Vibrant Double-sided Print and Gloss Laminate' || faceType == 'none (Flexface type)') FACETYPE = "(Flex-face Banner Type)";
            else if(faceType == 'ACM Push-through Type') FACETYPE = "(ACM Push-through Type)";
            else if(faceType == 'ACM Intracut Type') FACETYPE = "(ACM Intracut Type)";
            else {
                alert('Face type not currently supported with current in-house manufacture. Outsource required');
            }

            //-----------ADD QUICK PRODUCT-----------//
            //await AddQuickProduct("LIGHTBOX"+" "+FACETYPE + " - "+IH_OS);
            await AddBlankProduct();

            //productIndex++;

            var productNo = getNumProducts();
            var productIndex = productNo;

            await setProductName(productIndex, "LIGHTBOX " + FACETYPE + " - " + IH_OS);

            //------------FACE-----------//
            if(faceType == 'Acrylic (Blank)') {
                await q_AddPart_DimensionWH(productIndex, partIndex, true, "Acrylic - (sqm) - Opal 2440x1220x4.5 (Mulfords)", boxIsDoubleSided ? 2 : 1, boxWidth - faceToBoxReductionAmount, boxHeight - faceToBoxReductionAmount, "[FACE] Acrylic - (sqm) - Opal 2440x1220x4.5 (Mulfords)", null, false);
                partIndex++;
            } else if(faceType == 'none (Acrylic type)') {
                //nothing to do.
            } else if(faceType == '4.5mm Opal Acrylic with Printed Translucent Vinyl and Laminate') {
                await q_AddPart_DimensionWH(productIndex, partIndex, true, "Acrylic - (sqm) - Opal 2440x1220x4.5 (Mulfords)", boxIsDoubleSided ? 2 : 1, boxWidth - faceToBoxReductionAmount, boxHeight - faceToBoxReductionAmount, "[FACE] Acrylic - (sqm) - Opal 2440x1220x4.5 (Mulfords)", null, true);
                partIndex++;
                await q_AddPart_DimensionWH(productIndex, partIndex, true, VinylLookup["Translucent Printed"], boxIsDoubleSided ? 2 : 1, boxWidth - faceToBoxReductionAmount, boxHeight - faceToBoxReductionAmount, "[FACE] " + VinylLookup["Translucent Printed"], null, true);
                partIndex++;
                await q_AddPart_DimensionWH(productIndex, partIndex, true, LaminateLookup["Translucent"], boxIsDoubleSided ? 2 : 1, boxWidth - faceToBoxReductionAmount, boxHeight - faceToBoxReductionAmount, "[FACE] " + LaminateLookup["Translucent"], null, true);
                partIndex++;
                await q_AddPart_DimensionWH(productIndex, partIndex, true, "zProduction - Opal 4.5mm (Translucent)/sqm", boxIsDoubleSided ? 2 : 1, boxWidth - faceToBoxReductionAmount, boxHeight - faceToBoxReductionAmount, "[FACE] Production - Opal 4.5mm (Translucent)/sqm", null, true);
                partIndex++;
                await GroupParts(productIndex);
            } else if(faceType == 'none (Flexface type)') {
                //nothing to do.
            } else if(faceType == 'Flexface Banner') {
                await q_AddPart_DimensionWH(productIndex, partIndex, true, "Banner - MMT - Lightbox, Illuminated only at night, Life 4+ years", boxIsDoubleSided ? 2 : 1, boxWidth - faceToBoxReductionAmount, boxHeight - faceToBoxReductionAmount, "[FACE] Banner - MMT - Lightbox, Illuminated only at night, Life 4+ years", null, true);
                partIndex++;
                if(IH_OS == "IH") {
                    await q_AddPart_DimensionWH(productIndex, partIndex, true, "Sailtrack - (perimeter) - Aluminium Mill", boxIsDoubleSided ? 2 : 1, boxWidth - faceToBoxReductionAmount, boxHeight - faceToBoxReductionAmount, "[FACE] Sailtrack - (perimeter) - Aluminium Mill", null, true);
                    partIndex++;
                }
            } else if(faceType == 'ACM Push-through Type') {
                alert("Not Ready Yet");
            } else if(faceType == 'ACM Intracut Type') {
                alert("Not Ready Yet");
            } else {
                alert("Face type not supported");
            }

            if(IH_OS == "IH") {
                //----------------EXTRUSION--------------//
                //TODO: IH Flexface Extrusion
                await q_AddPart_DimensionWH(productIndex, partIndex, true, "Extrusion - Lightbox SS 150D Aluminium Mill (DIR 263)", boxIsDoubleSided ? 2 : 1, boxWidth * 2 + boxHeight * 2, null, "[BOX] Extrusion",
                    "Cut To: \n" +
                    "Width: " + 2 * (boxIsDoubleSided ? 2 : 1) + " @ " + boxWidth + "mm mitred (per box)\n" +
                    "Height: " + 2 * (boxIsDoubleSided ? 2 : 1) + " @ " + boxHeight + "mm mitred (per box)\n",
                    true);
                partIndex++;

                //----------------CAPPING--------------//
                //TODO: IH Flexface Extrusion
                await q_AddPart_DimensionWH(productIndex, partIndex, true, "Angle - Aluminium 25x25x1.6", boxIsDoubleSided ? 2 : 1, boxWidth * 2 + boxHeight * 2, null, "[BOX] Capping",
                    "Cut To: \n" +
                    "Width: " + 2 * (boxIsDoubleSided ? 2 : 1) + " @ " + boxWidth + "mm mitred (per box)\n" +
                    "Height: " + 2 * (boxIsDoubleSided ? 2 : 1) + " @ " + boxHeight + "mm mitred (per box)\n",
                    true);
                partIndex++;
                await GroupParts(productIndex);

                //--------------SUPPORTS--------------//
                if(!boxDoubleSided_RequiresReinforcement) {
                    var numSupports = 0;
                    var supportLength = 0;
                    var supportExactSpacing = 0;
                    if(supportOrientation == 'vertical') {
                        numSupports = Math.ceil(Math.abs((boxWidth / supportSpacing) - 1)) * (boxIsDoubleSided ? 2 : 1);
                        supportExactSpacing = boxWidth / (numSupports + 1);
                        supportLength = boxHeight - supportReductionAmount;
                    } else {
                        numSupports = Math.ceil(Math.abs((boxHeight / supportSpacing) - 1)) * (boxIsDoubleSided ? 2 : 1);
                        supportExactSpacing = boxHeight / (numSupports + 1);
                        supportLength = boxWidth - supportReductionAmount;
                    }
                    await q_AddPart_DimensionWH(productIndex, partIndex, true, "Angle - Aluminium 25x25x3", numSupports, supportLength, null, "[Supports every " + supportExactSpacing + "mm centers]", null, false);
                    partIndex++;
                }

                //--------DOUBLE-SIDED REINFORCING FRAME---------//
                else {
                    var depthAddedByReinforcing = boxDoubleSided_ReinforcementMaterial.split('x')[0];
                    boxDepth = parseFloat(boxDepth) + parseFloat(depthAddedByReinforcing);
                    ACMReductionAmount = ACMReductionAmount_IfReinforced;

                    var numSupports_ReinforcedFrame = 0;
                    var supportLength_ReinforcedFrame = 0;
                    if(supportOrientation == 'vertical') {
                        numSupports_ReinforcedFrame = Math.ceil(Math.abs((boxWidth / supportSpacing_ReinforcedFrame) - 1));
                        supportLength_ReinforcedFrame = boxHeight - depthAddedByReinforcing * 2;
                    } else {
                        numSupports_ReinforcedFrame = Math.ceil(Math.abs((boxHeight / supportSpacing_ReinforcedFrame) - 1));
                        supportLength_ReinforcedFrame = boxWidth - depthAddedByReinforcing * 2;
                    }
                    var perimeter = boxWidth * 2 + boxHeight * 2;
                    var totalLength = perimeter + supportLength_ReinforcedFrame * numSupports_ReinforcedFrame;
                    var partText =
                        "Cut To: \n" +
                        "Width: 2 @ " + boxWidth + "mm mitred (per box)\n" +
                        "Height: 2 @ " + boxHeight + "mm mitred (per box)\n" +
                        "Supports: " + numSupports_ReinforcedFrame + " @ " + supportLength_ReinforcedFrame + "mm (per box)";

                    await q_AddPart_DimensionWH(productIndex, partIndex, true, "RHS - Aluminium " + boxDoubleSided_ReinforcementMaterial, 1, totalLength, null, "[BOX] Double-sided Reinforcing Frame", partText, false);
                    partIndex++;
                }

                //--------------2PAC---------------//
                if(sprayType == "2pac") {
                    var boxOuterArea_m2 = (boxWidth * boxDepth * 2 + boxHeight * boxDepth * 2) / 1000000;
                    var boxLnm = (boxWidth * 2 + boxHeight * 2) / 1000;
                    var litresPaintRequired = boxOuterArea_m2 * spraying_2pac_LitrePerM2;

                    await q_AddPart_Painting(productIndex, partIndex, true, false, 1, litresPaintRequired, 15, 2, 60, 15, boxLnm * spray_MinsPerLnm, "[PAINTING] 2Pac");
                    partIndex++;
                }

                //--------------POWDERCOATING---------------//
                if(sprayType == "Powdercoat") {
                    var boxOuterArea_m2 = (boxWidth * boxDepth * 2 + boxHeight * boxDepth * 2) / 1000000;
                    var powdercoatCost = getLightboxPowdercoatCost(boxOuterArea_m2, boxIsDoubleSided);
                    await q_AddPart_CostMarkup(productIndex, partIndex, true, false, 1, powdercoatCost, 1.6, "[PAINTING] Powdercoat");
                    partIndex++;
                }

                //-------------LED----------------------//
                if(isIlluminated) {
                    //ACM
                    await q_AddPart_DimensionWH(productIndex, partIndex, true, ACMLookup["Standard White Gloss"], boxIsDoubleSided ? 2 : 1, boxWidth, boxHeight, "[LED] ACM Panel",
                        false);
                    partIndex++;

                    //LED
                    var knownStartingName = "LED Module - " + ledColour + " " + ledWatt + "W";
                    var fullName = $.grep(predefinedParts_Name_Id, function(obj) {return obj.key.startsWith(knownStartingName);})[0].key;
                    await AddPart(fullName, productIndex);
                    partIndex++;
                    await setPartQty(productIndex, partIndex, totalLEDs);
                    await setPartDescription(productIndex, partIndex, '[LED] ' + knownStartingName);
                    await savePart(productIndex, partIndex);

                    //TRANSFORMER
                    var transformerName = getCheapestTransformer(totalAmp, ampAllowance, isDimmable, voltage).name;
                    var transformerQty = getCheapestTransformer(totalAmp, ampAllowance, isDimmable, voltage).i_totalComputedQuantity;
                    await AddPart(transformerName, productIndex);
                    partIndex++;
                    await setPartQty(productIndex, partIndex, transformerQty);
                    await setPartDescription(productIndex, partIndex, '[LED] ' + transformerName);
                    await savePart(productIndex, partIndex);

                    //PRODUCTION
                    await AddPart("Production (ea)", productIndex);
                    partIndex++;
                    var ledMins = roundNumber(productionMinsPerLED * totalLEDs, 2);
                    await setProductionTime(productIndex, partIndex, ledMins);
                    await setPartDescription(productIndex, partIndex, "[LED] Production @ (" + (60 / productionMinsPerLED) + " LED/h) = " + ledMins + "mins");
                    await savePart(productIndex, partIndex);
                }
            }
            else {
                await AddPart("Outsource - Sambo (ea)", productIndex);
                partIndex++;
                await setPartVendorCostEa(productIndex, partIndex, makeInhouse_OutsourceMarkup);
                await setPartMarkupEa(productIndex, partIndex, makeInhouse_OutsourceMarkup);
                await setPartDescription(productIndex, partIndex, "[BOX] Outsource (Sambo)");
                await savePart(productIndex, partIndex);
            }

            //PRODUCTION
            /*if(includeProduction){
                //--------------PRODUCTION---------------//
                await AddPart("Production (ea)", productIndex);
                partIndex++;
                await openPart(productIndex, partIndex);
                await setProductionTime(productIndex, partIndex, productionMinutes);
                await setPartDescription(productIndex, partIndex, "[PRODUCTION] Cutting, Welding, Sanding, Screwing");
                await savePart(productIndex, partIndex);
                //await setPartBorderColour(productIndex, partIndex, "red");
            }*/
            partIndex = await production.Create(productIndex, partIndex);

            //ARTWORK
            /*if(includeArtwork){
                await AddPart("Artwork and Print Files", productIndex);
                partIndex++;
                if(artworkMinutes!=0){
                    await setArtworkTime(productIndex, partIndex, artworkMinutes);
                    await setPartDescription(productIndex,partIndex,"[Artwork] "+artworkMinutes+"mins");
                }
                await savePart(productIndex,partIndex);
            }*/
            partIndex = await artwork.Create(productIndex, partIndex);

            //INCLUDES !INSTALL
            /*if(includeInstall){
                await AddPart("Install - IH"+(installTotalorEach=="Total"?"":" (ea)"), productIndex);
                partIndex++;
                //INSTALL
                if(installMinutes!=0 || installMinutes!=null){
                    if(installTotalorEach=="Total"){
                        await setInstallTime(productIndex, partIndex, installMinutes);
                        await setInstallPartType(productIndex, partIndex, installType);
                    }else{
                        await setInstallTimeEa(productIndex, partIndex, installMinutes);
                        await setInstallPartTypeEa(productIndex, partIndex, installType);
                    }
                }
                //TRAVEL
                if(travelMinutes!=0 || travelMinutes!=null){
                    if(installTotalorEach=="Total"){
                        await setTravelTime(productIndex, partIndex, travelMinutes);
                        await setTravelType(productIndex, partIndex, travelType);
                    }else{
                        await setTravelTimeEa(productIndex, partIndex, travelMinutes);
                        await setTravelTypeEa(productIndex, partIndex, travelType);
                    }
                }
                await setPartDescription(productIndex,partIndex,"[Install]");
                await savePart(productIndex,partIndex);
            }*/
            partIndex = await install.Create(productIndex, partIndex);

            //PRODUCT DESCRIPTION
            var productSummary = BOX_LIGHTBOX + ": <br>"
                + "<ul><li>" + boxWidth + "mmW x " + boxHeight + "mmH x " + boxDepth + "mmD</li>"
                + "<li>" + (boxIsDoubleSided ? "Double-Sided" : "Single-Sided") + "</li>"
                + "<li>Finished in " + sprayFinish + " " + sprayColour + " " + sprayType + " paint</li>"
                + "<li>" + (isIlluminated ? ledColour + " Bright Direct LED Lighting " : "No LED Lighting") + "</li></ul>"
                + "<br>FACE: <br>"
                + "<ul><li>" + faceType + "</li></ul>"
                + (install.installRequired ? "<br>Includes Install<br>" : "<br>Supply Only or Install Separately</br>")
                + (artwork.required ? "<br>Includes Artwork<br>" : "<br>Artwork Separately");
            //+
            await setProductSummary(productIndex, productSummary);

            //-----------SET PRODUCT QUANTITY----------//
            await setProductQty(productIndex, boxQty);

            Ordui.Alert("Done.");
        }

        lightboxUpdate();

        //this.interval = setInterval(() => {this.tick();}, 1000 / 2);
    }

    hide() {
        super.hide();
        //clearInterval(this.interval);
    }

    tick() {
        this.tickUpdate();
    }

    tickUpdate() {

    }
}

function getLightboxPowdercoatCost(sqm, isDoubleSided) {
    if(!isDoubleSided) {
        return ((33.418 * sqm) + 25).toFixed(2);
    } else {
        //TODO: find exact from ACE
        return (2 * ((33.418 * sqm) + 25)).toFixed(2);
    }
}
/*var lightboxBuilderContainer;
async function createLightboxBuilder() {
    lightboxBuilderContainer = document.createElement('div');


    document.getElementsByTagName('body')[0].appendChild(lightboxBuilderContainer);
    lightboxBuilderContainer.id = "lightboxBuilderContainer";
    lightboxBuilderContainer.style = "z-index:100;background-color:#fff;color:white;width:600px;position: fixed;top:82px;left:" + menuXOffset + "px;display:none;";

}
function showLightboxBuilder() {

}
*/
