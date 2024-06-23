class MenuPanelSigns extends LHSMenuWindow {

	/** @ViewMode */
	#viewMode;
	#numProducts = 0;

	/** @QuickTemplate */
	#addQuickTemplateBtn;

	#createProductBtn;
	/**
	 * @Size2
	 */
	#sizeContainer;
	#addSizeBtn;
	#sizeArray = [];
	/**
	 * @Sheet
	 */
	#sheetContainer;
	#addSheetBtn;
	/**
	 * @Vinyl
	 */
	#vinylContainer;
	#addVinylBtn;
	/**
	 * @Laminate
	 */
	#laminateContainer;
	#addLaminateBtn;
	/**
	 * @AppTape
	 */
	#appTapingContainer;
	#appTapingBtn;
	/**
	 * @HandTrimming
	 */
	#handTrimmingContainer;
	#addHandTrimmingBtn;
	/**
	 * @PrintMounting
	 */
	#printMountingContainer;
	#printMountingBtn;
	/**
	 * @Production
	 */
	#production;
	#productionContainer;
	#addProductionBtn;
	/**
	 * @Artwork
	 */
	#artwork;
	#artworkContainer;
	#addArtworkBtn;
	/**
	 * @Install
	 */
	#install;
	#installContainer;
	#addInstallBtn;
	/**
	 * @AllMaterialsArray
	 */
	#allMaterials = new ObjectArray();
	get allMaterials() {return this.#allMaterials;};

	#containers = [];
	#productContainers = [];

	#subscriptionTree;
	get subscriptionTree() {
		return {
			Size2: [],
			ProductDetails: [Size2],
			Sheet: [Size2],
			Vinyl: [Sheet],
			Laminate: [Vinyl],
			AppTaping: [Vinyl],
			HandTrimming: [Vinyl],
			PrintMounting: [Sheet],
			ProductionSubscribable: [Sheet],
			ArtworkSubscribable: [Size2],
			InstallSubscribable: [Sheet]
		};
	}


	constructor(width, height, ID, windowTitle) {
		super(width, height, ID, windowTitle);
		this.addPages(1);

		this.page1 = this.getPage(0);

		document.addEventListener("loadedPredefinedParts", () => {
			/*
			ToggleOpen */
			let toggleOpenBtn = createButton("Open All", "width:20%;height:40px;margin:0px;", () => {this.#toggleAllOpen();}, this.page1);

			/*
				ToggleClosed */
			let toggleClosedBtn = createButton("Close All", "width:20%;height:40px;margin:0px;", () => {this.#toggleAllClosed();}, this.page1);

			/*
			AddFullSuite */
			let addFullSuiteBtn = createButton("Add Blank Product", "width:20%;height:40px;margin:0px;", () => {this.#addFullSuite();}, this.page1);

			this.#addQuickTemplateBtn = createDropdown_Infield_Icons_Search("Add Quick Template Product", 0, "width:20%;height:35px;margin:0px;box-sizing:border-box;", 100, false,
				[["ACM", "https://d2ngzhadqk6uhe.cloudfront.net/deanssign/images/product/Deans-Aluminum-Composite-Board.jpg"],
				["Lightbox Face - Opal Acrylic", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv2ViepnkaCu6NWbWfFrDPb0nNn7SBQ9r7oQ&usqp=CAU"],
				["Clear Acrylic", "https://m.media-amazon.com/images/I/71hK5AoWC-L._AC_UF894,1000_QL80_.jpg"],
				["Foam PVC", "https://5.imimg.com/data5/RN/UM/MY-14219350/white-pvc-foam-sheet-500x500.jpg"],
				["Signwhite", "https://img.archiexpo.com/images_ae/photo-g/158002-12419012.jpg"],
				["Corflute", GM_getResourceURL("Image_Corflute")],
				["Wall Graphics", "https://cdn.gorilladash.com/images/media/6161323/signarama-australia-img-3113-thumbnail-638306a183cd0.jpg"]],
				() => {this.#addQuickTemplate();},
				this.page1, false
			);
			//"https://cdn.gorilladash.com/images/media/12526805/Corflute-Resized.jpg"
			this.#viewMode = createDropdown_Infield('View Mode', 0, "width:calc(20% - 2px);height:35px;margin:0px;box-sizing:border-box;", [createDropdownOption("Per Type", "Per Type"), createDropdownOption("Per Product", "Per Product")], () => {this.#updateViewMode();}, this.page1);

			this.#numProducts = getNumProducts() - 1;
		});

		this.#createProductBtn = createButton("Create Product   " + "\u25BA", "width:100%;margin:0px;", () => {this.CreateProduct(this);});
		this.footer.appendChild(this.#createProductBtn);
	}

	#addQuickTemplate() {
		this.#numProducts++;

		let size;
		let productDetails;
		let sheet;
		let vinyl;
		let laminate;
		let appTape;
		let handTrimming;
		let printMounting;
		let finishing;
		let production;
		let artwork;
		let install;

		switch(this.#addQuickTemplateBtn[1].value) {
			case "ACM":
				size = this.#add(Size2, "SIZE2", this.page1, []);
				size.width = 2440;
				size.height = 1220;

				productDetails = this.#add(ProductDetails, "PRODUCT DETAILS", this.page1, [Size2]);
				productDetails.productLocation = "";
				productDetails.productName = "ACM Panel";

				sheet = this.#add(Sheet, "SHEET", this.page1, [Size2]);
				vinyl = this.#add(Vinyl, "VINYL", this.page1, [Sheet]);
				laminate = this.#add(Laminate, "LAMINATE", this.page1, [Vinyl]);
				appTape = null;
				handTrimming = this.#add(HandTrimming, "HAND TRIMMING", this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, "PRINT MOUNTING", this.page1, [Sheet]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, "ARTWORK", this.page1, [Size2]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, "INSTALL", this.page1, [Sheet]);
				break;
			case "Lightbox Face - Opal Acrylic":
				size = this.#add(Size2, "SIZE2", this.page1, []);
				size.width = 2440;
				size.height = 1220;

				productDetails = this.#add(ProductDetails, "PRODUCT DETAILS", this.page1, [Size2]);
				productDetails.productLocation = "";
				productDetails.productName = "Acrylic Lightbox Face";

				sheet = this.#add(Sheet, "SHEET", this.page1, [Size2]);
				sheet.material = "Acrylic";
				sheet.sheetSize = "2440mm x 1220mm";
				sheet.thickness = "4.5";
				sheet.finish = "Opal";

				vinyl = this.#add(Vinyl, "VINYL", this.page1, [Sheet]);
				vinyl.material = VinylLookup["Translucent"];
				laminate = this.#add(Laminate, "LAMINATE", this.page1, [Vinyl]);
				laminate.material = LaminateLookup["Translucent"];
				appTape = null;
				handTrimming = this.#add(HandTrimming, "HAND TRIMMING", this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, "PRINT MOUNTING", this.page1, [Sheet]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, "ARTWORK", this.page1, [Size2]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, "INSTALL", this.page1, [Sheet]);
				break;
			case "Clear Acrylic":
				size = this.#add(Size2, "SIZE2", this.page1, []);
				size.width = 2440;
				size.height = 1220;

				productDetails = this.#add(ProductDetails, "PRODUCT DETAILS", this.page1, [Size2]);
				productDetails.productLocation = "";
				productDetails.productName = "Clear Acrylic Panel with Stand-offs";

				sheet = this.#add(Sheet, "SHEET", this.page1, [Size2]);
				sheet.material = "Acrylic";
				sheet.sheetSize = "2440mm x 1220mm";
				sheet.thickness = "6";
				sheet.finish = "Clear";
				vinyl = this.#add(Vinyl, "VINYL", this.page1, [Sheet]);
				vinyl.material = VinylLookup["Clear"];
				vinyl.bleedDropdown = "Reverse Acrylics";
				laminate = this.#add(Laminate, "LAMINATE", this.page1, [Vinyl]);
				laminate.material = VinylLookup["Whiteback"];
				appTape = null;
				handTrimming = this.#add(HandTrimming, "HAND TRIMMING", this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, "PRINT MOUNTING", this.page1, [Sheet]);
				finishing = this.#add(Finishing, "FINISHING", this.page1, [Sheet]);
				finishing.standOffRequired = true;
				production = null;
				artwork = this.#add(ArtworkSubscribable, "ARTWORK", this.page1, [Size2]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, "INSTALL", this.page1, [Sheet]);
				break;
			case "Foam PVC":
				size = this.#add(Size2, "SIZE2", this.page1, []);
				size.width = 2440;
				size.height = 1220;

				productDetails = this.#add(ProductDetails, "PRODUCT DETAILS", this.page1, [Size2]);
				productDetails.productLocation = "";
				productDetails.productName = "Foam PVC Panel";

				sheet = this.#add(Sheet, "SHEET", this.page1, [Size2]);
				sheet.material = "Foamed PVC";
				sheet.sheetSize = "2440mm x 1220mm";
				sheet.thickness = "3.0";

				vinyl = this.#add(Vinyl, "VINYL", this.page1, [Sheet]);
				laminate = this.#add(Laminate, "LAMINATE", this.page1, [Vinyl]);
				appTape = null;
				handTrimming = this.#add(HandTrimming, "HAND TRIMMING", this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, "PRINT MOUNTING", this.page1, [Sheet]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, "ARTWORK", this.page1, [Size2]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, "INSTALL", this.page1, [Sheet]);
				break;
			case "Signwhite":
				size = this.#add(Size2, "SIZE2", this.page1, []);
				size.width = 2400;
				size.height = 1200;

				productDetails = this.#add(ProductDetails, "PRODUCT DETAILS", this.page1, [Size2]);
				productDetails.productLocation = "";
				productDetails.productName = "Signwhite Panel";

				sheet = this.#add(Sheet, "SHEET", this.page1, [Size2]);
				sheet.material = "Signwhite";
				sheet.sheetSize = "2400mm x 1200mm";
				sheet.thickness = "0.55";

				vinyl = this.#add(Vinyl, "VINYL", this.page1, [Sheet]);
				laminate = this.#add(Laminate, "LAMINATE", this.page1, [Vinyl]);
				appTape = null;
				handTrimming = this.#add(HandTrimming, "HAND TRIMMING", this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, "PRINT MOUNTING", this.page1, [Sheet]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, "ARTWORK", this.page1, [Size2]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, "INSTALL", this.page1, [Sheet]);
				break;
			case "Corflute":
				size = this.#add(Size2, "SIZE2", this.page1, []);
				size.width = 600;
				size.height = 900;

				productDetails = this.#add(ProductDetails, "PRODUCT DETAILS", this.page1, [Size2]);
				productDetails.productLocation = "";
				productDetails.productName = "Corflute Panel";

				sheet = this.#add(Sheet, "SHEET", this.page1, [Size2]);
				sheet.material = "Corflute";
				sheet.sheetSize = "600mm x 900mm";
				sheet.thickness = "5.0";

				vinyl = this.#add(Vinyl, "VINYL", this.page1, [Sheet]);
				vinyl.bleedDropdown = "Corflutes";
				laminate = this.#add(Laminate, "LAMINATE", this.page1, [Vinyl]);
				appTape = null;
				handTrimming = this.#add(HandTrimming, "HAND TRIMMING", this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, "PRINT MOUNTING", this.page1, [Sheet]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, "ARTWORK", this.page1, [Size2]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, "INSTALL", this.page1, [Sheet]);
				break;
			case "Wall Graphics":
				size = this.#add(Size2, "SIZE2", this.page1, []);
				size.width = 1000;
				size.height = 1000;

				productDetails = this.#add(ProductDetails, "PRODUCT DETAILS", this.page1, [Size2]);
				productDetails.productLocation = "";
				productDetails.productName = "Vinyl Wall Graphics";

				vinyl = this.#add(Vinyl, "VINYL", this.page1, [Size2]);
				vinyl.material = VinylLookup["High Tack"];
				vinyl.bleedDropdown = "Wall Graphics";
				vinyl.isJoinHorizontal = false;

				laminate = this.#add(Laminate, "LAMINATE", this.page1, [Vinyl]);
				laminate.material = LaminateLookup["Satin"];
				appTape = null;
				handTrimming = this.#add(HandTrimming, "HAND TRIMMING", this.page1, [Vinyl]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, "ARTWORK", this.page1, [Size2]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, "INSTALL", this.page1, [Size2]);
				break;
			default:
				break;
		}
		this.#updateViewMode();
	}

	#addFullSuite() {
		this.#numProducts++;
		this.#add(Size2, "SIZE2", this.page1, []);
		this.#add(ProductDetails, "PRODUCT DETAILS", this.page1, [Size2]);
		this.#add(Sheet, "SHEET", this.page1, [Size2]);
		this.#add(Vinyl, "VINYL", this.page1, [Sheet]);
		this.#add(Laminate, "LAMINATE", this.page1, [Vinyl]);
		this.#add(AppTaping, "APP TAPE", this.page1, [Vinyl]);
		this.#add(HandTrimming, "HAND TRIMMING", this.page1, [Vinyl]);
		this.#add(PrintMounting, "PRINT MOUNTING", this.page1, [Sheet]);
		this.#add(ProductionSubscribable, "PRODUCTION", this.page1, [Sheet]);
		this.#add(ArtworkSubscribable, "ARTWORK", this.page1, [Size2]);
		this.#add(InstallSubscribable, "INSTALL", this.page1, [Sheet]);
		this.#updateViewMode();
	}

	#add(classType, headingText = "", container, subscribeToClasses = []) {
		let newItem = new classType(container, this, headingText);
		newItem.productNumber = this.#getproductNumber(classType);

		for(let x = 0; x < subscribeToClasses.length; x++) {
			objectLoop:
			for(let i = this.#allMaterials.length - 1; i >= 0; i--) {
				if(this.#allMaterials[i].constructor.name == subscribeToClasses[x].name) {
					newItem.SubscribeTo(this.#allMaterials[i]);//subscribe to last of kind
					break objectLoop;
				}
			}
		}

		this.#allMaterials.push(newItem);

		this.#updateFromChange();
		return newItem;
	}

	/*
	overload*/
	#addBlank(classType, headingText = "", container) {
		let newItem = new classType(container, this, headingText);

		this.#allMaterials.push(newItem);

		this.#updateFromChange();
	}

	#getproductNumber(classType) {
		return this.#numProducts;
	}

	#numberOfMaterialInstancesOfClass(className) {
		let numberOfInstances = 0;
		for(let i = 0; i < this.#allMaterials.length; i++) {
			if(this.#allMaterials[i] instanceof className) {
				numberOfInstances++;
			}
		}
		return numberOfInstances;
	}

	#renameAllMaterialInstancesOfClass(className) {
		console.log(className);
		let counter = 0;
		for(let i = 0; i < this.#allMaterials.length; i++) {
			if(this.#allMaterials[i].constructor.name == className) {
				counter++;
				this.#allMaterials[i].productNumber = counter;
			}
		}
	}

	DeleteMaterial(materialObject) {
		console.log("delete material from PanelSigns.js" + materialObject);
		let type = materialObject.constructor.name;

		for(let i = 0; i < this.#allMaterials.length; i++) {
			if(this.#allMaterials[i] == materialObject) {
				this.#allMaterials.splice(i, 1);
				break;
			}
		}
		this.#updateFromChange();
	}

	DeleteProduct(productNumber) {
		let materials = this.#allMaterials;
		let productContainer;
		for(let i = 0; i < materials.length; i++) {
			if(materials[i].productNumber == productNumber) {
				materials[i].Delete();
				i--;
			}
		}
		this.#updateViewMode();
	}

	#updateFromChange() { }

	#toggleAllOpen() {
		for(let i = 0; i < this.#containers.length; i++) {
			this.#containers[i].Maximize();
		}
		for(let i = 0; i < this.#productContainers.length; i++) {
			this.#productContainers[i].Maximize();
		}
	}

	#toggleAllClosed() {
		for(let i = 0; i < this.#containers.length; i++) {
			this.#containers[i].Minimize();
		}
		for(let i = 0; i < this.#productContainers.length; i++) {
			this.#productContainers[i].Minimize();
		}
	}

	#updateViewMode() {
		for(let i = 0; i < this.#productContainers.length; i++) {
			deleteElement(this.#productContainers[i].container);
		}
		for(let i = 0; i < this.#containers.length; i++) {
			deleteElement(this.#containers[i].container);
		}
		if(this.#viewMode[1].value == "Per Type") {

			let creationOrder = [Size2, ProductDetails, Sheet, Vinyl, Laminate, AppTaping, HandTrimming, PrintMounting, Finishing, ProductionSubscribable, ArtworkSubscribable, InstallSubscribable];
			this.#containers = [/*Size2, ProductDetails, Sheet, Vinyl, Laminate, AppTaping, HandTrimming, PrintMounting, Finishing, ProductionSubscribable, ArtworkSubscribable, InstallSubscribable */];

			for(let i = 0; i < creationOrder.length; i++) {
				this.#containers.push(new UIContainerType3("max-height:450px;", creationOrder[i].DISPLAY_NAME, this.page1));
				createButton("Add +", "width:20%", () => {
					this.#addBlank(creationOrder[i], creationOrder[i].DISPLAY_NAME, this.#containers[i].contentContainer);
				}, this.#containers[i].contentContainer);
			}
			for(let x = 0; x < this.#containers.length; x++) {
				let sameItemCount = 0;
				for(let y = 0; y < this.#allMaterials.length; y++) {
					let item = this.#allMaterials[y];
					if(item instanceof creationOrder[x]) {
						if(sameItemCount == 0) {

						}
						sameItemCount++;
						this.#containers[x].contentContainer.appendChild(item.container);
					}
				}
			}
		} else if(this.#viewMode[1].value == "Per Product") {
			let uniqueProductNumbers = [];
			this.#productContainers = [];

			for(let i = 0; i < this.#allMaterials.length; i++) {
				let item = this.#allMaterials[i];
				//make unique list of product numbers
				if(!uniqueProductNumbers.includes(item.productNumber)) uniqueProductNumbers.push(item.productNumber);
			}
			uniqueProductNumbers.sort((a, b) => a - b);

			for(let i = 0; i < uniqueProductNumbers.length; i++) {
				let currentProductNumber = uniqueProductNumbers[i];
				//create product container
				let newProductContainer = new UIContainerType3("max-height:450px;", "PRODUCT " + uniqueProductNumbers[i], this.page1);
				newProductContainer.addHeadingButtons(createButton("x", "width:30px;height:30px;margin:0px;border:none;padding:2px;min-height:30px;float:right;background-color:" + COLOUR.Red + ";", () => {this.DeleteProduct(currentProductNumber);}, null));
				this.#productContainers.push(newProductContainer);

				//add items to it
				for(let j = 0; j < this.#allMaterials.length; j++) {
					let item = this.#allMaterials[j];
					let itemContainer = item.container;

					if(item.productNumber != currentProductNumber) continue;

					newProductContainer.contentContainer.appendChild(itemContainer);
				}
			}
		} else {
			alert("Not supported");
		}
	}

	async CreateProduct(parent) {
		parent.minimize();
		console.log(this.#allMaterials);
		let pNo = 0;
		let productNo = 0;
		let partIndex = 0;
		let productDescription = "";

		let uniqueProductNumbers = [];
		for(let i = 0; i < this.#allMaterials.length; i++) {
			let item = this.#allMaterials[i];
			//make unique list of product numbers
			if(!uniqueProductNumbers.includes(item.productNumber)) uniqueProductNumbers.push(item.productNumber);
		}
		uniqueProductNumbers.sort((a, b) => a - b);

		for(let i = 0; i < uniqueProductNumbers.length; i++) {
			let currentProductNumber = uniqueProductNumbers[i];

			await AddBlankProduct();
			productNo = getNumProducts();
			partIndex = 0;

			for(let j = 0; j < this.#allMaterials.length; j++) {
				let item = this.#allMaterials[j];
				if(item.productNumber != currentProductNumber) continue;

				partIndex = await item.Create(productNo, partIndex);
				if(item.Description() != "") productDescription += item.Description() + "<br>";
			}

			await setProductSummary(productNo, productDescription);
			productDescription = "";
		}

		Ordui.Alert("done");
	}
}