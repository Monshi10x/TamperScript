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
			/**@ToggleOpen */
			let toggleOpenBtn = createButton("Open All", "width:100px;height:30px;", () => {this.#toggleAllOpen();}, this.page1);

			/**@ToggleClosed */
			let toggleClosedBtn = createButton("Close All", "width:100px;height:30px;", () => {this.#toggleAllClosed();}, this.page1);

			/**@AddFullSuite */
			let addFullSuiteBtn = createButton("Add Blank Product", "width:200px;height:30px;", () => {this.#addFullSuite();}, this.page1);

			this.#addQuickTemplateBtn = createDropdown_Infield_Icons_Search("Add Quick Template Product", 0, "width:250px;", 80, false,
				[["ACM", "https://d2ngzhadqk6uhe.cloudfront.net/deanssign/images/product/Deans-Aluminum-Composite-Board.jpg"],
				["Lightbox Face - Opal Acrylic", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv2ViepnkaCu6NWbWfFrDPb0nNn7SBQ9r7oQ&usqp=CAU"],
				["Clear Acrylic", "https://www.imagojuniors.com/assets/imgs/ff/private-shoots/Sandwich/L2.jpg"],
				["Foam PVC", "https://5.imimg.com/data5/RN/UM/MY-14219350/white-pvc-foam-sheet-500x500.jpg"],
				["Signwhite", "https://img.archiexpo.com/images_ae/photo-g/158002-12419012.jpg"],
				["Corflute", "https://cdn11.bigcommerce.com/s-iu4x16wosu/images/stencil/1280x1280/products/238/555/thFJ8AB8FS__51355.1563671713.jpg?c=2"]],
				() => {this.#addQuickTemplate();},
				this.page1, false
			);

			this.#viewMode = createDropdown_Infield('View Mode', 0, "width:150px;", [createDropdownOption("Per Type", "Per Type"), createDropdownOption("Per Product", "Per Product")], () => {this.#updateViewMode();}, this.page1);

			this.#numProducts = getNumProducts() - 1;
			//this.#addFullSuite();
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
				laminate = this.#add(Laminate, "LAMINATE", this.page1, [Vinyl]);
				appTape = null;
				handTrimming = this.#add(HandTrimming, "HAND TRIMMING", this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, "PRINT MOUNTING", this.page1, [Sheet]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, "ARTWORK", this.page1, [Size2]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, "INSTALL", this.page1, [Sheet]);
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
		newItem.easyName = this.#getEasyName(classType);

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

	/** @overload */
	#addBlank(classType, headingText = "", container) {
		let newItem = new classType(container, this, headingText);

		this.#allMaterials.push(newItem);

		this.#updateFromChange();
	}

	#getEasyName(classType) {
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
				this.#allMaterials[i].easyName = counter;
			}
		}
	}

	DeleteMaterial(materialObject) {
		console.log("delete material from PanelSigns.js" + materialObject);
		let type = materialObject.constructor.name;

		for(let i = 0; i < this.#allMaterials.length; i++) {
			if(this.#allMaterials[i] == materialObject) {
				this.#allMaterials.splice(i, 1);
				//materialObject.Delete();
				break;
			}
		}
		//this.#renameAllMaterialInstancesOfClass(type);
		this.#updateFromChange();
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
				let addBtn = createButton("Add +", "width:20%", () => {
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
			this.#productContainers = [];
			for(let x = 0; x < this.#numProducts; x++) {
				this.#productContainers.push(new UIContainerType3("max-height:450px;", "PRODUCT " + (x + 1), this.page1));
			}

			let uniqueItems = this.#allMaterials.uniqueArrayElements("Type");
			for(let i = 0; i < uniqueItems.length; i++) {

				let similarItems = this.#allMaterials.similarElements(uniqueItems[i], "Type");
				for(let j = 0; j < similarItems.length; j++) {
					let item = similarItems[j];
					let itemProductIndex = item.easyName - 1;
					let itemContainer = item.container;

					//if misc items
					if(item.easyName < 1) {
						if(this.#productContainers.length <= this.#numProducts) {
							this.#productContainers.push(new UIContainerType3("max-height:450px;", "MISC", this.page1));
						}
						this.#productContainers[this.#productContainers.length - 1].contentContainer.appendChild(itemContainer);
					} else {
						this.#productContainers[itemProductIndex].contentContainer.appendChild(itemContainer);
					}
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
		for(let i = 0; i < this.#allMaterials.length; i++) {
			let productNumber = this.#allMaterials[i].easyName;
			if(productNumber > pNo) {
				pNo = productNumber;
				await AddBlankProduct();
				partIndex = 0;
				productNo = getNumProducts();
			}

			partIndex = await this.#allMaterials[i].Create(productNo, partIndex);
		}
		Ordui.Alert("done");
	}
}