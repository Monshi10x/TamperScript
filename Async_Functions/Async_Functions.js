const event_loadedPredefinedQuickProducts = new Event("loadedPredefinedQuickProducts");
const event_loadedPredefinedParts = new Event("loadedPredefinedParts");
const event_loadedPredefinedModifiers = new Event("loadedPredefinedModifiers");
const event_loadedRHSList = new Event("loadedRHSList");
const event_loadedBaseplateList = new Event("loadedBaseplateList");


var predefinedQuickProducts_obj;
var predefinedQuickProducts_Name_Id = [];
async function loadPredefinedQuickProducts() {
    predefinedQuickProducts_Name_Id = [];
    var resultStr;
    var resultObj;
    var resultObj_num;
    const response = await fetch("https://sar10686.corebridge.net/SalesModule/MyProducts/PredefinedProducts.asmx/GetPredefinedProducts", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json; charset=UTF-8",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://sar10686.corebridge.net/SalesModule/Estimates/QuickPrice.aspx",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"sEcho\":1,\"iColumns\":4,\"sColumns\":\"\",\"iDisplayStart\":0,\"iDisplayLength\":800,\"sSearch_1\":\"\",\"sSearch_2\":\"\",\"iSortCol_0\":1,\"sSortDir_0\":\"asc\",\"pageIndex\":1,\"txSearch\":\"\",\"typeId\":\"2\",\"categoryId\":0,\"accId\":0}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    const data = await response.json();
    resultStr = data.d;
    resultObj = JSON.parse(resultStr);
    predefinedQuickProducts_obj = resultObj.aaData;
    resultObj_num = predefinedQuickProducts_obj.length;
    for(var l = 0; l < predefinedQuickProducts_obj.length; l++) {
        predefinedQuickProducts_Name_Id.push({
            key: predefinedQuickProducts_obj[l].Name,
            value: predefinedQuickProducts_obj[l].Id
        });
    }
    console.log("%cPREDEFINED QUICK PRODUCTS", 'background: blue; color: white');
    console.log(predefinedQuickProducts_obj);
    document.dispatchEvent(event_loadedPredefinedQuickProducts);
}

var predefinedParts_obj;
var predefinedParts_Name_Id = [];
async function loadPredefinedParts() {
    predefinedParts_Name_Id = [];
    var resultObj_num;
    const response = await fetch("https://sar10686.corebridge.net/Api/OrderEntryProducts/GetPartSearchEntries", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json; charset=UTF-8",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://sar10686.corebridge.net/SalesModule/Estimates/QuickPrice.aspx",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"partGroupId\":0,\"partCategoryId\":0,\"txSearch\":\"\",\"pageIndex\":1,\"useGetAllParts\":false}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    const data = await response.json();
    predefinedParts_obj = data.PartGridEntries;
    resultObj_num = predefinedParts_obj.length;
    for(var l = 0; l < predefinedParts_obj.length; l++) {
        predefinedParts_Name_Id.push({
            key: predefinedParts_obj[l].Name,
            value: predefinedParts_obj[l].Id
        });
    }
    for(let i = 0; i < predefinedParts_obj.length; i++) {
        let arr = predefinedParts_obj[i].ParentSize.replaceAll("mm", "").replaceAll(" ", "").split("x");
        let wxhString = "" + zeroIfNaNNullBlank(parseFloat(arr[0])) + "x" + zeroIfNaNNullBlank(parseFloat(arr[1]));

        if(predefinedParts_obj[i].Name.includes(" - (sqm) -")) predefinedParts_obj[i].Material = predefinedParts_obj[i].Name.split(" - (sqm) -")[0];
        predefinedParts_obj[i].SheetSize = wxhString;
        predefinedParts_obj[i].SheetWidth = parseFloat(arr[0]);
        predefinedParts_obj[i].SheetHeight = parseFloat(arr[1]);
        predefinedParts_obj[i].IsStocked = predefinedParts_obj[i].Weight.includes("Stocked:true");

    }
    //console.log(predefinedParts_Name_Id);
    console.log("%cPREDEFINED PARTS", 'background: blue; color: white');
    console.log(predefinedParts_obj);
    document.dispatchEvent(event_loadedPredefinedParts);
}

var predefinedModifiers_obj;
var predefinedModifiers_Name_Id = [];
async function loadPredefinedModifiers() {
    predefinedModifiers_Name_Id = [];
    var resultObj_num;
    const response = await fetch("https://sar10686.corebridge.net/Api/OrderEntryProducts/GetAdditionalModifierRelatedProperties", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json; charset=UTF-8",
            "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://sar10686.corebridge.net/SalesModule/Estimates/QuickPrice.aspx",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "[]",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    const data = await response.json();
    predefinedModifiers_obj = data.AvaliableModifiers.Modifiers;
    resultObj_num = predefinedModifiers_obj.length;
    for(var l = 0; l < predefinedModifiers_obj.length; l++) {
        predefinedModifiers_Name_Id.push({
            Name: predefinedModifiers_obj[l].Name,
            Id: predefinedModifiers_obj[l].Id
        });
    }
    //console.log(predefinedModifiers_Name_Id);
    console.log("%cPREDEFINED MODIFIERS", 'background: blue; color: white');
    console.log(predefinedModifiers_obj);

}

var modifiersData = [];
async function loadModifiersData() {
    console.log(predefinedModifiers_Name_Id);
    let promises = [];
    for(let i = 0; i < predefinedModifiers_Name_Id.length; i++) {
        promises.push(getModifierData(predefinedModifiers_Name_Id[i].Id));
        //const data = await response.json(); console.log(data)
    }

    let data = await Promise.all(promises);
    console.log(data);
    for(let i = 0; i < data.length; i++) {
        modifiersData.push(data[i].Modifier);
    }

    console.log("%cPREDEFINED MODIFIERS -> DATA", 'background: blue; color: white');
    console.log(modifiersData);
    document.dispatchEvent(event_loadedPredefinedModifiers);
}

async function getModifierData(modifierID) {
    const response = await fetch("https://sar10686.corebridge.net/Api/OrderEntryProducts/GetModifier?modifierId=" + modifierID, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json; charset=utf-8",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        //"referrer": "https://sar10686.corebridge.net/SalesModule/Orders/EditOrder.aspx?Edit=1&OrderId=16882&acctid=11079&acctname=TEST",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    const data = await response.json();
    return data;
}

function getModifierDropdown_Name_Price_Cost(modifierName) {
    let listItemsObject = [];

    for(let i = 0; i < modifiersData.length; i++) {
        if(modifiersData[i].Name != modifierName) continue;
        if(!modifiersData[i].VariableRateListItems) continue;

        let listItems = modifiersData[i].VariableRateListItems.replaceAll("~0", "").split(":");
        listItems.shift();
        for(let j = 0; j < listItems.length; j += 4) {
            listItemsObject.push({Name: listItems[j], Price: listItems[j + 1], Cost: listItems[j + 2], Rate: listItems[j + 3]});
        }

        return listItemsObject;
    }

    return null;
}


var RHSList = [];
async function loadRHSList() {
    var RHS_Aluminium_Parts = await getPredefinedParts("RHS - Aluminium");
    var RHS_Aluminium = ["Aluminium"];
    for(var a = 0; a < RHS_Aluminium_Parts.length; a++) {
        //var size=RHS_Aluminium_Parts[a].ParentSize.replace(/<[^>]+>/g, '').replaceAll("mm","").replaceAll(" ",'').split("x");
        //var w=size[0];
        //var h=size[1];
        //var d=RHS_Aluminium_Parts[a].Thickness;
        //var combinedMeasure=w+"x"+h+"x"+d;
        //RHS_Aluminium.push(combinedMeasure);

        var name = RHS_Aluminium_Parts[a].Name.replace("RHS - Aluminium ", "");
        RHS_Aluminium.push(name);
    }

    var RHS_Steel_Parts = await getPredefinedParts("RHS - Steel");
    var RHS_Steel = ["Steel Gal"];
    for(var b = 0; b < RHS_Steel_Parts.length; b++) {
        /* var size2=RHS_Steel_Parts[b].ParentSize.replace(/<[^>]+>/g, '').replaceAll("mm","").replaceAll(" ",'').split("x");
        var w2=size2[0];
        var h2=size2[1];
        var d2=RHS_Steel_Parts[b].Thickness;
        var combinedMeasure2=w2+"x"+h2+"x"+d2;
        RHS_Steel.push(combinedMeasure2);*/

        var name2 = RHS_Steel_Parts[b].Name.replace("RHS - Steel ", "").replaceAll("Gal ", "");
        RHS_Steel.push(name2);
    }
    var BlueSteel = ["Blue Steel"];
    var StainlessSteel = ["Stainless Steel"];
    RHSList.push(RHS_Steel);
    RHSList.push(BlueSteel);
    RHSList.push(RHS_Aluminium);
    RHSList.push(StainlessSteel);
    console.log("%cRHS PARTS", 'background: blue; color: white');
    console.log(RHSList);
    document.dispatchEvent(event_loadedRHSList);
}

var BaseplateList = [];
async function loadBaseplateList() {
    //var Baseplate_Aluminium_Parts=await getPredefinedParts("RHS - Aluminium");
    var Baseplate_Aluminium = ["Aluminium"];
    /*for(var a=0;a<RHS_Aluminium_Parts.length;a++){
        var size=RHS_Aluminium_Parts[a].ParentSize.replace(/<[^>]+>/g, '').replaceAll("mm","").replaceAll(" ",'').split("x");
        var w=size[0];
        var h=size[1];
        var d=RHS_Aluminium_Parts[a].Thickness;
        var combinedMeasure=w+"x"+h+"x"+d;
        RHS_Aluminium.push(combinedMeasure);
    }*/

    var Baseplate_Steel_Parts = await getPredefinedParts("Baseplate - Steel");
    var Baseplate_Steel = ["Steel"];
    for(var b = 0; b < Baseplate_Steel_Parts.length; b++) {
        var size2 = Baseplate_Steel_Parts[b].ParentSize.replace(/<[^>]+>/g, '').replaceAll("mm", "").replaceAll(" ", '').split("x");
        var w2 = size2[0];
        var h2 = size2[1];
        var d2 = Baseplate_Steel_Parts[b].Thickness;
        var combinedMeasure2 = w2 + "x" + h2 + "x" + d2;
        Baseplate_Steel.push(combinedMeasure2);
    }
    var BlueSteel = ["Blue Steel"];
    var StainlessSteel = ["Stainless Steel"];
    BaseplateList.push(Baseplate_Steel);
    BaseplateList.push(BlueSteel);
    BaseplateList.push(Baseplate_Aluminium);
    BaseplateList.push(StainlessSteel);
    console.log("%cBASEPLATE PARTS", 'background: blue; color: white');
    console.log(BaseplateList);
    document.dispatchEvent(event_loadedBaseplateList);
}

var VinylLookup;
var LaminateLookup;
var AppTapeLookup;
var InstallLookup;
var InstallTimesLookup;
var TravelLookup;
var ACMLookup;
var RouterToolpathTimeLookup;
var LaserToolpathTimeLookup;
var PartItemsLookup;
var TransformerLookup;
var predefinedVehicleTemplates;
var blankVehicleTemplates;
window.addEventListener("load", (event) => {
    TransformerLookup = JSON.parse(GM_getResourceText("JSONTransformers"));
    console.log(TransformerLookup);
    TransformerLookup = TransformerLookup.transformers;

    predefinedVehicleTemplates = JSON.parse(GM_getResourceText("JSONPredefinedVehicleTemplates"));
    console.log(predefinedVehicleTemplates);
    predefinedVehicleTemplates = predefinedVehicleTemplates.predefinedVehicleTemplates;

    blankVehicleTemplates = JSON.parse(GM_getResourceText("JSONBlankVehicleTemplates"));
    console.log(blankVehicleTemplates);
    blankVehicleTemplates = blankVehicleTemplates.blankVehicleTemplates;

    RouterToolpathTimeLookup = JSON.parse(GM_getResourceText("JSONRouter"));
    console.log(RouterToolpathTimeLookup);
    RouterToolpathTimeLookup = RouterToolpathTimeLookup.RouterToolpathTimes;

    LaserToolpathTimeLookup = JSON.parse(GM_getResourceText("JSONLaser"));
    console.log(LaserToolpathTimeLookup);
    LaserToolpathTimeLookup = LaserToolpathTimeLookup.LaserToolpathTimes;

    PartItemsLookup = JSON.parse(GM_getResourceText("JSONPartItems"));
    console.log(PartItemsLookup);
    VinylLookup = PartItemsLookup.VinylLookup;
    LaminateLookup = PartItemsLookup.LaminateLookup;
    AppTapeLookup = PartItemsLookup.AppTapeLookup;
    InstallLookup = PartItemsLookup.InstallLookup;
    TravelLookup = PartItemsLookup.TravelLookup;
    ACMLookup = PartItemsLookup.ACMLookup;

    InstallTimesLookup = JSON.parse(GM_getResourceText("JSONInstallTimes"));
    console.log(InstallTimesLookup);
    InstallTimesLookup = InstallTimesLookup.InstallTimes;
});

document.addEventListener("loadedPredefinedParts", (event) => {
    var productNameElements = document.querySelectorAll("input[id^='productDescription']");
    let isAdded = false;
    for(let i = 0; i < productNameElements.length; i++) {
        if(productNameElements[i].value.includes("OTHER INFORMATION")) isAdded = true;
    }
    async function f() {
        await AddQuickProduct(" OTHER INFORMATION - Standard");
    }

    if(!isAdded) f();
});

function getPredefinedParts(searchName) {
    var searchedPart = $.grep(predefinedParts_obj, function(obj) {return obj.Name.includes(searchName);});
    return searchedPart;
}

function getPredefinedParts_AllThicknesses(searchName) {
    var searchedPart = $.grep(predefinedParts_obj, function(obj) {return obj.Name.includes(searchName);});
    var thicknesses = [];
    for(var i = 0; i < searchedPart.length; i++) {
        if(!thicknesses.contains(searchedPart[i].Thickness)) thicknesses.push(searchedPart[i].Thickness);
    }
    return thicknesses;
}

function getPredefinedParts_AllFinishes(searchName) {
    var searchedPart = $.grep(predefinedParts_obj, function(obj) {return obj.Name.includes(searchName);});
    var finishes = [];
    for(var i = 0; i < searchedPart.length; i++) {
        if(!finishes.contains(searchedPart[i].Finish)) finishes.push(searchedPart[i].Finish);
    }
    return finishes;
}

function getPredefinedParts_RefinedSearch(searchName, thickness, finish, sheetSize, material) {
    var searchedPart = $.grep(predefinedParts_obj, function(obj) {return obj.Name.includes(searchName);});
    var result = [];
    for(var i = 0; i < searchedPart.length; i++) {
        let _material = searchedPart[i].Name.split(" - (sqm) -")[0];
        let wh = searchedPart[i].ParentSize.replaceAll("mm", "").replaceAll(" ", "").split("x");
        let _sheetSize = "" + zeroIfNaNNullBlank(parseFloat(wh[0])) + "x" + zeroIfNaNNullBlank(parseFloat(wh[1]));

        var c1 = false,
            c2 = false,
            c3 = false,
            c4 = false;

        if(thickness) {
            c1 = searchedPart[i].Thickness == thickness;
        } else c1 = true; //skip case if null, same as is true
        if(finish) {
            c2 = searchedPart[i].Finish == finish;
        } else c2 = true;
        if(material) {
            c3 = _material == material;
        } else c3 = true;
        if(sheetSize) {
            c4 = _sheetSize == sheetSize;
        } else c4 = true;

        if(c1 && c2 && c3 && c4) {
            result.push(searchedPart[i]);
            continue;
        }

        if(!thickness && !finish && !sheetSize && !material) result.push(searchedPart[i]); // case where all are null

    }
    return result;
}

function getPredefinedParts_Name_FromLimitedName(searchName) {
    var splitSearchName = searchName.replace(/ -/g, '').split(" ");
    let checker = (arr, target) => target.every(v => arr.includes(v));
    for(var a = 0; a < predefinedParts_Name_Id.length; a++) {
        var partName = predefinedParts_Name_Id[a].key.replace(/ -/g, '').split(" ");
        if(checker(partName, splitSearchName)) return predefinedParts_Name_Id[a].key;
    }
}

function getPredefinedParts_Name_FromContains(searchName, ...args) {
    alert("not ready");
}

async function getPart_HighDetail(partId) {
    const response = await fetch("https://sar10686.corebridge.net/Api/OrderEntryProducts/GetProductPart?partId=" + partId + "", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json; charset=utf-8",
            "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://sar10686.corebridge.net/SalesModule/Estimates/QuickPrice.aspx",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    const data = await response.json();
    return data.PartView;
}

async function getPart_HighDetail2(searchName) {
    var partId = $.grep(predefinedParts_Name_Id, function(obj) {return obj.key === searchName;})[0].value;
    return await getPart_HighDetail(partId);
}

async function AddQuickProduct(name) {
    var linkedId = $.grep(predefinedQuickProducts_Name_Id, function(obj) {return obj.key === name;})[0].value;
    pdp_search.AddPredefinedProductToOrder(parseInt(linkedId));

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var pragmaOnce = true;
        var timer = setInterval(() => {
            if(isLoading() == false && isSaveInProgress() == false) {
                resetExecuted();
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, sleepMS);
    });
    console.log("successfully added quick product " + name);
    await sleep(sleepMS);
}
async function AddBlankProduct() {
    OrderStep2.CreateProduct({});

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var pragmaOnce = true;
        var timer = setInterval(() => {
            if(isLoading() == false && isSaveInProgress() == false) {
                resetExecuted();
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, sleepMS);
    });
    console.log("successfully added blank product");
    await sleep(sleepMS);
}
async function DeleteProduct(productNo) {
    var productContext = ko.contextFor(document.querySelector(Field.ProductQtyField(productNo))).$data;

    OrderStep2.Product_RemoveProduct(productContext);

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var pragmaOnce = true;
        var timer = setInterval(() => {
            if(isConfirmingModalYesNoOpen()) {
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, sleepMS);
    });

    document.querySelector("#yesButton").click();

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var pragmaOnce = true;
        var timer = setInterval(() => {
            if(isLoading() == false && isSaveInProgress() == false) {
                resetExecuted();
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, sleepMS);
    });
    console.log("successfully deleted product " + productNo);
    await sleep(sleepMS);
}
async function MoveProduct(currentIndex, newIndex) {
    console.log(currentIndex + " " + newIndex);
    var listProducts = document.getElementsByClassName("ord-prod-model-item");
    var products = ko.contextFor(document.querySelector(".ord-prod-body")).$parent.OrderProducts();
    var order = ko.contextFor(document.querySelector(".ord-prod-body")).$parent;
    var table = document.getElementsByClassName("product-finalize-item step3-product-duedate-div");

    var orderProductBody = document.querySelector("#orderProductBody");

    var element = products[currentIndex];

    newIndex = clamp(newIndex, 0, getNumProducts() - 1);

    products.splice(currentIndex, 1);
    products.splice(newIndex, 0, element);

    //insertBefore
    if(newIndex < currentIndex) {
        orderProductBody.insertBefore(listProducts[currentIndex], listProducts[newIndex]);
        //productSummaryWrapper.insertBefore(productSummaryWrapperRow, table[newIndex]);
        //productSummaryWrapper.insertBefore(brAfter, table[newIndex].nextSibling);
    }
    //insertAfter
    else {
        if(listProducts[newIndex].nextSibling == null) {
            orderProductBody.appendChild(listProducts[currentIndex]);
            //productSummaryWrapper.appendChild(productSummaryWrapperRow);
            //productSummaryWrapper.appendChild(brAfter);
        } else {
            orderProductBody.insertBefore(listProducts[currentIndex], listProducts[newIndex].nextSibling);
            //productSummaryWrapper.insertBefore(productSummaryWrapperRow, table[newIndex].nextSibling);
            //productSummaryWrapper.insertBefore(brAfter, table[newIndex]);
        }
    }

    products = ko.contextFor(document.querySelector(".ord-prod-body")).$parent.OrderProducts();
    listProducts = document.getElementsByClassName("ord-prod-model-item");

    $(products[newIndex].LineItemOrder(newIndex + 1)).change();

    order.OrderProductsMoveEvent({
        item: products[newIndex], sourceIndex: newIndex, sourceParentNode: document.querySelector("div#orderProductBody.ko_container.ui-sortable"), targetIndex: 1, cancelDrop: false
    });

    await AddBlankProduct();
    await DeleteProduct(getNumProducts());
    Ordui.Alert("Move Successful");
}
async function AddPart(name, productNo) {
    console.log("Add Part " + name);
    var linkedId = $.grep(predefinedParts_Name_Id, function(obj) {return obj.key === name;})[0].value;
    var c = ko.contextFor(document.querySelector(Field.Product(productNo)));
    OrderStep2.SearchPartModal_PartSelectedHandler(linkedId, c.$data, null);

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var pragmaOnce = true;
        var timer = setInterval(() => {
            if(isLoading() == false && isSaveInProgress() == false) {
                resetExecuted();
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, sleepMS);
    });
    console.log("successfully added part " + name + " to item " + productNo);
    await sleep(sleepMS);
}
async function DeletePart(productNo, partNo) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo))).$data;
    var partList = productContext.Parts();
    var part = partList[partNo - 1];

    OrderStep2.ProductPart_RemovePart(part, productContext);

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var pragmaOnce = true;
        var timer = setInterval(() => {
            if(isConfirmingModalYesNoOpen()) {
                resetExecuted();
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, sleepMS);
    });

    document.querySelector("#yesButton").click();

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var pragmaOnce = true;
        var timer = setInterval(() => {
            if(isLoading() == false && isSaveInProgress() == false) {
                resetExecuted();
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, sleepMS);
    });
    console.log("successfully removed part " + partNo);
    await sleep(sleepMS);
}
async function openPart(productNo, partNo) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo)));
    var partList = productContext.$data.Parts();
    var part = partList[partNo - 1];

    $('#partExpander_' + productNo + '_' + (partNo)).not('.partExpander.collapse').click();
    $('#partExpander_' + productNo + '_' + (partNo) + ".collapse").show();

    await sleep(100);

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var pragmaOnce = true;
        var timer = setInterval(() => {
            if(isLoading() == false && isSaveInProgress() == false) {
                resetExecuted();
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, sleepMS);
    });

    await sleep(100);

    part.ModeId(1);

    await sleep(100);

    part.ModeId(1);

    console.log("open part " + partNo);

    await sleep(sleepMS);
}
async function tickSelected(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.LinkedBtn(productNo, partNo)));
    productContext.$data.PartGroupSelected(value);
    console.log("ticked part " + partNo);
    await sleep(sleepMS);
}
async function GroupParts(productNo) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo))).$data;
    OrderStep2.Product_GroupOrderProductParts(productContext);
    console.log("grouped parts " + productNo);
    await sleep(sleepMS);
}
async function setPartWidth(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo)));
    var partList = productContext.$data.Parts();
    var part = partList[partNo - 1];
    part.WidthNumeric(value);

    //bug:
    var secondaryField = document.querySelector(Field.WidthField(productNo, partNo));
    if(secondaryField) secondaryField.value = value;

    console.log("set width " + partNo);
    await sleep(sleepMS);
}
async function setPartHeight(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo, partNo)));
    var partList = productContext.$data.Parts();
    var part = partList[partNo - 1];
    part.HeightNumeric(value);

    //bug:
    var secondaryField = document.querySelector(Field.HeightField(productNo, partNo));
    if(secondaryField) secondaryField.value = value;

    console.log("set height " + partNo);
    await sleep(sleepMS);
}
async function setPartQty(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo)));
    var partList = productContext.$data.Parts();
    var part = partList[partNo - 1];

    part.Quantity(value);
    console.log("set quantity " + partNo);
    await sleep(sleepMS);
}
async function setPartBorderColour(productNo, partNo, value) {
    var partBorder = document.querySelector(Field.PartBorderField(productNo, partNo));
    partBorder.style.border = "5px solid " + value;
    console.log("set border colour " + partNo);
    await sleep(sleepMS);
}
async function setProductQty(productNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.ProductQtyField(productNo))).$data;
    var productQtyItem = document.querySelector(Field.ProductQtyField(productNo));

    productContext.Qty(value);
    OrderStep2.Product_UpdateQuantityChange($(productQtyItem));

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var pragmaOnce = true;
        var timer = setInterval(() => {
            console.log("in timer");
            if(isLoading() == false && isSaveInProgress() == false) {
                resetExecuted();
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, sleepMS);
    });

    console.log("set product quantity " + productNo);
    await sleep(sleepMS);
    return productNo;
}
async function setProductName(productNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.ProductQtyField(productNo))).$data;

    productContext.Description(value);

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var pragmaOnce = true;
        var timer = setInterval(() => {
            if(isLoading() == false && isSaveInProgress() == false) {
                resetExecuted();
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, sleepMS);
    });

    console.log("set product name " + productNo);
    await sleep(sleepMS);
    return productNo;
}
async function setProductSummary(productNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo))).$data;

    productContext.ProductSummary(value);
    console.log("set product summary " + productNo);
    await sleep(sleepMS);
    return productNo;
}
async function setPartMarkup(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.MarkupField(productNo, partNo)));

    productContext.$data.Value(value);
    console.log("set markup " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setPartMarkupEa(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.MarkupFieldEach(productNo, partNo)));

    productContext.$data.Value(value);
    console.log("set markup " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setPartDescription(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo)));
    var partList = productContext.$data.Parts();
    var part = partList[partNo - 1];

    part.PartDescription(value);
    console.log("set part description " + partNo);
    await sleep(sleepMS);
    return partNo;
}
function setPartDescriptionDisabled(productNo, partNo, tf) {
    let product = document.querySelector(Field.Product(productNo));
    let partDescription = product.querySelectorAll(".txtPartDescription")[partNo - 1];

    partDescription.style.color = COLOUR.Blue;
    partDescription.disabled = tf;

}
async function setPartText(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo)));
    var partList = productContext.$data.Parts();
    var part = partList[partNo - 1];

    part.PartText(value);
    console.log("set part text " + partNo);
    await sleep(sleepMS);
    return partNo;
}
async function setPartVendorCostEa(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo)));
    var partList = productContext.$data.Parts();
    var part = partList[partNo - 1];
    part.VendorCost(value);
    console.log("set part vendor cost " + partNo);
    await sleep(sleepMS);
    return partNo;
}
async function setPartPriceEa(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PriceFieldEach(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set part price to " + partNo);
    await sleep(sleepMS);
    return partNo;
}
async function setPartPrice(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PriceFieldTotal(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set part price to " + partNo);
    await sleep(sleepMS);
    return partNo;
}
//ARTWORK
async function setArtworkTime(productNo, partNo, value) {
    var time = getMHD(value);

    ko.contextFor(Field.ArtworkTimeTotal(productNo, partNo)[0]).$data.Value(time[0]);
    ko.contextFor(Field.ArtworkTimeTotal(productNo, partNo)[1]).$data.Value(time[1]);
    ko.contextFor(Field.ArtworkTimeTotal(productNo, partNo)[2]).$data.Value(time[2]);

    console.log("set minutes " + partNo + " to " + time);
    await sleep(sleepMS);
    return partNo;
}
async function setArtworkTimeEa(productNo, partNo, value) {
    var time = getMHD(value);

    ko.contextFor(Field.ArtworkTimeEach(productNo, partNo)[0]).$data.Value(time[0]);
    ko.contextFor(Field.ArtworkTimeEach(productNo, partNo)[1]).$data.Value(time[1]);
    ko.contextFor(Field.ArtworkTimeEach(productNo, partNo)[2]).$data.Value(time[2]);

    console.log("set minutes ea " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
//PRODUCTION
async function setProductionTime(productNo, partNo, value) {
    var time = getMHD(value);

    ko.contextFor(Field.ProductionTime(productNo, partNo)[0]).$data.Value(time[0]);
    ko.contextFor(Field.ProductionTime(productNo, partNo)[1]).$data.Value(time[1]);
    ko.contextFor(Field.ProductionTime(productNo, partNo)[2]).$data.Value(time[2]);

    console.log("set minutes " + partNo + " to " + time);
    await sleep(sleepMS);
    return partNo;
}
//INSTALL
async function setInstallTime(productNo, partNo, value) {
    var time = getMHD(value);
    var fields = Field.InstallTimeTotal(productNo, partNo);
    console.log(fields);

    ko.contextFor(fields[0]).$data.Value(time[0]);
    ko.contextFor(fields[1]).$data.Value(time[1]);
    ko.contextFor(fields[2]).$data.Value(time[2]);

    console.log("set install minutes " + partNo + " to " + time);
    await sleep(sleepMS);
    return partNo;
}
async function setInstallTimeEa(productNo, partNo, value) {
    var time = getMHD(value);
    var fields = Field.InstallTimeEach(productNo, partNo);

    ko.contextFor(fields[0]).$data.Value(time[0]);
    ko.contextFor(fields[1]).$data.Value(time[1]);
    ko.contextFor(fields[2]).$data.Value(time[2]);

    console.log("set install ea minutes " + partNo + " to " + time);
    await sleep(sleepMS);
    return partNo;
}
async function setInstallTimeMHD(productNo, partNo, minutes, hours, days) {
    var fields = Field.InstallTimeTotal(productNo, partNo);

    ko.contextFor(fields[0]).$data.Value(zeroIfNaN(parseFloat(minutes)));
    ko.contextFor(fields[1]).$data.Value(zeroIfNaN(parseFloat(hours)));
    ko.contextFor(fields[2]).$data.Value(zeroIfNaN(parseFloat(days)));

    console.log("set install minutes " + partNo);
    await sleep(sleepMS);
    return partNo;
}
async function setInstallTimeMHDEa(productNo, partNo, minutes, hours, days) {
    var fields = Field.InstallTimeEach(productNo, partNo);

    ko.contextFor(fields[0]).$data.Value(zeroIfNaN(parseFloat(minutes)));
    ko.contextFor(fields[1]).$data.Value(zeroIfNaN(parseFloat(hours)));
    ko.contextFor(fields[2]).$data.Value(zeroIfNaN(parseFloat(days)));

    console.log("set install ea minutes " + partNo);
    await sleep(sleepMS);
    return partNo;
}
async function setInstallPartType(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.InstallTypeTotal(productNo, partNo)));

    productContext.$data.ListDataItemChangeValue(value);
    console.log("set install type of " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setInstallPartTypeEa(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.InstallTypeEach(productNo, partNo)));

    productContext.$data.ListDataItemChangeValue(value);
    console.log("set install type ea of " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setTravelTime(productNo, partNo, value) {
    var time = getMHD(value);
    var fields = Field.TravelTimeTotal(productNo, partNo);

    ko.contextFor(fields[0]).$data.Value(time[0]);
    ko.contextFor(fields[1]).$data.Value(time[1]);
    ko.contextFor(fields[2]).$data.Value(time[2]);

    console.log("set travel minutes " + partNo + " to " + time);
    await sleep(sleepMS);
    return partNo;
}
async function setTravelTimeEa(productNo, partNo, value) {
    var time = getMHD(value);
    var fields = Field.TravelTimeEach(productNo, partNo);

    ko.contextFor(fields[0]).$data.Value(time[0]);
    ko.contextFor(fields[1]).$data.Value(time[1]);
    ko.contextFor(fields[2]).$data.Value(time[2]);

    console.log("set travel ea minutes " + partNo + " to " + time);
    await sleep(sleepMS);
    return partNo;
}
async function setTravelTimeMHD(productNo, partNo, minutes, hours, days) {
    var fields = Field.TravelTimeTotal(productNo, partNo);

    ko.contextFor(fields[0]).$data.Value(zeroIfNaN(parseFloat(minutes)));
    ko.contextFor(fields[1]).$data.Value(zeroIfNaN(parseFloat(hours)));
    ko.contextFor(fields[2]).$data.Value(zeroIfNaN(parseFloat(days)));

    console.log("set travel minutes " + partNo);
    await sleep(sleepMS);
    return partNo;
}
async function setTravelTimeMHDEa(productNo, partNo, minutes, hours, days) {
    var fields = Field.TravelTimeEach(productNo, partNo);

    ko.contextFor(fields[0]).$data.Value(zeroIfNaN(parseFloat(minutes)));
    ko.contextFor(fields[1]).$data.Value(zeroIfNaN(parseFloat(hours)));
    ko.contextFor(fields[2]).$data.Value(zeroIfNaN(parseFloat(days)));

    console.log("set travel ea minutes " + partNo);
    await sleep(sleepMS);
    return partNo;
}
async function setTravelType(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.TravelTypeTotal(productNo, partNo)));

    productContext.$data.ListDataItemChangeValue(value);
    console.log("set travel type of " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setTravelTypeEa(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.TravelTypeEach(productNo, partNo)));

    productContext.$data.ListDataItemChangeValue(value);
    console.log("set travel type ea of " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
//PAINT
async function setPaintLitresEach(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PaintLitresEach(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setPaintLitresTotal(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PaintLitresTotal(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setPaintColourMatchTimeEach(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PaintColourMatchTimeEach(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setPaintColourMatchTimeTotal(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PaintColourMatchTimeTotal(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setPaintNumberCoatsEach(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PaintNumberCoatsEach(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setPaintNumberCoatsTotal(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PaintNumberCoatsTotal(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setPaintSetupTimeEach(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PaintSetupTimeEach(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setPaintSetupTimeTotal(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PaintSetupTimeTotal(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setPaintFlashTimeEach(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PaintFlashTimeEach(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setPaintFlashTimeTotal(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PaintFlashTimeTotal(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setPaintSprayTimeEach(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PaintSprayTimeEach(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setPaintSprayTimeTotal(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.PaintSprayTimeTotal(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
//***********************************************************************//
//          newOrEdit: True if new part, false if edit
//          totalOrEach: True if total, false if each
//***********************************************************************//
async function q_AddPart_Painting(productNo, partNo, newOrEdit, totalOrEach = false, partQty, paintLitres, colourMatchTime, numberCoats, setupTime, flashTime, sprayTime, partDescription) {
    //if new
    if(newOrEdit) {
        await AddPart(totalOrEach ? "Painting - Valtspar 2Pac 2K" : "Painting - Valtspar 2Pac 2K (ea)", productNo);
        partNo++;
    }
    //if edit
    else {
        await openPart(productNo, partNo);
    }
    await setFields(totalOrEach);
    if(partQty) await setPartQty(productNo, partNo, partQty);
    if(partDescription) await setPartDescription(productNo, partNo, partDescription);
    await savePart(productNo, partNo);

    async function setFields(totalTF) {
        //if total
        if(totalTF) {
            await setPaintLitresTotal(productNo, partNo, paintLitres);
            await setPaintColourMatchTimeTotal(productNo, partNo, colourMatchTime);
            await setPaintNumberCoatsTotal(productNo, partNo, numberCoats);
            await setPaintSetupTimeTotal(productNo, partNo, setupTime);
            await setPaintFlashTimeTotal(productNo, partNo, flashTime);
            await setPaintSprayTimeTotal(productNo, partNo, sprayTime);
        }
        //if each
        else {
            await setPaintLitresEach(productNo, partNo, paintLitres);
            await setPaintColourMatchTimeEach(productNo, partNo, colourMatchTime);
            await setPaintNumberCoatsEach(productNo, partNo, numberCoats);
            await setPaintSetupTimeEach(productNo, partNo, setupTime);
            await setPaintFlashTimeEach(productNo, partNo, flashTime);
            await setPaintSprayTimeEach(productNo, partNo, sprayTime);
        }
    }

    return partNo;
}
//***********************************************************************//
//          newOrEdit: True if new part, false if edit
//          totalOrEach: True if total, false if each
//***********************************************************************//
async function q_AddPart_CostMarkup(productNo, partNo, newOrEdit, totalOrEach, partQty, partCost, partMarkup, partDescription) {
    //if new
    if(newOrEdit) {
        await AddPart(totalOrEach ? "Custom Item Cost-Markup (Total)" : "Custom Item Cost-Markup (Ea)", productNo);
        partNo++;
    }
    //if edit
    else {
        await openPart(productNo, partNo);
    }
    await setFields(totalOrEach);
    if(partQty) await setPartQty(productNo, partNo, partQty);
    if(partDescription) await setPartDescription(productNo, partNo, partDescription);
    await savePart(productNo, partNo);

    async function setFields(totalTF) {
        //if total
        if(totalTF) {
            await setPartVendorCostEa(productNo, partNo, partCost);
            await setPartMarkup(productNo, partNo, partMarkup);
        }
        //if each
        else {
            await setPartVendorCostEa(productNo, partNo, partCost);
            await setPartMarkupEa(productNo, partNo, partMarkup);
        }
    }

    return partNo;
}
//***********************************************************************//
//          newOrEdit: True if new part, false if edit
//          totalOrEach: True if total, false if each
//***********************************************************************//
async function q_AddPart_CostPrice(productNo, partNo, newOrEdit, totalOrEach, partQty, partCost, partPrice, partDescription) {
    //if new
    if(newOrEdit) {
        await AddPart(totalOrEach ? "Custom Item Cost-Price (Total)" : "Custom Item Cost-Price (Ea)", productNo);
        partNo++;
    }
    //if edit
    else {
        await openPart(productNo, partNo);
    }
    await setFields(totalOrEach);
    if(partQty) await setPartQty(productNo, partNo, partQty);
    if(partDescription) await setPartDescription(productNo, partNo, partDescription);
    await savePart(productNo, partNo);

    async function setFields(totalTF) {
        //if total
        if(totalTF) {
            await setPartVendorCostEa(productNo, partNo, partCost);
            await setPartPrice(productNo, partNo, partPrice);

        }
        //if each
        else {
            await setPartVendorCostEa(productNo, partNo, partCost);
            await setPartPriceEa(productNo, partNo, partPrice);
        }
    }

    return partNo;
}
//***********************************************************************//
//          newOrEdit: True if new part, false if edit
//***********************************************************************//
async function q_AddPart_DimensionWH(productNo, partNo, newOrEdit, partName, partQty, partWidth, partHeight, partDescription, partInnerText, tickSelectedTF) {
    //if new
    if(newOrEdit) {
        await AddPart(partName, productNo);
        partNo++;
    }
    //if edit
    else {
        await openPart(productNo, partNo);
    }
    if(partQty) await setPartQty(productNo, partNo, partQty);
    if(partWidth) await setPartWidth(productNo, partNo, partWidth);
    if(partHeight) await setPartHeight(productNo, partNo, partHeight);
    if(partDescription) await setPartDescription(productNo, partNo, partDescription);
    if(partInnerText) await setPartText(productNo, partNo, partInnerText);
    if(tickSelectedTF) await tickSelected(productNo, partNo, tickSelectedTF);
    await savePart(productNo, partNo);
    return partNo;
}
//***********************************************************************//
//          newOrEdit: True if new part, false if edit
//***********************************************************************//
async function q_AddPart_Dimensionless(productNo, partNo, newOrEdit, partName, partQty, partDescription, partInnerText, tickSelectedTF) {
    //if new
    if(newOrEdit) {
        await AddPart(partName, productNo);
        partNo++;
    }
    //if edit
    else {
        await openPart(productNo, partNo);
    }
    if(partQty) await setPartQty(productNo, partNo, partQty);
    if(partDescription) await setPartDescription(productNo, partNo, partDescription);
    if(partInnerText) await setPartText(productNo, partNo, partInnerText);
    if(tickSelectedTF) await tickSelected(productNo, partNo, tickSelectedTF);
    await savePart(productNo, partNo);
    return partNo;
}

//ROUTER
async function setRouterSetupTimeEach(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.RouterSetupTimeEach(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setRouterSetupTimeTotal(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.RouterSetupTimeTotal(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("set paint litres " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setRouterSetupOnceOff(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.RouterSetupOnceOff(productNo, partNo)));

    productContext.$data.ValueDisplay(value);
    console.log("setRouterSetupOnceOff " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setRouterRunTimeEach(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.RouterRunTimeEach(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("setRouterRunTime " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setRouterRunTimeTotal(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.RouterRunTimeTotal(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("setRouterRunTime " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setRouterPostJobTimeEach(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.RouterPostJobTimeEach(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("setRouterPostJobTime " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
async function setRouterPostJobTimeTotal(productNo, partNo, value) {
    var productContext = ko.contextFor(document.querySelector(Field.RouterPostJobTimeTotal(productNo, partNo)));

    productContext.$data.Value(parseFloat(value));
    console.log("setRouterPostJobTime " + partNo + " to " + value);
    await sleep(sleepMS);
    return partNo;
}
//PARTS
async function switchPart(productNo, partNo, newPartName) {
    var linkedId;
    var result = $.grep(predefinedParts_Name_Id, function(obj) {
        return obj.key == newPartName;
    });
    if(result) {
        linkedId = result[0].value;
    } else alert("Issue finding part to switch");
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo)));
    var partList = productContext.$data.Parts();

    OrderStep2.SearchPartModal_SwitchPartEventClick(linkedId, productContext.$data, null, partList[partNo - 1]);

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var pragmaOnce = true;
        var timer = setInterval(() => {
            if(isLoading() == false && isSaveInProgress() == false) {
                resetExecuted();
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, sleepMS);
    });
    console.log("successfully switched part " + newPartName + " on item " + partNo);
    await sleep(sleepMS);
    return partNo;
}
async function savePart(productNo, partNo) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo)));
    var partList = productContext.$data.Parts();
    var part = partList[partNo - 1];

    part.SavePartEvent(part);

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var pragmaOnce = true;
        var timer = setInterval(() => {
            if(isLoading() == false && isSaveInProgress() == false) {
                resetExecuted();
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, sleepMS);
    });
    console.log("save part " + partNo);
    await sleep(sleepMS);
    return partNo;
}
async function copyPart(currentProductNo, currentPartNo, newProductNo) {
    console.log(currentProductNo + " " + newProductNo);
    var currentProductContext = ko.contextFor(document.querySelector(Field.Product(currentProductNo))).$data;
    var currentPartContext = currentProductContext.Parts()[currentPartNo - 1];
    var currentPartContext_ParentObject = currentPartContext.GetParentObject();

    var newProductContext = ko.contextFor(document.querySelector(Field.Product(newProductNo))).$data;

    console.log(currentProductContext, currentPartContext, currentPartContext_ParentObject, newProductContext);

    currentPartContext.SetParentObject(newProductContext);//is fix
    OrderStep2.ProductPart_ClonePartProcess(currentPartContext, newProductContext);
    currentPartContext.SetParentObject(currentPartContext_ParentObject);//is fix

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var pragmaOnce = true;
        var timer = setInterval(() => {
            if(isLoading() == false && isSaveInProgress() == false) {
                resetExecuted();
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, sleepMS);
    });
    console.log("copy part from " + currentProductNo + "(" + getRealProductNo(currentProductNo) + ") to " + newProductNo + "(" + getRealProductNo(newProductNo) + ")");
    await sleep(sleepMS);
    return newProductNo;
}

function getRealProductNo(productNo) {
    var orderContext = ko.contextFor(document.querySelectorAll("div[id^='ord_prod_model_item_']")[productNo - 1]).$parent;
    var products = orderContext.OrderProducts();
    var realProductNo = products[productNo - 1].Index;
    return realProductNo;
}
function getProductIndexFromRealNo(productNo) {
    var items = document.querySelectorAll("div[id^='ord_prod_model_item_']");
    var ind = -1;
    items.forEach(function(item, index) {
        if(item.id == "ord_prod_model_item_" + productNo) ind = index + 1;
    });
    return ind;
}
function getRealPartNo(productNo, partNo) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo))).$data;
    var parts = productContext.Parts();
    var realPartNo = parts[partNo - 1].Index;
    return realPartNo;
}
function getPartIndexFromReal(productNo, realPartNo) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo))).$data;
    var parts = productContext.Parts();
    for(let i = 0; i < parts.length; i++) {
        if(parts[i].Index == realPartNo) return i + 1;
    }

    return realPartNo;
}
function getProductNames() {
    var arr = [];

    for(var n = 0; n < getNumProducts(); n++) {
        var productContext = ko.contextFor(document.querySelector(Field.ProductQtyField(n + 1))).$data;

        arr.push(productContext.Description());
    }
    return arr;
}
function getProductsWithName(name) {
    var products = getProductNames();
    var arr = [];
    for(var n = 0; n < products.length; n++) {
        if(products[n] == name) {
            arr.push(n + 1);
        }
    }
    return arr;
}
function getNumProducts() {
    var products = ko.contextFor(document.querySelector(".ord-prod-body")).$parent.OrderProducts();
    return products.length;
}
function getPartNamesInProduct(productNo) {
    let partNames = [];
    let domProduct = document.querySelector(Field.Product(productNo));


    let parts = domProduct.querySelectorAll(".txtPartDescription");
    console.log(parts);

    for(let i = 0; i < parts.length; i++) {
        partNames.push(parts[i].value);
    }

    return partNames;
}

function getKoPartsInProduct(productNo) {
    let parts = [];
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo))).$data;

    parts.push(productContext.Parts());
    return parts;
}


function getNumParts() {
    var products = ko.contextFor(document.querySelector(".ord-prod-body")).$parent.OrderProducts();
    var n = 0;
    for(var product = 0; product < products.length; product++) {
        n += products[product].Parts().length;
    }
    return n;
}
function getNumPartsInProduct(productNo) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo))).$data;
    return productContext.Parts().length;
}
function getPartIntrinsicWidth(productNo, partNo) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo))).$data;
    var part = productContext.Parts()[partNo - 1];
    return parseFloat(part.Part.ParentWidth);
}
function getPartIntrinsicHeight(productNo, partNo) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo))).$data;
    var part = productContext.Parts()[partNo - 1];
    return parseFloat(part.Part.ParentHeight);
}
function getPartIntrinsicWeight(productNo, partNo) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo))).$data;
    var part = productContext.Parts()[partNo - 1];
    return parseFloat(part.Part.Weight);
}
function getPartIntrinsicThickness(productNo, partNo) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo))).$data;
    var part = productContext.Parts()[partNo - 1];
    return parseFloat(part.Part.Thickness);
}
function getPartIntrinsicColor(productNo, partNo) {
    var productContext = ko.contextFor(document.querySelector(Field.Product(productNo))).$data;
    var part = productContext.Parts()[partNo - 1];
    return part.Part.Color();
}

function getProductPrice(productNo) {
    var products = ko.contextFor(document.querySelector(".ord-prod-body")).$parent.OrderProducts();
    return products[productNo - 1].ProductTotal();
}

var loadingDivs;
function isLoading() {
    var a = false, b = false;
    //if (executed==false) {
    //    executed = true;
    loadingDivs = document.querySelectorAll("div[id^='ord_prod_model_item_']>div.loading");
    // }

    if(document.querySelector("body > div.upForLinks") != null) {
        if(document.querySelector("body > div.upForLinks").style.display == "block") a = true;
    }
    for(var i = 0; i < loadingDivs.length; i++) {
        if(loadingDivs[i].style.display == "block") b = true;
    }

    var isLoading = a || b;
    return isLoading;
}
function isSaveInProgress() {
    return OrderInitialize.OrderInformationAjaxInProcess;
}
function isConfirmingModalYesNoOpen() {
    if(document.querySelector("#simplemodal-container")) return true;
    return false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var Field = {
    Product: function(productNo) {
        return "#ord_prod_model_item_" + getRealProductNo(productNo);
    },
    Product_ProvidesRealNo: function(productNo) {
        return "#ord_prod_model_item_" + productNo;
    },
    EditPartBtn: function(productNo, partNo) {
        return "#lbEditPart_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo);
    },
    LinkedBtn: function(productNo, partNo) {
        var realProductNo = getRealProductNo(productNo);
        var realPartNo = getRealPartNo(productNo, partNo);
        return "#ord_prod_part_" + realProductNo + "_" + realPartNo;
    },
    WidthField: function(productNo, partNo) {
        return "#txtWidth_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + "_clone";
    },
    HeightField: function(productNo, partNo) {
        return "#txtHeight_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + "_clone";
    },
    NameField: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " > div.ord-prod-part-header > span:nth-child(6) > input";
    },
    PartBorderField: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo);
    },
    PriceFieldTotal: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_105";
    },
    PriceFieldEach: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_92";
    },
    PartQtyField: function(productNo, partNo) {
        return "#txtQuantity_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo);
    },
    ProductQtyField: function(productNo) {
        return "#productQuantity_" + getRealProductNo(productNo);
    },
    MarkupField: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_107";
    },
    MarkupFieldEach: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_96";
    },
    LinkedToGroupTickbox: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " > div.ord-prod-part-header > span:nth-child(5) > input[type=checkbox]";
    },
    GroupBtn: function(productNo, partNo) {
        return "#ord-prod-model-content_" + getRealProductNo(productNo) + " > div.ord-prod-header > div:nth-child(2) > span:nth-child(1) > a";
    },
    UnGroupBtn: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " > div.ord-prod-part-header > span:nth-child(6) > a";
    },
    SwitchPartBtn: function(productNo, partNo) {
        return "#hlSwitchPart_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo);
    },
    ArtworkTimeTotal: function(productNo, partNo) {
        var realProductNo = getRealProductNo(productNo);
        var realPartNo = getRealPartNo(productNo, partNo);
        var fields = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo).querySelectorAll("input[id^='data_id_']");
        return [fields[0], fields[1], fields[2]];
    },
    ArtworkTimeEach: function(productNo, partNo) {
        var realProductNo = getRealProductNo(productNo);
        var realPartNo = getRealPartNo(productNo, partNo);
        var fields = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo).querySelectorAll("input[id^='data_id_']");
        return [fields[0], fields[1], fields[2]];
    },
    ProductionTime: function(productNo, partNo) {
        var realProductNo = getRealProductNo(productNo);
        var realPartNo = getRealPartNo(productNo, partNo);
        var fields = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo).querySelectorAll("input[id^='data_id_']");
        return [fields[0], fields[1], fields[2]];
    },
    //--------INSTALL-------//
    InstallTimeEach: function(productNo, partNo) {
        var realProductNo = getRealProductNo(productNo);
        var realPartNo = getRealPartNo(productNo, partNo);
        var min = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo + " #data_id_523");
        var hour = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo + " #data_id_524");
        var day = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo + " #data_id_525");
        return [min, hour, day];
    },
    InstallTimeTotal: function(productNo, partNo) {
        var realProductNo = getRealProductNo(productNo);
        var realPartNo = getRealPartNo(productNo, partNo);
        var min = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo + " #data_id_532");
        var hour = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo + " #data_id_533");
        var day = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo + " #data_id_534");
        return [min, hour, day];
    },
    InstallTypeEach: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #modifierDynamicDataView_" + getRealPartNo(productNo, partNo) + "_" + 1 + " #pnlInputPanel_List0 > select";//Find better solution rather than using first index.
    },
    InstallTypeTotal: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #modifierDynamicDataView_" + getRealPartNo(productNo, partNo) + "_" + 1 + " #pnlInputPanel_List0 > select";//Find better solution rather than using first index.
    },
    //--------TRAVEL-------//
    TravelTimeEach: function(productNo, partNo) {
        var realProductNo = getRealProductNo(productNo);
        var realPartNo = getRealPartNo(productNo, partNo);
        var min = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo + " #data_id_509");
        var hour = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo + " #data_id_510");
        var day = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo + " #data_id_511");
        return [min, hour, day];
    },
    TravelTimeTotal: function(productNo, partNo) {
        var realProductNo = getRealProductNo(productNo);
        var realPartNo = getRealPartNo(productNo, partNo);
        var min = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo + " #data_id_506");
        var hour = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo + " #data_id_507");
        var day = document.querySelector("#ord_prod_part_" + realProductNo + "_" + realPartNo + " #data_id_508");
        return [min, hour, day];
    },
    TravelTypeEach: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #modifierDynamicDataView_" + getRealPartNo(productNo, partNo) + "_" + 2 + " #pnlInputPanel_List0 > select";//Find better solution rather than using first index.
    },
    TravelTypeTotal: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #modifierDynamicDataView_" + getRealPartNo(productNo, partNo) + "_" + 2 + " #pnlInputPanel_List0 > select";//Find better solution rather than using first index.
    },
    //--------PAINTING-------//
    PaintLitresEach: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_521";
    },
    PaintLitresTotal: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_522";
    },
    PaintColourMatchTimeEach: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_491";
    },
    PaintColourMatchTimeTotal: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_486";
    },
    PaintNumberCoatsEach: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_493";
    },
    PaintNumberCoatsTotal: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_488";
    },
    PaintSetupTimeEach: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_492";
    },
    PaintSetupTimeTotal: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_487";
    },
    PaintFlashTimeEach: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_494";
    },
    PaintFlashTimeTotal: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_489";
    },
    PaintSprayTimeEach: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_495";
    },
    PaintSprayTimeTotal: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_490";
    },
    //--------ROUTER CUTTING-------//
    RouterSetupTimeTotal: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_479";
    },
    RouterSetupTimeEach: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_543";
    },
    RouterSetupOnceOff: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_546";
    },
    RouterRunTimeTotal: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_480";
    },
    RouterRunTimeEach: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_544";
    },
    RouterPostJobTimeTotal: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_481";
    },
    RouterPostJobTimeEach: function(productNo, partNo) {
        return "#ord_prod_part_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " #data_id_545";
    },
    //--------SAVE PART-------//
    SavePartBtn: function(productNo, partNo) {
        return "#pnlEditModePanel_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " > div:nth-child(4) > a";
    },
    SavePartBtn_Closed: function(productNo, partNo) {
        if(document.querySelector("#lbEditPart_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo)).style.display != "none") return true;
        else return false;
    },
    QuickProductSearchField: function(productNo, partNo) {
        return "#txSearch";
    },
    AddQuickProductBtn: function(productNo, partNo) {
        return "#hlAddQuickProduct";
    },
    AddQuickProduct_Closed: function(productNo, partNo) {
        if(document.querySelector("#divPredefinedProductsSearchModal").style.display != "block") return true;//is closed;
        else return false;//not closed
    },
    QuickProductSearchFirstItem: function(productNo, partNo) {
        return "#PredefinedProducts > tbody > tr > td.sorting_1";
    },
    //---------ADD PART---------//
    AddPartBtn: function(productNo, partNo) {
        return "#ord-prod-model-content_" + getRealProductNo(productNo) + " > div.ord-prod-footer > div.lbAdd > #lnkAddPart";
    },
    AddPartBtn_Visible: function(productNo, partNo) {
        if(document.querySelector("#ord-prod-model-content_" + getRealProductNo(productNo) + " > div.ord-prod-header > div:nth-child(2) > span:nth-child(1) > a") != null) return true;//is visible
        else return false;//not visible
    },
    AddPartSearchField: function(productNo, partNo) {
        return "#tblPartSearch_filter > label > input[type=text]";
    },
    AddPartSearchFirstItem: function(productNo, partNo) {
        return "#tblPartSearch_loadedParts > tr:nth-child(1) > td.sorting_1";
    },
    AddPart_Closed: function(productNo, partNo) {
        if(document.querySelector("#modalPartSearch").style.display != "block") return true;//is closed;
        else return false;//not closed
    },
    //----------MODIFIERS----------//
    AddModifierBtn: function(productNo, partNo) {
        return "#pnlEditModePanel_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " > div:nth-child(5) > a";
    },
    AddModifierBtn_Visible: function(productNo, partNo) {
        if(document.querySelector("#pnlEditModePanel_" + getRealProductNo(productNo) + "_" + getRealPartNo(productNo, partNo) + " > div:nth-child(5) > a") != null) return true;//is visible
        else return false;//not visible
    },
    AddModifierSearchField: function(productNo, partNo) {
        return "#modalSelectAdditionalModifier > div.modalSectionBg > div:nth-child(8) > input";
    },
    AddModifierSearchFirstItem: function(productNo, partNo) {
        return "body > ul:nth-child(33) > li > a";
    },

};
function modalsOpen() {
    var a = document.querySelector("#modalPartSearch").style.display == "block";
    var b = document.querySelector("#divPredefinedProductsSearchModal").style.display == "block";
    var c = document.querySelector("#modalPartSearch").style.display == "block";

    if(a == true || b == true || c == true) return true;
    else return false;
}

var executed = false;
function resetExecuted() {
    executed = false;
}

async function LoopUntil(condition, intervalMS = 10) {

    await new Promise(resolve => {
        var resolvedStatus = 'reject';
        var timer = setInterval(() => {

            let conditionMet = false;
            if(typeof (condition) == "function") {
                conditionMet = condition();
            } else condition = condition;

            if(conditionMet == true) {
                resolvedStatus = 'fulfilled';
                resolve();
                clearInterval(timer);
                timer = undefined;
            } else {
                resolvedStatus = 'reject';
            }
        }, intervalMS);
    });
}
