class MenuPanelSigns extends LHSMenuWindow {

	/** @ViewMode */
	#viewMode;
	#numProducts = 0;
	#creationOrder = [ProductDetails, Size, SVGCutfile, Sheet, Vinyl, Laminate, AppTaping, HandTrimming, PrintMounting, Finishing, ProductionSubscribable, ArtworkSubscribable, InstallSubscribable];


	/** @QuickTemplate */
	#addQuickTemplateBtn;
	#createProductBtn;
	/**
	 * @Size
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
			ProductDetails: [],
			Size: [],
			Sheet: [Size],
			Vinyl: [Sheet],
			Laminate: [Vinyl],
			AppTaping: [Vinyl],
			HandTrimming: [Vinyl],
			PrintMounting: [Sheet],
			ProductionSubscribable: [Sheet],
			ArtworkSubscribable: [Size],
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

			this.#addQuickTemplateBtn = createDropdown_Infield_Icons_Search("Add Quick Template Product", 0, "width:40%;height:35px;margin:0px;box-sizing:border-box;", 150, false,
				[["3D Front-lit Letters", "https://d2ngzhadqk6uhe.cloudfront.net/deanssign/images/product/Deans-Aluminum-Composite-Board.jpg"],
				["ACM", "https://d2ngzhadqk6uhe.cloudfront.net/deanssign/images/product/Deans-Aluminum-Composite-Board.jpg"],
				["Lightbox Face - Opal Acrylic", "https://cdn.gorilladash.com/images/media/5077257/signarama-australia-img-6911-2-small-thumbnail-61611e9ab2f0f.jpg"],
				["Clear Acrylic", "https://m.media-amazon.com/images/I/71hK5AoWC-L._AC_UF894,1000_QL80_.jpg"],
				["Foam PVC", "https://5.imimg.com/data5/RN/UM/MY-14219350/white-pvc-foam-sheet-500x500.jpg"],
				["Signwhite", "https://img.archiexpo.com/images_ae/photo-g/158002-12419012.jpg"],
				["Corflute", GM_getResourceURL("Image_Corflute")],
				["Wall Graphics", "https://cdn.gorilladash.com/images/media/6161323/signarama-australia-img-3113-thumbnail-638306a183cd0.jpg"]],
				() => {this.#addQuickTemplate();},
				this.page1, false
			);

			this.#viewMode = createDropdown_Infield('View Mode', 1, "width:calc(20% - 2px);height:35px;margin:0px;box-sizing:border-box;", [createDropdownOption("Per Type", "Per Type"), createDropdownOption("Per Product", "Per Product"), createDropdownOption("Per Type2", "Per Type2")], () => {this.#updateViewMode();}, this.page1);

			//this.#numProducts = getNumProducts() - 1;
		});

		this.#createProductBtn = createButton("Create Product   " + "\u25BA", "width:100%;margin:0px;", () => {this.CreateProduct(this);});
		this.footer.appendChild(this.#createProductBtn);
	}

	#addQuickTemplate() {
		this.#numProducts++;

		let productDetails;
		let size;
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
			case "3D Front-lit Letters":
				productDetails = this.#add(ProductDetails, this.page1, []);
				productDetails.productLocation = "";
				productDetails.productName = "3D Front-lit Letters";

				size = this.#add(Size, this.page1, []);
				size.width = 2440;
				size.height = 1220;

				let temp = this.#add(SVGCutfile, this.page1, []);
				let temp2 = this.#add(Coil, this.page1, [SVGCutfile]);

				sheet = this.#add(Sheet, this.page1, [Size]);
				sheet.material = "ACM";
				sheet.sheetSize = "2440x1220";
				sheet.sheetMaterial = "ACM - (sqm) - 2440x1220x3x0.21 Primer/Primer (Mulfords)";
				vinyl = this.#add(Vinyl, this.page1, [Sheet]);
				laminate = this.#add(Laminate, this.page1, [Vinyl]);
				appTape = null;
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "ACM":
				productDetails = this.#add(ProductDetails, this.page1, []);
				productDetails.productLocation = "";
				productDetails.productName = "ACM Panel";

				size = this.#add(Size, this.page1, []);
				size.width = 2440;
				size.height = 1220;

				sheet = this.#add(Sheet, this.page1, [Size]);
				sheet.material = "ACM";
				sheet.sheetSize = "2440x1220";
				sheet.sheetMaterial = "ACM - (sqm) - 2440x1220x3x0.21 Primer/Primer (Mulfords)";
				vinyl = this.#add(Vinyl, this.page1, [Sheet]);
				laminate = this.#add(Laminate, this.page1, [Vinyl]);
				appTape = null;
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "Lightbox Face - Opal Acrylic":
				productDetails = this.#add(ProductDetails, "PRODUCT QTY", this.page1, []);
				productDetails.productLocation = "";
				productDetails.productName = "Acrylic Lightbox Face";

				size = this.#add(Size, this.page1, []);
				size.width = 2440;
				size.height = 1220;

				sheet = this.#add(Sheet, this.page1, [Size]);
				sheet.material = "Acrylic";
				sheet.sheetSize = "2440mm x 1220mm";
				sheet.thickness = "4.5";
				sheet.finish = "Opal";

				vinyl = this.#add(Vinyl, this.page1, [Sheet]);
				vinyl.material = VinylLookup["Clear"];
				vinyl.bleedDropdown = "Lightbox Faces";
				laminate = this.#add(Laminate, this.page1, [Vinyl]);
				laminate.material = LaminateLookup["Gloss"];
				appTape = null;
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "Clear Acrylic":
				productDetails = this.#add(ProductDetails, this.page1, []);
				productDetails.productLocation = "";
				productDetails.productName = "Clear Acrylic Panel with Stand-offs";

				size = this.#add(Size, this.page1, []);
				size.width = 2440;
				size.height = 1220;

				sheet = this.#add(Sheet, this.page1, [Size]);
				sheet.material = "Acrylic";
				sheet.sheetSize = "2440mm x 1220mm";
				sheet.thickness = "6";
				sheet.finish = "Clear";
				vinyl = this.#add(Vinyl, this.page1, [Sheet]);
				vinyl.material = VinylLookup["Clear"];
				vinyl.bleedDropdown = "Reverse Acrylics";
				laminate = this.#add(Laminate, this.page1, [Vinyl]);
				laminate.material = VinylLookup["Whiteback"];
				appTape = null;
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				finishing = this.#add(Finishing, this.page1, [Sheet]);
				finishing.standOffRequired = true;
				production = null;
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "Foam PVC":
				productDetails = this.#add(ProductDetails, this.page1, []);
				productDetails.productLocation = "";
				productDetails.productName = "Foam PVC Panel";

				size = this.#add(Size, this.page1, []);
				size.width = 2440;
				size.height = 1220;

				sheet = this.#add(Sheet, this.page1, [Size]);
				sheet.material = "Foamed PVC";
				sheet.sheetSize = "2440mm x 1220mm";
				sheet.thickness = "3.0";

				vinyl = this.#add(Vinyl, this.page1, [Sheet]);
				vinyl.bleedDropdown = "ACM";
				laminate = this.#add(Laminate, this.page1, [Vinyl]);
				appTape = null;
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "Signwhite":
				productDetails = this.#add(ProductDetails, this.page1, []);
				productDetails.productLocation = "";
				productDetails.productName = "Signwhite Panel";

				size = this.#add(Size, this.page1, []);
				size.width = 2400;
				size.height = 1200;

				sheet = this.#add(Sheet, this.page1, [Size]);
				sheet.material = "Signwhite";
				sheet.sheetSize = "2400mm x 1200mm";
				sheet.thickness = "0.55";

				vinyl = this.#add(Vinyl, this.page1, [Sheet]);
				vinyl.bleedDropdown = "ACM";
				laminate = this.#add(Laminate, this.page1, [Vinyl]);
				appTape = null;
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "Corflute":
				productDetails = this.#add(ProductDetails, this.page1, []);
				productDetails.productLocation = "";
				productDetails.productName = "Corflute Panel";

				size = this.#add(Size, this.page1, []);
				size.width = 600;
				size.height = 900;

				sheet = this.#add(Sheet, this.page1, [Size]);
				sheet.material = "Corflute";
				sheet.sheetSize = "600mm x 900mm";
				sheet.thickness = "5.0";

				vinyl = this.#add(Vinyl, this.page1, [Sheet]);
				vinyl.bleedDropdown = "Corflutes";
				laminate = this.#add(Laminate, this.page1, [Vinyl]);
				appTape = null;
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				printMounting = this.#add(PrintMounting, this.page1, [Sheet]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Sheet]);
				break;
			case "Wall Graphics":
				productDetails = this.#add(ProductDetails, this.page1, []);
				productDetails.productLocation = "";
				productDetails.productName = "Vinyl Wall Graphics";

				size = this.#add(Size, this.page1, []);
				size.width = 1000;
				size.height = 1000;

				vinyl = this.#add(Vinyl, this.page1, [Size]);
				vinyl.material = VinylLookup["High Tack"];
				vinyl.bleedDropdown = "Wall Graphics";
				vinyl.isJoinHorizontal = false;

				laminate = this.#add(Laminate, this.page1, [Vinyl]);
				laminate.material = LaminateLookup["Satin"];
				appTape = null;
				handTrimming = this.#add(HandTrimming, this.page1, [Vinyl]);
				production = null;
				artwork = this.#add(ArtworkSubscribable, this.page1, [Size]);
				artwork.artworkItem.artworkTime = 60;
				install = this.#add(InstallSubscribable, this.page1, [Size]);
				break;
			default:
				break;
		}
		this.#updateViewMode();
	}

	#add(classType, container, subscribeToClasses = []) {
		let newItem = new classType(container, this);
		newItem.productNumber = this.#getproductNumber();

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

	#addBlank(classType, container) {
		let newItem = new classType(container, this);

		this.#allMaterials.push(newItem);

		this.#updateFromChange();
	}

	#getproductNumber() {
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
		console.log("delete product from PanelSigns.js");
		let materials = this.#allMaterials;
		for(let i = 0; i < materials.length; i++) {
			if(materials[i].productNumber == productNumber) {
				materials[i].Delete();
				i--;
			}
		}
		this.#numProducts--;
		this.#updateViewMode();
	}

	DeleteProductsAll() {
		for(let i = 0; i < this.#numProducts + 1; i++) {
			this.DeleteProduct(i + 1);
		}
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

			this.#containers = [/*ProductDetails, Size, SVGCutfile, Sheet, Vinyl, Laminate, Coil, AppTaping, HandTrimming, PrintMounting, Finishing, ProductionSubscribable, ArtworkSubscribable, InstallSubscribable */];

			for(let i = 0; i < this.#creationOrder.length; i++) {
				let UIContainer = new UIContainerType3("", this.#creationOrder[i].Type, this.page1);

				this.#containers.push(UIContainer);
				let addBtn = createButton("Add +", "width:100px;min-height:30px;margin:0px;border:0px;", () => {
					this.#addBlank(this.#creationOrder[i], this.#containers[i].contentContainer);
				}, null);
				UIContainer.addHeadingButtons(addBtn);
			}
			for(let x = 0; x < this.#containers.length; x++) {
				let sameItemCount = 0;
				for(let y = 0; y < this.#allMaterials.length; y++) {
					let item = this.#allMaterials[y];
					if(item instanceof this.#creationOrder[x]) {
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
				newProductContainer.contentContainer.style.cssText += "max-height:800px;";
				newProductContainer.container.style.cssText += "max-height:800px;";

				newProductContainer.addHeadingButtons(createButton("x", "width:30px;height:30px;margin:0px;border:none;padding:2px;min-height:30px;float:right;background-color:" + COLOUR.Red + ";", () => {
					this.DeleteProduct(currentProductNumber);
				}, null));
				this.#productContainers.push(newProductContainer);

				//add items to it
				for(let j = 0; j < this.#allMaterials.length; j++) {
					let item = this.#allMaterials[j];
					let itemContainer = item.container;

					if(item.productNumber != currentProductNumber) continue;

					newProductContainer.contentContainer.appendChild(itemContainer);
				}
			}
		} else if(this.#viewMode[1].value == "Per Type2") {

			this.#containers = [/*ProductDetails, Size, SVGCutfile, Sheet, Vinyl, Laminate, Coil, AppTaping, HandTrimming, PrintMounting, Finishing, ProductionSubscribable, ArtworkSubscribable, InstallSubscribable */];

			for(let i = 0; i < this.#creationOrder.length; i++) {
				let UIContainer = new Object();
				let d = createDivStyle5("", this.#creationOrder[i].Type, this.page1);
				UIContainer.container = d[0];
				UIContainer.contentContainer = d[1];
				this.#containers.push(UIContainer);
				let addBtn = createButton("+", "width:50px;min-height:100%;margin:0px;border:0px;", () => {
					this.#addBlank(this.#creationOrder[i], this.#containers[i].contentContainer);
				}, UIContainer.contentContainer);
			}
			for(let x = 0; x < this.#containers.length; x++) {
				let sameItemCount = 0;
				for(let y = 0; y < this.#allMaterials.length; y++) {
					let item = this.#allMaterials[y];
					if(item instanceof this.#creationOrder[x]) {
						if(sameItemCount == 0) {

						}
						sameItemCount++;
						this.#containers[x].contentContainer.appendChild(item.container);
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

	hide() {
		super.hide();

		if(this.#numProducts > 0) {
			this.DeleteProductsAll();
		}
	}
}