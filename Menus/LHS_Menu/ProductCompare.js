var compareParts = [];
class ProductCompareMenu extends LHSMenuWindow {

    constructor(width, height, ID, windowTitle) {
        super(width, height, ID, windowTitle);
        this.addPages(1);
    }

    show() {
        super.show();

        var page = this.getPage(0);

        while(page.hasChildNodes()) {page.removeChild(page.lastChild);}
        while(this.footer.hasChildNodes()) {this.footer.removeChild(this.footer.lastChild);}

        var ProductCompareContainer_Sub = document.createElement('div');
        ProductCompareContainer_Sub.style = "display: block; float: left; width: 98%; background-color: rgb(255, 255, 255); color: black; height: 400px; margin: 0px; padding: 5px; visibility: visible;overflow-y:scroll";

        var container1 = document.createElement('div');
        container1.style = "display: block; float: left; width: 100%; background-color: rgb(abc, abc, 221); color: black; min-height: 0px;  visibility: visible;";
        var container2 = document.createElement('div');
        container2.style = "display: block; float: left; width: 100%; background-color: rgb(abc, abc, 221); color: black; min-height: 0px;  visibility: visible;";
        var container3 = document.createElement('div');
        container3.style = "display: block; float: left; width: 100%; background-color: rgb(abc, abc, 221); color: black; min-height: 0px;  visibility: visible;";

        var materialID = 0;
        compareParts = [];
        var differencesArrayPrice = [];
        var differencesArrayCost = [];
        var allSearchParts = [];
        var allVinyl = getPredefinedParts("Vinyl - ");
        var allLaminate = getPredefinedParts("Laminate - ");
        allVinyl.forEach(element => allSearchParts.push(element));
        allLaminate.forEach(element => allSearchParts.push(element));
        var partWording = [];

        var addMaterialBtn = createButton("+ Row", null, addR);

        async function addR() {
            materialID++;
            addMaterialRow(materialID);
        }

        container1.appendChild(addMaterialBtn);

        var areaUpdateArray = [];
        var width = createInput_Infield("Width", null, "width:45%", function() {
            for(var i = 0; i < areaUpdateArray.length; i++) {
                areaUpdateArray[i]();
            }
        }, null, true, 100);

        var height = createInput_Infield("Height", null, "width:45%", function() {
            for(var i = 0; i < areaUpdateArray.length; i++) {
                areaUpdateArray[i]();
            }
        }, null, true, 100);


        //---------------------------------------//
        //                PRICE DIF              //
        //---------------------------------------//
        var totalDifference = createText("Total Difference: $0", "width:98%;background-color:#eee;font-weight:bold");
        var totalPrice, totalCost;
        function updateTotalDifference() {
            partWording[0] = "" + width[1].value + "mm x " + height[1].value + "mm [" + roundNumber(parseFloat(width[1].value / 1000) * parseFloat(height[1].value / 1000), 2) + " sqm]" + "\n\n";
            totalPrice = 0;
            totalCost = 0;
            console.log(differencesArrayPrice);
            console.log(differencesArrayCost);
            for(var x = 0; x < differencesArrayPrice.length; x++) {
                if(differencesArrayPrice[x] == null || isNaN(differencesArrayPrice[x])) totalPrice += 0;
                else totalPrice += differencesArrayPrice[x];
            }
            for(var y = 0; y < differencesArrayCost.length; y++) {
                if(differencesArrayCost[y] == null || isNaN(differencesArrayCost[y])) totalCost += 0;
                else totalCost += differencesArrayCost[y];
            }
            totalDifference.innerText = "Total Difference: $" + roundNumber(totalPrice, 2);
        }
        container3.appendChild(width[0]);
        container3.appendChild(height[0]);


        function addMaterialRow(ID) {
            areaUpdateArray.push(updateMaterialArray);
            var materialContainer = document.createElement('div');
            materialContainer.style = "display: block; float: left; width: 99%;min-height:20px; background-color:white;border:2px solid;border-color: black;margin-bottom:4px;";

            var materialDeleteBtn = createButton("X", "display: block; float: left; width: 25px; border:none;padding:2px; color:white;min-height: 20px; margin: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;");
            materialDeleteBtn.onclick = function() {
                deletePart();
                materialContainer.remove();
            };

            //---------------------------------------//
            //                MATERIAL               //
            //---------------------------------------//
            var dropDownArr = [];
            allSearchParts.forEach(element => dropDownArr.push([element.Name, element.Name]));
            var materialMaterial1 = createDropdown_Infield_Icons_Search("Cheaper Material", 0, "width:170px", 0, true, dropDownArr, function() {updateMaterialArray();}, null, false);

            var vsText = createText(" VS ", "width:20px");

            var dropDownArr2 = [];
            allSearchParts.forEach(element => dropDownArr2.push([element.Name, element.Name]));
            var materialMaterial2 = createDropdown_Infield_Icons_Search("More Expensive", 0, "width:170px", 0, true, dropDownArr2, function() {updateMaterialArray();}, null, false);

            //---------------------------------------//
            //                PRICE DIF              //
            //---------------------------------------//
            var rowPriceDif = createText("Diff:", "width:100px");

            function updateRowPriceDif(newText) {
                rowPriceDif.innerText = newText;
            }

            //---------------------------------------//
            //              CREATE PART              //
            //---------------------------------------//
            function getPartName() {
                return [materialMaterial1[1].value, materialMaterial2[1].value];
            }
            compareParts.push([ID, getPartName()]);


            function updateMaterialArray() {
                rowPriceDif.style.color = "#f00";
                if(compareParts[ID - 1] != null) {
                    compareParts[ID - 1] = [ID, getPartName()];
                    updatePriceDif();
                } else {
                    updateTotalDifference();
                    //await final();
                }
            }
            var priceDif, costDif;
            var partACost, partAPrice;
            var partBCost, partBPrice;
            async function updatePriceDif() {
                priceDif = 0;
                costDif = 0;
                var partAName = materialMaterial1[1].value;
                var partAID = $.grep(predefinedParts_Name_Id, function(obj) {return obj.key === partAName;})[0].value;
                var partA = await getPart_HighDetail(partAID);
                partACost = partA.B9;
                partAPrice = partA.A4;

                var partBName = materialMaterial2[1].value;
                var partBID = $.grep(predefinedParts_Name_Id, function(obj) {return obj.key === partBName;})[0].value;
                var partB = await getPart_HighDetail(partBID);
                partBCost = partB.B9;
                partBPrice = partB.A4;

                console.log(partACost + " " + partAPrice);
                console.log(partBCost + " " + partBPrice);

                var area = parseFloat(width[1].value / 1000) * parseFloat(height[1].value / 1000);
                rowPriceDif.style.color = "#f00";
                priceDif = (partBPrice * area - partAPrice * area);
                costDif = (partBCost * area - partACost * area);
                updateRowPriceDif("Diff: $" + roundNumber(priceDif, 2));
                differencesArrayPrice[ID - 1] = priceDif;
                differencesArrayCost[ID - 1] = costDif;
                updateTotalDifference();

                partWording[ID] = "ROW: " + ID + "\n" + " - " + compareParts[ID - 1][1][0] + "[Cost: $" + partACost + ", Price: $" + partAPrice + "] ====> " + "\n"
                    + " - " + compareParts[ID - 1][1][1] + "[Cost: $" + partBCost + ", Price: $" + partBPrice + "]" + "\n " +
                    "- Total Difference: $" + differencesArrayCost[ID - 1] + "(cost), $" + differencesArrayPrice[ID - 1] + "(price)" + "\n\n";

                await final();
            }

            async function final() {
                rowPriceDif.style.color = "#000";
            }

            differencesArrayPrice.push(priceDif);
            differencesArrayCost.push(costDif);


            //---------------------------------------//
            //              DELETE PART              //
            //---------------------------------------//
            function deletePart() {
                console.log(ID - 1);
                compareParts[ID - 1] = null;
                differencesArrayPrice[ID - 1] = null;
                differencesArrayCost[ID - 1] = null;
                partWording[ID] = null;
                updateMaterialArray();
            }

            materialContainer.appendChild(materialDeleteBtn);
            materialContainer.appendChild(materialMaterial1[0]);
            materialContainer.appendChild(vsText);
            materialContainer.appendChild(materialMaterial2[0]);
            materialContainer.appendChild(rowPriceDif);

            container2.appendChild(materialContainer);
            updateMaterialArray();
        }

        var createProductBtn_Influence = createButton("Create Product, Price Influence", null, createProductWithInfluence);
        var createProductBtn_NoInfluence = createButton("Create Product, No Influence", null, createProductWithoutInfluence);

        async function createProductWithInfluence() {
            await AddBlankProduct();
            var productIndex = getNumProducts();
            await setProductName(productIndex, "Additional Longevity Costs");
            await AddPart("Custom Item Cost-Price (Total)", productIndex);
            await setPartDescription(productIndex, 1, "Items");
            await openPart(productIndex, 1);
            await setPartVendorCostEa(productIndex, 1, roundNumber(totalCost, 2));
            await setPartPrice(productIndex, 1, roundNumber(totalPrice, 2));
            var wording = "<ul>";
            var internalWording = "";
            var rowN = 0;
            for(var a = 0; a < compareParts.length; a++) {
                if(compareParts[a] == null) continue;
                rowN++;
                wording += "<li>" + compareParts[a][1][0] + " ====> " + compareParts[a][1][1] + "</li>";
                //internalWording +="ROW: "+rowN+"\n"+" - "+compareParts[a][1][0] + " ====> " +"\n - "+ compareParts[a][1][1] + "\n - Difference: $"+ differencesArrayCost[a]+"(cost), $"+ differencesArrayPrice[a]+"(price)"+"\n\n";
            }
            wording += "</ul>";
            var partT = '';
            for(var ai = 0; ai < partWording.length; ai++) {
                if(partWording[ai] != null) {
                    partT += partWording[ai];
                }
                if(ai == partWording.length - 1) {
                    partT += "TOTAL: $" + roundNumber(totalCost, 2) + " (cost), $" + roundNumber(totalPrice, 2) + " (price)";
                }
            }
            await setPartText(productIndex, 1, partT);
            await savePart(productIndex, 1);
            var summary = "Additional price to convert the following:<br>" + wording;

            await setProductSummary(productIndex, summary);
            Toast.notify("Done.", 3000, {position: "top-right"});
        }

        async function createProductWithoutInfluence() {
            await AddBlankProduct();
            var productIndex = getNumProducts();
            await setProductName(productIndex, "Additional Longevity Costs");
            await AddPart("No Cost Part", productIndex);
            await setPartDescription(productIndex, 1, "Items");
            await openPart(productIndex, 1);
            var wording = "<ul>";
            console.log(compareParts);
            for(var a = 0; a < compareParts.length; a++) {
                if(compareParts[a] == null) continue;
                wording += "<li>" + compareParts[a][1][0] + " ====> " + compareParts[a][1][1] + "</li>";
            }
            wording += "</ul>";
            var partT = '';
            for(var ai = 0; ai < partWording.length; ai++) {
                if(partWording[ai] != null) {
                    partT += partWording[ai];
                }
                if(ai == partWording.length - 1) {
                    partT += "TOTAL: $" + roundNumber(totalCost, 2) + " (cost), $" + roundNumber(totalPrice, 2) + " (price)";
                }
            }
            await setPartText(productIndex, 1, partT);
            await savePart(productIndex, 1);
            var summary = "Additional price to convert the following:<br>" + wording + "<br> <b>THIS OPTION WILL COST $" + roundNumber(totalPrice, 2) + "+gst</b>";

            await setProductSummary(productIndex, summary);
            Toast.notify("Done.", 3000, {position: "top-right"});
        }

        page.appendChild(container1);
        page.appendChild(container3);
        ProductCompareContainer_Sub.appendChild(container2);
        page.appendChild(ProductCompareContainer_Sub);
        this.footer.appendChild(totalDifference);
        this.footer.appendChild(createProductBtn_Influence);
        this.footer.appendChild(createProductBtn_NoInfluence);

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
