var GLOBAL_KO_ORDER = null;

function getKOStorageVariable() {
	let product = document.querySelector('div[class^="ord-prod-model-item"]');
	let db = ko.contextFor(product).$parent.AvalaraDocCodeStatus;

	if(!db) return {};

	if(typeof db == "string") return JSON.parse(db.replaceAll("~", " ").replaceAll("^", '"'));

}

function setKOStorageVariable(newObject) {
	console.log("setting ko obj to ", newObject);

	let product = document.querySelector('div[class^="ord-prod-model-item"]');
	ko.contextFor(product).$parent.AvalaraDocCodeStatus = JSON.stringify(newObject).replaceAll(" ", "~").replaceAll('"', "^");
}

function parseKOStorageVariable(koString) {
	return koString.replaceAll(" ", "~").replaceAll('"', "^");
}

function partInfoTick() {
	products = document.querySelectorAll('div[class^="ord-prod-model-item"]');

	var firstPartSqm = null;
	var order_totalInstallPrice = 0;
	var order_totalInstallCost = 0;
	var orderMinimum_Profit = 0;
	var orderMinimum_Profit_InstallJob = 0;
	var orderMinimum_Price = 0;
	var containsOtherInformation = false;
	var containsAnyInstall = false;
	totalOrderCost = 0;
	let partCombinedPrice = 0;
	let partCombinedPrice_anyIsTicked = false;

	//******************************//
	//           PRODUCT            //
	//******************************//

	//console.log(ko.contextFor(products[0]).$parent.AvalaraDocCode);
	GLOBAL_KO_ORDER = ko.contextFor(products[0]).$parent;
	//ko.contextFor(products[0]).$parent.TaxJarDocCode = "{quoteSeconds_Stored: 0}";
	for(var product = 0; product < products.length; product++) {
		var koProduct = ko.contextFor(products[product]).$data;
		var koParts = koProduct.Parts();
		let koProductNumber = koProduct.LineItemOrder();
		let koProductPricePreDiscount = koProduct.PartTotals();
		let koProductPricePostDiscount = koProduct.TotalPrice();

		//AVALARA
		if(product == 0) {
			if(quoteSeconds_Total == 0) {
				quoteSeconds_Stored = zeroIfNull(ko.contextFor(products[product]).$parent.AvalaraDocCode);
				quoteSeconds_Total = quoteSeconds_Stored + quoteSeconds_CurrentSession;
			} else {
				quoteSeconds_Total = quoteSeconds_Stored + quoteSeconds_CurrentSession;
				ko.contextFor(products[product]).$parent.AvalaraDocCode = quoteSeconds_Total;
			}
		}

		/*
		if(product == 0) {
			let currentAvalara = ko.contextFor(products[product]).$parent.AvalaraDocCode;
			let databaseVar = ko.contextFor(products[product]).$parent.PhoneValidation;
			if(quoteSeconds_Total == 0) {
				//console.log(typeof JSON.parse(ko.contextFor(products[product]).$parent.AvalaraDocCode), ko.contextFor(products[product]).$parent.AvalaraDocCode);

				if(currentAvalara == null || currentAvalara == "")
					ko.contextFor(products[product]).$parent.AvalaraDocCode =0;
				//if(typeof JSON.parse(currentAvalara) == "number")
				//	ko.contextFor(products[product]).$parent.AvalaraDocCode = {"quoteSeconds_Stored": currentAvalara};

				//console.log(currentAvalara);
				let avalaraObject = currentAvalara;//JSON.parse(currentAvalara.replace("[", '"').replace("]", '"'));
				console.log(avalaraObject);
				quoteSeconds_Stored = zeroIfNull(avalaraObject.quoteSeconds_Stored);
				quoteSeconds_Total = quoteSeconds_Stored + quoteSeconds_CurrentSession;
			} else {
				quoteSeconds_Total = quoteSeconds_Stored + quoteSeconds_CurrentSession;

				let avalaraObject = currentAvalara;//JSON.parse(currentAvalara.replace("[", '"').replace("]", '"'));
				avalaraObject.quoteSeconds_Stored = quoteSeconds_Total;
				ko.contextFor(products[product]).$parent.AvalaraDocCode = avalaraObject;//JSON.stringify(avalaraObject);
			}
		}*/
		SqmPriceGroup = 0;
		PriceGroup = 0;
		totalNumberOfProducts = products.length;
		productQty = parseInt(koProduct.Qty());
		parts = products[product].querySelectorAll('div[id^="ord_prod_part_"]');
		var prevPartNameNumber;
		var groupCounter = 0;
		var partsInGroup = 0;
		partInfo = products[product].querySelectorAll('span[id^="lblPartInformation_"]');
		if(products[product].querySelectorAll(".addOpenAllBtn").length == 0) {
			createOpenPartsBtn(products[product].querySelector("div.ord-prod-header > div:nth-child(2)"), "addOpenAllBtn", product + 1, products[product]);
		}
		if(products[product].querySelectorAll(".addCloseAllBtn").length == 0) {
			createClosePartsBtn(products[product].querySelector("div.ord-prod-header > div:nth-child(2)"), "addCloseAllBtn", product + 1, products[product]);
		}
		if(products[product].querySelectorAll(".moveProductBtn").length == 0) {
			createMoveProductBtn(products[product].querySelector("div.ord-prod-header > div:nth-child(2)"), "moveProductBtn", koProduct.LineItemOrder() - 1, products[product]);
		}
		if(products[product].querySelectorAll(".addArtworkBtn").length == 0) {
			createAddArtworkBtn(products[product].querySelector(".ord-prod-footer"), "addArtworkBtn", product + 1, products[product]);
		}
		if(products[product].querySelectorAll(".addInstallBtn").length == 0) {
			createAddInstallBtn(products[product].querySelector(".ord-prod-footer"), "addInstallBtn", product + 1, products[product]);
		}
		if(products[product].querySelectorAll(".addProductionBtn").length == 0) {
			createAddProductionBtn(products[product].querySelector(".ord-prod-footer"), "addProductionBtn", product + 1, products[product]);
		}
		if(products[product].querySelectorAll(".addRouterBtn").length == 0) {
			createAddRouterBtn(products[product].querySelector(".ord-prod-footer"), "addRouterBtn", product + 1, products[product]);
		}
		if(products[product].querySelectorAll(".addPaintingBtn").length == 0) {
			createAddPaintingBtn(products[product].querySelector(".ord-prod-footer"), "addPaintingBtn", product + 1, products[product]);
		}
		if(products[product].querySelectorAll(".addKitEaBtn").length == 0) {
			createAddKitBtn(products[product].querySelector(".ord-prod-footer"), "addKitEaBtn", product + 1, products[product]);
		}
		if(products[product].querySelectorAll(".addBreakBtn").length == 0) {
			createAddBreakBtn(products[product].querySelector(".ord-prod-footer"), "addBreakBtn", product + 1, products[product]);
		}
		if(products[product].querySelectorAll(".addMissingBtn").length == 0) {
			createAddMissingBtn(products[product].querySelector(".ord-prod-footer"), "addMissingBtn", product + 1, products[product]);
		}

		//******************************//
		//            PART              //
		//******************************//
		for(var part = 0; part < parts.length; part++) {
			let koPart = koParts[part];
			let koNextPart = part + 1 >= parts.length ? null : koParts[part + 1];
			let koCostFor1 = koPart.CalculatedBasePartCostEach;
			let koPartQty = koPart.CalculatedTotalPartQuantity;
			let koPartTotalCost = koCostFor1 * koPartQty;
			//NOTE: Cant use KO for cost because Corebridge is shit.
			let koPartTotalPrice = koPart.CalculatedPartTotalRetailTotal;
			let koPartName = koPart.Part.DetailedName;
			let koPartNameNumber = koPart.GetPartHeader();
			let koNextPartNameNumber = koNextPart !== null ? koNextPart.GetPartHeader() : "";
			let koPartWidth = (koPart.Width()) * 25.4;
			let koPartHeight = (koPart.Height()) * 25.4;
			var partHasInstall = false;
			let koPartDescription = koPart.PartDescription();

			let p1 = parts[part];

			if(!p1.classList.contains("itemDragOver")) {
				p1.classList.add("itemDragOver");
				p1.addEventListener("dragover", (e) => {
					e.preventDefault();

					if(!p1.classList.contains("dragOver")) {
						p1.classList.add("dragOver");
					}
				});
			}
			if(!p1.classList.contains("itemDragLeave")) {
				p1.classList.add("itemDragLeave");
				p1.addEventListener("dragleave", (e) => {
					e.preventDefault();

					if(p1.contains(document.elementFromPoint(e.clientX, e.clientY))) {
						return;
					}

					p1.classList.remove("dragOver");
				});
			}

			if(!p1.classList.contains("itemDrop")) {
				p1.classList.add("itemDrop");
				p1.addEventListener("drop", (e) => {
					p1.classList.remove("dragOver");
					onPartOverDrop(e, p1, koProductNumber, getPartIndexFromReal(koProductNumber, koPart.Index));
				});
			}

			partCost = 0;
			partCostElement = parts[part].querySelectorAll("span[id^='viewModeLblPartTotalCostTotal']");
			let costResult = 0;
			for(var x = 0; x < partCostElement.length; x++) {
				let c = partCostElement[x].innerText.replace(/\$|,/g, '');
				if(c != "-.--") {
					costResult += zeroIfNaN(parseFloat(c));
				}
				if(x == partCostElement.length - 1) {
					partCost = costResult;
					productTotalCost += partCost;
				}
			}

			productTotalPrice += koPartTotalPrice;

			partQty = koPartQty;

			if(koPartName != null) {
				partHasInstall = koPartName.toLowerCase().includes("install");
				if(partHasInstall) containsAnyInstall = true;

				if(koPartName.includes("Other Information")) {
					containsOtherInformation = koPartName.includes("Other Information");
				}
			}
			if(koPartDescription.includes("@")) {
				parts[part].querySelector(".ord-prod-part-header").style.backgroundColor = COLOUR.Yellow;
			} else if(koPartDescription.includes("?")) {
				parts[part].querySelector(".ord-prod-part-header").style.backgroundColor = COLOUR.Red;
			} else {
				parts[part].querySelector(".ord-prod-part-header").style.backgroundColor = "#eee";
			}

			if(koPartDescription.includes("TRAVEL [Automatic]") || koPartDescription.includes("CODE [Automatic]")) {
				let relevantPart = parts[part].querySelector(".txtPartDescription");
				relevantPart.disabled = true;
				relevantPart.style.color = COLOUR.Blue;
				relevantPart.style.border = "0px";
			}



			if(part == 0) prevPartNameNumber = partNameNumber;
			partsInGroup++;
			productNumber = product + 1;
			partNumber = part + 1;
			partNameNumber = parseFloat(koPartNameNumber.replace("Part ", ""));
			var nextPartNameNumber;
			if(partNumber + 1 <= parts.length) nextPartNameNumber = parseFloat(koNextPartNameNumber.replace("Part ", ""));
			else nextPartNameNumber = 0;

			var partHasLoaded = (koPartName != "") || (koPartName == null) || (isNaN(koPartName));

			if(parts[part].querySelectorAll(".copyPartBtn").length == 0) {
				createCopyPartBtn(parts[part].querySelector(".ord-prod-part-header"), "copyPartBtn", parts[part]);
			}

			if(parts[part].querySelectorAll(".partNameBtn").length == 0 && partHasLoaded) {
				//console.log(parts[part].querySelectorAll("span[id^='lblPartInformation_']"));
				//let nameElement = parts[part].querySelectorAll("span[id^='lblPartInformation_']")[0].innerText;
				//console.log(nameElement);
				//let name2 = nameElement ? nameElement.split("Name: ")[1] : "";
				//console.log(name2);
				//let name = name2 ? name2.split("Part")[0] : "";
				//console.log(name);
				createNameBtn(parts[part].querySelector(".ord-prod-part-header"), "partNameBtn", parts[part].querySelector(".txtPartDescription"), koPartName);
			}

			partPrice = koPartTotalPrice;

			/*
			if(parts[part].querySelectorAll(".partCombinedPrice").length == 0) {
				createPartCombinedPrice(parts[part].querySelector(".ord-prod-part-header"), "partCombinedPrice", parts[part]);
			}
			if(parts[part].querySelectorAll(".partCombinedPrice").length != 0) {
				if(parts[part].querySelectorAll(".partCombinedPrice")[0].checked) {
					partCombinedPrice += partPrice;
					partCombinedPrice_anyIsTicked = true;
				}
			}*/

			if(parts[part].querySelectorAll(".partPrice").length == 0) {
				let label = createLabel("$" + partPrice, "color:blue;font-weight:bold;width:80px;height:30px;font-size:14px;float:right;", parts[part].querySelector(".ord-prod-part-header"));
				label.className = "partPrice";

				parts[part].querySelector(".txtPartDescription").style.cssText += "width:240px;";
			} else {
				parts[part].querySelector(".partPrice").innerText = "$" + partPrice;
			}




			if(partHasInstall && partPrice == 0) {
				setPartBorderColour(product + 1, part + 1, "red");
			}

			if(partHasInstall) {
				global_orderContainsAnInstall = true;
				order_totalInstallPrice += partPrice;
				order_totalInstallCost += partCost;
			}
			if(koPartWidth > 0 && koPartHeight > 0) {
				width = koPartWidth;
				height = koPartHeight;

				//if part doesn't contains SQM class already, then add it
				if(partInfo[part].querySelectorAll(".sqmElement").length == 0) {
					createText(partInfo[part], "sqmElement", "SQM: ");
					updateTextSQM(partInfo[part], ".sqmElement", "SQM: ");
				}
				//if does contains SQM, just update
				else {
					updateTextSQM(partInfo[part], ".sqmElement", "SQM: ");
				}

				//if doesn't contains
				if(partInfo[part].querySelectorAll(".sqmCostEachElement").length == 0) {
					createText(partInfo[part], "sqmCostEachElement", "Cost/Sqm (Self):");
					updateTextCostSQMEach(partInfo[part], ".sqmCostEachElement", "Cost/Sqm (Self):");
				}
				//if does contains
				else {
					updateTextCostSQMEach(partInfo[part], ".sqmCostEachElement", "Cost/Sqm (Self):");
				}

				//if doesn't contains
				if(partInfo[part].querySelectorAll(".costingHR").length == 0) {
					addHR(partInfo[part], "costingHR");
				}

				//if doesn't contains
				if(partInfo[part].querySelectorAll(".sqmPriceEachElement").length == 0) {
					createText(partInfo[part], "sqmPriceEachElement", "Price/Sqm (Self):");
					updateTextPriceSQMEach(partInfo[part], ".sqmPriceEachElement", "Price/Sqm (Self):");
				}
				//if does contains
				else {
					updateTextPriceSQMEach(partInfo[part], ".sqmPriceEachElement", "Price/Sqm (Self):");
				}

				SqmPriceGroup += partPrice / partSqm;
				PriceGroup += partPrice;

				if(nextPartNameNumber != partNameNumber) {
					for(var part2 = 0; part2 < partsInGroup; part2++) {
						//if doesn't contains
						if(partInfo[groupCounter + part2].querySelectorAll(".sqmPriceGroupElement").length == 0) {
							createText(partInfo[groupCounter + part2], "sqmPriceGroupElement", "Price/Sqm (Group):");
							updateTextPriceSQMGroup(partInfo[groupCounter + part2], ".sqmPriceGroupElement", "Price/Sqm (Group):");
						}
						//if does contains SQM
						else {
							updateTextPriceSQMGroup(partInfo[groupCounter + part2], ".sqmPriceGroupElement", "Price/Sqm (Group):");
						}

						//if doesn't contains
						if(partInfo[groupCounter + part2].querySelectorAll(".priceGroupElement").length == 0) {
							createText(partInfo[groupCounter + part2], "priceGroupElement", "Price (Group):");
							updateTextPriceGroup(partInfo[groupCounter + part2], ".priceGroupElement", "Price (Group):");
						}
						//if does contains SQM
						else {
							updateTextPriceGroup(partInfo[groupCounter + part2], ".priceGroupElement", "Price (Group):");
						}
					}
					SqmPriceGroup = 0;
					PriceGroup = 0;
				}
			} else {
				partSqm = null;
			}

			if(part == 0) {firstPartSqm = partSqm;};

			if(nextPartNameNumber != partNameNumber) {
				groupCounter = part + 1;
				partsInGroup = 0;
			}
			prevPartNameNumber = partNameNumber;
		}

		var classProductTotals = document.getElementsByClassName("classProductTotals")[product];
		var classProductTotalsTable = classProductTotals.getElementsByTagName('tbody')[0];
		var rowsL = classProductTotals.getElementsByTagName("tr").length;
		if(rowsL <= 6) {
			$(classProductTotals).find('tbody').append("<tr><td></td><td>Profit</td><td>$0</td></tr>");
		}
		if(rowsL <= 7) {
			$(classProductTotals).find('tbody').append("<tr><td></td><td>Price/Sqm</td><td>$0</td></tr>");
		}
		if(rowsL <= 8) {
			$(classProductTotals).find('tbody').append("<tr><td></td><td>Total Cost</td><td>$0</td></tr>");
		}

		$(classProductTotals).find('tbody tr:nth-child(5)').html("<td></td><td>Total Cost:</td><td>$" + roundNumber(productTotalCost, 2) + "</td>").css("color", COLOUR.Blue).css("font-weight", "bold");
		var profit = koProductPricePostDiscount - productTotalCost;
		$(classProductTotals).find('tbody tr:nth-child(6)').html("<td></td><td>Total Profit:</td><td>$" + roundNumber(profit, 2) + "</td>").css("color", COLOUR.Blue).css("font-weight", "bold");
		$(classProductTotals).find('tbody tr:nth-child(7)').html("<td></td><td>Price/Sqm:</td><td>$" + roundNumber(koProductPricePostDiscount / firstPartSqm, 2) + "</td>").css("color", COLOUR.Blue).css("font-weight", "bold");
		if(containsAnyInstall) {
			orderMinimum_Profit_InstallJob += profit;
		}

		totalOrderCost += productTotalCost;
		profit = 0;
		productTotalPrice = 0;
		productTotalCost = 0;
		firstPartSqm = 0;
	}

	//******************************//
	//            ORDER             //
	//******************************//

	//Combined Price
	if(partCombinedPrice_anyIsTicked) {
		document.getElementById("partCombinedPriceContainer").innerHTML = "Combined: <br>$" + roundNumber(partCombinedPrice, 2);
		showPartCombinedPrice();
	} else {
		document.getElementById("partCombinedPriceContainer").innerHTML = "Combined: <br>$" + 0;
		hidePartCombinedPrice();
	}

	partCombinedPrice = 0;
	totalOrderPricePreGst = parseFloat(document.querySelector('#newSubtotalValue').innerText.replace(/\$|,/g, ''));
	totalOrderPriceIncGst = totalOrderPricePreGst * 1.1;
	orderMinimum_Price = totalOrderPricePreGst;
	totalOrderProfit = totalOrderPricePreGst - totalOrderCost;
	orderMinimum_Profit = totalOrderProfit;
	global_containsOtherInformation = containsOtherInformation;
	if(containsAnyInstall) {
		installSummary.price = order_totalInstallPrice;
		installSummary.cost = order_totalInstallCost;
		if(order_totalInstallPrice < global_orderMinimum_Price_Install || (order_totalInstallPrice == 0 == global_orderMinimum_Price_Install)) {
			addLogText(error_global_orderMinimum_Price_Install.name, error_global_orderMinimum_Price_Install.value);
		} else {
			removeLogText(error_global_orderMinimum_Price_Install.name);
		}
		if(orderMinimum_Profit_InstallJob < global_orderMinimum_Profit_InstallJob || (orderMinimum_Profit_InstallJob == 0 == global_orderMinimum_Profit_InstallJob)) {
			addLogText(error_global_orderMinimum_Profit_InstallJob.name, error_global_orderMinimum_Profit_InstallJob.value);
		} else {
			removeLogText(error_global_orderMinimum_Profit_InstallJob.name);
		}
	} else {
		installSummary.price = 0;
		installSummary.cost = 0;
		removeLogText(error_global_orderMinimum_Price_Install.name);
		removeLogText(error_global_orderMinimum_Profit_InstallJob.name);
	}
	if(orderMinimum_Profit < global_orderMinimum_Profit || (orderMinimum_Profit == 0 == global_orderMinimum_Profit)) {
		addLogText(error_global_orderMinimum_Profit.name, error_global_orderMinimum_Profit.value);
	} else {
		removeLogText(error_global_orderMinimum_Profit.name);
	}
	if(orderMinimum_Price < global_orderMinimum_Price || (orderMinimum_Price == 0 == global_orderMinimum_Price)) {
		addLogText(error_global_orderMinimum_Price.name, error_global_orderMinimum_Price.value);
	} else {
		removeLogText(error_global_orderMinimum_Price.name);
	}
	var conditional = false;
	if(document.getElementById("step1SubText").innerHTML == "Estimate Details") {
		if(document.getElementById("orderStep1Btn").classList.contains("btnstp-step-selected")) conditional = false;
		else conditional = true;
	} else if(document.getElementById("step1SubText").innerHTML == "Create Products") {
		conditional = true;
	} else {
		conditional = false;
	}
	if(logContainsErrors() && conditional) ensureStepButtonsHidden();
	else ensureStepButtonsSeen();

	function createOpenPartsBtn(partInstance, classN, productIndex, productInstance) {
		let btn = createButton("Open", "height:27px;min-height:27px;width:68px;padding:0px;margin:0px 5px;font-size:11px;", async function() {
			var l_ProductIndex = ko.contextFor(productInstance).$data.Index;
			await OpenPartBtn(l_ProductIndex);
		}, partInstance);
		btn.className = classN;
	}

	function createClosePartsBtn(partInstance, classN, productIndex, productInstance) {
		let btn = createButton("Close", "height:27px;min-height:27px;width:68px;padding:0px;margin:0px 5px;font-size:11px;", async function() {
			var l_ProductIndex = ko.contextFor(productInstance).$data.Index;
			await ClosePartBtn(l_ProductIndex);
		}, partInstance);
		btn.className = classN;
	}

	function createMoveProductBtn(partInstance, classN, productIndex, productInstance) {
		let btn = createButton("Move", "height:27px;min-height:27px;width:68px;padding:0px;margin:0px 5px;font-size:11px;", async function() {
			let l_currentProductIndex = ko.contextFor(productInstance).$data.LineItemOrder() - 1;
			let l_newProductIndex = 0;
			let modal = new ModalMoveProduct("Move Product To...", async function() {
				l_newProductIndex = parseInt(modal.value) - 1;
				console.log(productInstance);
				await MoveProduct(l_currentProductIndex, l_newProductIndex);
			});
		}, partInstance);
		btn.className = classN;
	}

	function createText(partInstance, classN, innerN) {
		var text = document.createElement("span");
		text.style = "float:left; width:250px; font-weight:bold;color:" + COLOUR.Blue + ";";
		text.className = classN;
		text.innerHTML = innerN;
		partInstance.appendChild(text);
	}

	function createNameBtn(partInstance, classN, inputElement, newTextElement) {
		let btn = createButton("Update", "height:27px;min-height:29px;width:60px;padding:0px;margin:0px 5px;font-size:11px;", function() {
			var event = new Event('change');
			$(inputElement).val(newTextElement).change();
			inputElement.dispatchEvent(event);
			$(inputElement).off("change");
		}, partInstance);
		btn.className = classN;
	}

	function createCopyPartBtn(partHead, classN, partInstance) {
		let btn = createButton("Copy", "height:27px;min-height:29px;width:50px;padding:0px;margin:0px 5px;font-size:11px;", function() {
			toggleCopyPartModal(partInstance);
		}, partHead);
		btn.className = classN;
	}

	function createPartCombinedPrice(partHead, classN, partInstance) {
		let btn = createCheckbox("", false, "width:15px;padding:0px;", () => { }, partHead);

		btn.className = classN;
	}


	function createAddArtworkBtn(partInstance, classN, productIndex, productInstance) {
		let btn = createButton("Artwork", "width:80px;height:31px;padding:0px;margin:2px;margin-left:10px;font-size:11px;", async function() {
			var l_ProductIndex = getProductIndexFromRealNo(ko.contextFor(productInstance).$data.Index);
			await AddPart("Artwork and Print Files", l_ProductIndex);
			var partIndex = getNumPartsInProduct(l_ProductIndex);
			await setPartDescription(l_ProductIndex, partIndex, "Artwork and Print Files");
		}, partInstance);
		btn.className = classN;
	}

	function createAddInstallBtn(partInstance, classN, productIndex, productInstance) {
		var createAddInstallBtn = createOptGroupDropdown(classN, partInstance, classN, "Add Install", 0, "width: 120px;margin-left:10px;font-size:11px;",
			[createDropdownOption("Install - IH (ea)", "Install - IH (ea)"),
			createDropdownOption("Install - IH", "Install - IH")],
			async function() {
				var productNo = getProductIndexFromRealNo(ko.contextFor(productInstance).$data.Index);
				await AddPart(createAddInstallBtn.value, productNo);
				var partIndex = getNumPartsInProduct(productNo);
				await setPartDescription(productNo, partIndex, createAddInstallBtn.value);
			});
	}
	function createAddProductionBtn(partInstance, classN, productIndex, productInstance) {
		var createAddProductionBtn = createOptGroupDropdown(classN, partInstance, classN, "Add Production", 0, "width: 120px;margin-left:10px;font-size:11px;",
			[createDropdownOption("Production (ea)", "Production (ea)"),
			createDropdownOption("Production (total)", "Production")],
			async function() {
				var productNo = getProductIndexFromRealNo(ko.contextFor(productInstance).$data.Index);
				await AddPart(createAddProductionBtn.value, productNo);
				var partIndex = getNumPartsInProduct(productNo);
				await setPartDescription(productNo, partIndex, createAddProductionBtn.value);
			});
	}
	function createAddRouterBtn(partInstance, classN, productIndex, productInstance) {
		var createAddRouterBtn = createOptGroupDropdown(classN, partInstance, classN, "Add Router", 0, "width: 120px;margin-left:10px;font-size:11px;",
			[createDropdownOption("Router (ea)", "Router Cutting (ea)"),
			createDropdownOption("Router (total)", "Router Cutting (total)")],
			async function() {
				var productNo = getProductIndexFromRealNo(ko.contextFor(productInstance).$data.Index);
				await AddPart(createAddRouterBtn.value, productNo);
				var partIndex = getNumPartsInProduct(productNo);
				await setPartDescription(productNo, partIndex, createAddRouterBtn.value);
			});
	}
	function createAddPaintingBtn(partInstance, classN, productIndex, productInstance) {
		var createAddPaintingBtn = createOptGroupDropdown(classN, partInstance, classN, "Add Painting", 0, "width: 120px;margin-left:10px;font-size:11px;",
			[createDropdownOption("Painting (ea)", "Painting - Valtspar 2Pac 2K (ea)"),
			createDropdownOption("Painting (total)", "Painting - Valtspar 2Pac 2K")],
			async function() {
				var productNo = getProductIndexFromRealNo(ko.contextFor(productInstance).$data.Index);
				await AddPart(createAddPaintingBtn.value, productNo);
				var partIndex = getNumPartsInProduct(productNo);
				await setPartDescription(productNo, partIndex, createAddPaintingBtn.value);
			});
	}
	function createAddKitBtn(partInstance, classN, productIndex, productInstance) {
		var div = document.createElement("div");
		div.style = "float: left; background-color: none;margin:0px;margin-left:10px;padding:2px;font-size:11px;";

		var dropdown = createDropdown("Add Kit", 0, STYLE.Button, null);
		dropdown.style = STYLE.Button + "width: 120px;margin:0px;font-size:11px;";
		dropdown.className = classN;
		dropdown.id = classN;
		dropdown.innerHTML = "Add Kit";
		var initialdropdownBackgroundColor = dropdown.style.backgroundColor;
		$(dropdown).hover(() => {
			$(dropdown).css("background-color", "white");
			$(dropdown).css("color", initialdropdownBackgroundColor);
		}, () => {
			$(dropdown).css("background-color", initialdropdownBackgroundColor);
			$(dropdown).css("color", "white");
		});

		var groups = [];
		groups.push(createOptGroup("Standard", [createDropdownOption("Orafol Vinyl + Gloss Lam"),
		createDropdownOption("Orafol Vinyl + Gloss Lam + App Tape")]));
		groups.push(createOptGroup("Window", [createDropdownOption("Whiteback + Gloss"),
		createDropdownOption("Grayback + Gloss"),
		createDropdownOption("Frosting (Plain)"),
		createDropdownOption("Frosting (Cutout)"),
		createDropdownOption("Frosting (Printed)")]));
		groups.push(createOptGroup("Oneway", [createDropdownOption("Shopfront Oneway + Lam"),
		createDropdownOption("Vehicle Oneway + Lam")]));
		groups.push(createOptGroup("Reverse", [createDropdownOption("Clear + Whiteback")]));
		groups.push(createOptGroup("3M", [createDropdownOption("3M Vinyl + 3M Lam")]));
		groups.push(createOptGroup("Translucent", [createDropdownOption("Trans Vinyl + Trans Lam")]));
		groups.push(createOptGroup("High Tac", [createDropdownOption("Hightac Vinyl + Satin Lam")]));

		groups.forEach(function(item) {
			dropdown.add(item);
		});
		div.appendChild(dropdown);

		var addBtn = createButton("+", "width:30px;", function() {
			let modal = new ModalWidthHeight("Enter Dimensions", 100, () => {addParts(dropdown.value, modal.width, modal.height);});
		});
		addBtn.style = STYLE.Button + "width:30px;margin:0px;margin-left:3px;";
		div.appendChild(addBtn);
		partInstance.appendChild(div);
		var initialBtnBackgroundColor = addBtn.style.backgroundColor;
		$(addBtn).hover(() => {
			$(addBtn).css("background-color", "white");
			$(addBtn).css("color", initialBtnBackgroundColor);
		}, () => {
			$(addBtn).css("background-color", initialBtnBackgroundColor);
			$(addBtn).css("color", "white");
		});

		async function addParts(part, width, height) {
			var l_ProductIndex = getProductIndexFromRealNo(ko.contextFor(productInstance).$data.Index);
			var name;
			if(part == "Orafol Vinyl + Gloss Lam") {
				name = VinylLookup["Air Release"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				name = LaminateLookup["Gloss"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				await GroupParts(l_ProductIndex);
			} else if(part == "Orafol Vinyl + Gloss Lam + App Tape") {
				name = VinylLookup["Air Release"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				name = LaminateLookup["Gloss"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				name = AppTapeLookup["Medium Tack"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				await GroupParts(l_ProductIndex);
			} else if(part == "Whiteback + Gloss") {
				name = VinylLookup["Whiteback"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				name = LaminateLookup["Gloss"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				await GroupParts(l_ProductIndex);
			} else if(part == "Grayback + Gloss") {
				name = VinylLookup["Blockout"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				name = LaminateLookup["Gloss"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				await GroupParts(l_ProductIndex);
			} else if(part == "Frosting (Plain)") {
				name = VinylLookup["Frosting"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name, false);
			} else if(part == "Frosting (Cutout)") {
				name = VinylLookup["Frosting"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				name = AppTapeLookup["Medium Tack"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				await GroupParts(l_ProductIndex);
			} else if(part == "Frosting (Printed)") {
				name = VinylLookup["Frosting Printed"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name, false);
			} else if(part == "Shopfront Oneway + Lam") {
				name = VinylLookup["Oneway Shopfront"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				name = LaminateLookup["Oneway Shopfront"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				await GroupParts(l_ProductIndex);
			} else if(part == "Vehicle Oneway + Lam") {
				name = VinylLookup["Oneway Vehicle"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				name = LaminateLookup["Oneway Vehicle"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				await GroupParts(l_ProductIndex);
			} else if(part == "Clear + Whiteback") {
				name = VinylLookup["Clear"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				name = VinylLookup["Whiteback"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				await GroupParts(l_ProductIndex);
			} else if(part == "3M Vinyl + 3M Lam") {
				name = VinylLookup["3M Vehicle"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				name = LaminateLookup["3m Gloss (Standard)"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				await GroupParts(l_ProductIndex);
			} else if(part == "Trans Vinyl + Trans Lam") {
				name = VinylLookup["Translucent Printed"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				name = LaminateLookup["Translucent"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				await GroupParts(l_ProductIndex);
			} else if(part == "Hightac Vinyl + Satin Lam") {
				name = VinylLookup["High Tack"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				name = LaminateLookup["Satin"];
				await AddPart(name, l_ProductIndex);
				await populateGenericDimensions(name);
				await GroupParts(l_ProductIndex);
			}
			Ordui.Alert("Done.");

			async function populateGenericDimensions(name, optionalTickSelected) {
				var partNoR = getNumPartsInProduct(l_ProductIndex);
				await setPartWidth(l_ProductIndex, partNoR, width);
				await setPartHeight(l_ProductIndex, partNoR, height);
				await setPartDescription(l_ProductIndex, partNoR, name);
				await savePart(l_ProductIndex, partNoR);
				await tickSelected(l_ProductIndex, partNoR, optionalTickSelected == null ? true : optionalTickSelected);
			}
		}
	}

	function createAddBreakBtn(partInstance, classN, productIndex, productInstance) {
		let btn = createButton("@", "width:50px;height:31px;padding:0px;margin:2px;margin-left:10px;font-size:11px;", async function() {
			var l_ProductIndex = getProductIndexFromRealNo(ko.contextFor(productInstance).$data.Index);
			await AddPart("No Cost Part", l_ProductIndex);
			var partIndex = getNumPartsInProduct(l_ProductIndex);
			await setPartDescription(l_ProductIndex, partIndex, "@");
			await savePart(l_ProductIndex, partIndex);
			await ClosePartBtn(l_ProductIndex);
		}, partInstance);
		btn.className = classN;
	}

	function createAddMissingBtn(partInstance, classN, productIndex, productInstance) {
		let btn = createButton("?", "width:50px;height:31px;padding:0px;margin:2px;margin-left:10px;font-size:11px;", async function() {
			var l_ProductIndex = getProductIndexFromRealNo(ko.contextFor(productInstance).$data.Index);
			await AddPart("No Cost Part", l_ProductIndex);
			var partIndex = getNumPartsInProduct(l_ProductIndex);
			await setPartDescription(l_ProductIndex, partIndex, "?");
			await savePart(l_ProductIndex, partIndex);
			await ClosePartBtn(l_ProductIndex);
		}, partInstance);
		btn.className = classN;
	}

	function ensureStepButtonsHidden() {
		document.getElementById("orderStepsBtn").style.display = "none";
		nextStepBtn.style.pointerEvents = "none";
		nextStepBtn.style.color = "#e1edd0";
		nextStepBtn2.style.pointerEvents = "none";
		nextStepBtn2.style.color = "#e1edd0";
		orderStep2Btn.style.pointerEvents = "none";
		orderStep2Btn.style.color = "#e1edd0";
		orderStep3Btn.style.pointerEvents = "none";
		orderStep3Btn.style.color = "#e1edd0";
		nextStepBtn2.style.pointerEvents = "none";
		nextStepBtn2.style.color = "#e1edd0";
	}
	function ensureStepButtonsSeen() {
		document.getElementById("orderStepsBtn").style.display = "block";
		nextStepBtn.style.pointerEvents = "initial";
		nextStepBtn.style.color = "black";
		nextStepBtn2.style.pointerEvents = "initial";
		nextStepBtn2.style.color = "black";
		orderStep2Btn.style.pointerEvents = "initial";
		orderStep2Btn.style.color = "black";
		orderStep3Btn.style.pointerEvents = "initial";
		orderStep3Btn.style.color = "black";
		nextStepBtn2.style.pointerEvents = "initial";
		nextStepBtn2.style.color = "black";
	}

	function updateNameBtn(partInstance, text) {
		partInstance.value = text;
	}

	function addHR(partInstance, classN) {
		var text = document.createElement("hr");
		text.className = classN;
		text.style = "margin-bottom:0px;";
		partInstance.appendChild(text);
	}

	function updateTextSQM(partInstance, classN, innerN) {
		partSqm = Math.round(((inchToMM(width) * inchToMM(height) / 1000000) * (partQty * productQty)) * 10000) / 10000;
		partInstance.querySelector(classN).innerHTML = innerN + partSqm;
	}

	function updateTextCostSQMEach(partInstance, classN, innerN) {
		partInstance.querySelector(classN).innerHTML = innerN + " $" + Math.round((partCost / partSqm) * 100) / 100 + "/㎡";
	}

	function updateTextPriceSQMEach(partInstance, classN, innerN) {
		partInstance.querySelector(classN).innerHTML = innerN + " $" + Math.round((partPrice / partSqm) * 100) / 100 + "/㎡";
	}

	function updateTextPriceSQMGroup(partInstance, classN, innerN) {
		partInstance.querySelector(".sqmPriceGroupElement").innerHTML = "Price/Sqm (Group): $" + Math.round((SqmPriceGroup) * 100) / 100 + "/㎡";
	}

	function updateTextPriceGroup(partInstance, classN, innerN) {
		partInstance.querySelector(".priceGroupElement").innerHTML = "Price (Group): $" + Math.round((PriceGroup) * 100) / 100 + " ($" + Math.round((PriceGroup / productQty) * 100) / 100 + " ea)";
	}

	order_totalInstallPrice = 0;
	order_totalInstallCost = 0;
	orderMinimum_Profit = 0;
	orderMinimum_Profit_InstallJob = 0;
	orderMinimum_Price = 0;
	containsAnyInstall = false;
	global_orderContainsAnInstall = false;
}


//*********************************//
//         Copy Part Modal         //
//*********************************//
var copyPartModal_Container;
var copyPartModal_Container_LHS;
var copyPartModal_Container_MHS;
var copyPartModal_Container_RHS;
var copyPartModal_Container_RHS_NewBlankProduct;
var copyPartModal_Container_Top;
var copyPartModal_Container_CopyBtn;
var copyPartModal_Container_CloseBtn;
function createCopyPartModal() {
	copyPartModal_Container = document.createElement('div');
	copyPartModal_Container.style = "display:none; width:800px;height:600px;background-color:#ddd;border:3px solid #999; position: fixed; top: 50%; left: 50%;z-index:1000;margin-top: -300px; margin-left: -400px";

	copyPartModal_Container_LHS = document.createElement('div');
	copyPartModal_Container_LHS.style = "float:left; width:45%;height:510px;background-color:#fff; z-index:1000;overflow: auto;";

	copyPartModal_Container_MHS = document.createElement('div');
	copyPartModal_Container_MHS.style = "float:left; width:10%;height:510px;background-color:#fff; z-index:1000;font-size:80px;font-weight:bold;display: flex;align-items: center; justify-content: center";
	copyPartModal_Container_MHS.innerText = "\u2192";

	copyPartModal_Container_RHS = document.createElement('div');
	copyPartModal_Container_RHS.style = "float:right; width:45%;height:510px;background-color:#fff;z-index:1000;overflow: auto;";

	copyPartModal_Container_RHS_NewBlankProduct = document.createElement('button');
	copyPartModal_Container_RHS_NewBlankProduct.style = "background-color:white;color:" + COLOUR.Blue + ";border:2px solid rgb(0, 100, 255);margin-top:10px;margin-left:10px;margin-right:10px;margin-bottom:0px;min-height:15px;width:93%;padding:5px;float:left;display:block;cursor: pointer;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;";
	$(copyPartModal_Container_RHS_NewBlankProduct).on('click', function() {
		if(this.style.background != "rgb(0, 100, 255)") {
			this.style.background = "rgb(0, 100, 255)";
			this.style.color = "white";
		} else if(this.style.background == "rgb(0, 100, 255)") {
			this.style.background = "white";
			this.style.color = COLOUR.Blue;
		}
	});
	copyPartModal_Container_RHS_NewBlankProduct.innerText = 'NEW PRODUCT';
	//copyPartModal_Container_RHS_NewBlankProduct.onclick=closeCopyModal;

	copyPartModal_Container_CopyBtn = document.createElement('button');
	copyPartModal_Container_CopyBtn.style = "font-size:20px;display: block; float: left; width: 96%; background-color: " + COLOUR.Blue + "; color: white; min-height: 45px; margin: 10px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;";
	copyPartModal_Container_CopyBtn.innerText = 'COPY';
	copyPartModal_Container_CopyBtn.onclick = async function() {
		await copyParts();
	};

	copyPartModal_Container_Top = document.createElement('div');
	copyPartModal_Container_Top.style = "float:left; width:100%;height:30px;background-color:#fff; z-index:1000;";

	copyPartModal_Container_CloseBtn = document.createElement('button');
	copyPartModal_Container_CloseBtn.style = "float:right;font-size:10px;display: block; width: 100px; background-color: rgb(0, 100, 255); color: white; height: 30px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;";
	copyPartModal_Container_CloseBtn.innerText = 'CLOSE';
	copyPartModal_Container_CloseBtn.onclick = closeCopyModal;

	copyPartModal_Container_Top.appendChild(copyPartModal_Container_CloseBtn);
	copyPartModal_Container.appendChild(copyPartModal_Container_Top);
	copyPartModal_Container.appendChild(copyPartModal_Container_LHS);
	copyPartModal_Container.appendChild(copyPartModal_Container_MHS);
	copyPartModal_Container.appendChild(copyPartModal_Container_RHS);
	copyPartModal_Container.appendChild(copyPartModal_Container_CopyBtn);

	document.body.appendChild(copyPartModal_Container);
}
var selectedPartsToCopy = [];
var selectedProductToCopyTo = [];
var selectedProductCopyFrom;
function toggleCopyPartModal(partInstance) {
	var productNo = ko.contextFor(partInstance).$parent.Index;
	var partNo = ko.contextFor(partInstance).$data.Index;

	selectedPartsToCopy = [];
	selectedProductToCopyTo = [];
	if(copyPartModal_Container.style.display === "none") {
		var productContext = ko.contextFor(partInstance).$parent;
		var products = ko.contextFor(document.querySelector(".ord-prod-model-item")).$parent.OrderProducts();
		var parts = productContext.Parts();

		for(var i = 0; i < parts.length; i++) {
			var elem = document.createElement('div');
			elem.style = "background-color:white;color:" + COLOUR.Blue + ";border:2px solid " + COLOUR.Blue + ";margin-top:10px;margin-left:10px;margin-right:10px;margin-bottom:0px;min-height:15px;width:90%;padding:5px;float:left;display:block;cursor: pointer;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;";
			elem.id = i + 1;
			elem.innerHTML = "<b>" + parts[i].GetPartHeader() + " -</b> " + parts[i].PartDescription();
			if(partNo == parts[i].Index) {
				elem.style.background = COLOUR.Blue;
				elem.style.color = "white";
				selectedPartsToCopy.push(i + 1);
			}

			$(elem).on('click', function() {
				if(this.style.background != COLOUR.Blue) {
					this.style.background = COLOUR.Blue;
					this.style.color = "white";
					selectedPartsToCopy.push(parseInt($(this).attr('id')));
				} else if(this.style.background == COLOUR.Blue) {
					this.style.background = "white";
					this.style.color = COLOUR.Blue;
					selectedPartsToCopy.remove(parseInt($(this).attr('id')));
				}
			});
			copyPartModal_Container_LHS.appendChild(elem);
		}
		copyPartModal_Container_RHS.style.display = "block";

		for(var j = 0; j < products.length; j++) {
			var elem2 = document.createElement('div');
			elem2.style = "background-color:white;color:" + COLOUR.Blue + ";border:2px solid " + COLOUR.Blue + ";margin-top:10px;margin-left:10px;margin-right:10px;margin-bottom:0px;min-height:15px;width:90%;padding:5px;float:left;display:block;cursor: pointer;white-space: nowrap;overflow: hidden !important;text-overflow: ellipsis;";
			elem2.id = j + 1;
			elem2.innerHTML = "<b>Product " + parseInt(j + 1) + " -</b> " + products[j].Description();
			if(productNo == products[j].Index) {
				elem2.style.background = COLOUR.Blue;
				elem2.style.color = "white";
				selectedProductCopyFrom = j + 1;
				selectedProductToCopyTo.push(j + 1);
			}

			$(elem2).on('click', function() {
				if(this.style.background != COLOUR.Blue) {
					this.style.background = COLOUR.Blue;
					this.style.color = "white";
					selectedProductToCopyTo.push(parseInt($(this).attr('id')));
				} else if(this.style.background == COLOUR.Blue) {
					this.style.background = "white";
					this.style.color = COLOUR.Blue;
					selectedProductToCopyTo.remove(parseInt($(this).attr('id')));
				}
			});
			copyPartModal_Container_RHS.appendChild(elem2);
		}
		copyPartModal_Container.style.display = "block";
		copyPartModal_Container_RHS.appendChild(copyPartModal_Container_RHS_NewBlankProduct);
	} else {
		copyPartModal_Container.style.display = "none";
		while(copyPartModal_Container_RHS.hasChildNodes()) {copyPartModal_Container_RHS.removeChild(copyPartModal_Container_RHS.lastChild);}
		while(copyPartModal_Container_LHS.hasChildNodes()) {copyPartModal_Container_LHS.removeChild(copyPartModal_Container_LHS.lastChild);}
	}
}

async function copyParts() {
	for(var x = 0; x < selectedProductToCopyTo.length; x++) {
		for(var y = 0; y < selectedPartsToCopy.length; y++) {
			await copyPart(selectedProductCopyFrom, selectedPartsToCopy[y], selectedProductToCopyTo[x]);
		}
	}
	if(copyPartModal_Container_RHS_NewBlankProduct.style.background == "rgb(0, 100, 255)") {
		//await add blank product, set temp name,
	}

	Ordui.Alert("Done.");
}
function closeCopyModal() {
	copyPartModal_Container.style.display = "none";
	while(copyPartModal_Container_RHS.hasChildNodes()) {copyPartModal_Container_RHS.removeChild(copyPartModal_Container_RHS.lastChild);}
	while(copyPartModal_Container_LHS.hasChildNodes()) {copyPartModal_Container_LHS.removeChild(copyPartModal_Container_LHS.lastChild);}
	copyPartModal_Container_RHS_NewBlankProduct.style.background = "white";
	copyPartModal_Container_RHS_NewBlankProduct.style.color = COLOUR.Blue;

}


function OpenPartBtn(productNumber) {
	$(Field.Product_ProvidesRealNo(productNumber) + ' .partExpander').not('.partExpander.collapse').click();
	$(Field.Product_ProvidesRealNo(productNumber) + ' .partExpander.collapse').show();
}
function ClosePartBtn(productNumber, partNumber = null) {
	if(partNumber == null) {
		$(Field.Product_ProvidesRealNo(productNumber) + ' .partExpander.collapse').click();
		$(Field.Product_ProvidesRealNo(productNumber) + ' .partExpander').not('.partExpander').show();
	} else {

	}
}

function tickAllParts(partN) {
	var boxes = document.querySelectorAll(".ord-prod-model-item")[partN].querySelectorAll('input[name^="cbPartSelected"]');
	for(var a = 0; a < boxes.length; a++) {
		$(boxes[a]).trigger('click');
	}
}

function createPartCombinedPrice() {
	let container = document.createElement('div');
	container.style = "display:none;position:fixed;right:0px;top:82px;background-color:" + COLOUR.Blue + ";width:100px;height:30px;color:white;padding:10px;box-shadow:rgb(0, 0, 0) -6px 1px 20px -2px";
	container.id = "partCombinedPriceContainer";
	document.body.appendChild(container);
}

function showPartCombinedPrice() {
	let container = document.getElementById("partCombinedPriceContainer");
	container.style.display = "block";
}

function hidePartCombinedPrice() {
	let container = document.getElementById("partCombinedPriceContainer");
	container.style.display = "none";
}

function addQuickFindProducts() {
	var footer = document.querySelector("#orderProductFooter");

	var otherInfo = createOptGroupDropdown("AddQuick_OtherInfo", footer, "AddQuick_OtherInfo", "Add + Other Info", 0, "width: 170px",
		[createOptGroup("Standard",
			[createDropdownOption("Other Info - Standard", " OTHER INFORMATION - Standard")]),
		createOptGroup("Removal",
			[createDropdownOption("Other Info - Removal", " OTHER INFORMATION - Removal"),
			createDropdownOption("Other Info - Removal Vehicle Graphics", " OTHER INFORMATION - Removal Vehicle Graphics")]),
		createOptGroup("Vehicle",
			[createDropdownOption("Other Info - Vehicle Graphics", "OTHER INFORMATION - Vehicle Graphics"),
			createDropdownOption("Other Info - Vehicle Magnets", "OTHER INFORMATION - Vehicle Magnets")]),
		createOptGroup("Illuminated",
			[createDropdownOption("Other Info - Illuminated Signage", "OTHER INFORMATION - Illuminated Signage")]),
		createOptGroup("Pylon",
			[createDropdownOption("Other Info - Pylon/ Post & Panel", "OTHER INFORMATION - Pylon / Post & Panel")]),
		createOptGroup("Other",
			[createDropdownOption("Other Info - Tenders", "OTHER INFORMATION - Tenders"),
			createDropdownOption("Other Info - Wall Graphics", "OTHER INFORMATION - Wall Graphics"),
			createDropdownOption("Other Info - Window Graphics", "OTHER INFORMATION - Window Graphics"),
			createDropdownOption("Other Info - Sign Approvals", "OTHER INFORMATION - SIGN APPROVAL APPLICATIONS")])],
		async function() {
			await AddQuickProduct(otherInfo.value);
		});
	var addArtwork = createOptGroupDropdown("AddQuick_Artwork", footer, "AddQuick_Artwork", "Add + Artwork", 0, "width: 130px; margin-left:10px;",
		[createDropdownOption("Artwork - Signage", " ARTWORK, PROOFING & CONVERSION TO PRINT READY FORMAT- Signage"),
		createDropdownOption("Artwork - Logo Design", "ARTWORK AND PROOFING - Logo Design"),
		createDropdownOption("Artwork - Graphic Design", "ARTWORK AND PROOFING - Graphic Design"),
		createDropdownOption("Artwork - Vehicle Graphics", "ARTWORK, PROOFING & CONVERSION TO PRINT READY FORMAT - Vehicle Graphics and Wraps")],
		async function() {
			await AddQuickProduct(addArtwork.value);
		});
	var addInstall = createOptGroupDropdown("AddQuick_Install", footer, "AddQuick_Install", "Add + Install", 0, "width: 120px; margin-left:10px;",
		[createOptGroup("IH",
			[createDropdownOption(" INSTALL - IH"),
			createDropdownOption(" INSTALL - IH (ea)"),
			createDropdownOption("REMOVAL - IH"),
			createDropdownOption("REMOVAL - VEHICLE GRAPHICS")]),
		createOptGroup("OS",
			[createDropdownOption("INSTALL - OS"),
			createDropdownOption("INSTALL - OSE")])],
		async function() {
			await AddQuickProduct(addInstall.value);
		});

	createHr("", footer);

	let addSpiderBoom = createIconButton(GM_getResourceURL("Image_SpiderBoom"), "Add Spidey", "width:200px;height:80px;filter:none;float:left;", () => {
		let modal = new ModalSingleInput("Days of Use", async () => {
			if(modal.value < 0) return alert("Value cannot be < 1");

			await AddBlankProduct();
			let productNo = getNumProducts();

			//EWP
			await setProductName(productNo, "EWP - CTE Traccess Diesel Boom (" + modal.value + " Days)");
			await setProductSummary(productNo, "Boom lift for elevated access.&nbsp;<div>Delivered to site&nbsp;</div><div><div><br></div><div>Allowance made for " + modal.value + " days hire.&nbsp;</div><div><br></div><div><i><b>Best estimate at the time of quoting is that we will require this EWP. Should a larger EWP be required there will be additional costs for a larger machine including Transport to site.</b></i></div></div>");

			let partNo = 0;
			await AddPart("EWP - _CTE Traccess Diesel Boom (DAILY)", productNo);
			partNo++;
			await setPartQty(productNo, partNo, parseInt(modal.value));
			await setPartDescription(productNo, partNo, "EWP - Traccess");
			await savePart(productNo, partNo);

			//Transport
			await AddPart("EWP - _CTE Traccess Diesel Boom Transport - 10km and under", productNo);
			partNo++;
			await setPartDescription(productNo, partNo, "Transport");
			await savePart(productNo, partNo);

			Ordui.Alert("done");
		});
		modal.setContainerSize(300, 300);
		modal.value = 1;
	}, footer);



	let addScissor = createIconButton(GM_getResourceURL("Image_Scissor"), "Add Scissor", "width:200px;height:80px;filter:none;float:left;", () => {
		let modal = new ModalSingleInput("Days of Use", async () => {
			if(modal.value < 0) return alert("Value cannot be < 1");

			await AddBlankProduct();
			let productNo = getNumProducts();

			//EWP
			await setProductName(productNo, "EWP - 26ft Scissor (" + modal.value + " Days)");
			await setProductSummary(productNo, "26ft Trailer Mounted Scissor Lift for elevated access.&nbsp;<div>Delivered to site&nbsp;</div><div><div><br></div><div>Allowance made for " + modal.value + " days hire.&nbsp;</div><div><br></div><div><i><b>Best estimate at the time of quoting is that we will require this EWP. Should a larger EWP be required there will be additional costs for a larger machine including Transport to site.</b></i></div></div>");

			let partNo = 0;
			await AddPart("EWP - _Scissor Trailer Drawn 26ft (DAILY)", productNo);
			partNo++;
			await setPartQty(productNo, partNo, parseInt(modal.value));
			await setPartDescription(productNo, partNo, "EWP - _Scissor Trailer Drawn 26ft");
			await savePart(productNo, partNo);

			Ordui.Alert("done");
		});
		modal.setContainerSize(300, 300);
		modal.value = 1;
	}, footer);
}
