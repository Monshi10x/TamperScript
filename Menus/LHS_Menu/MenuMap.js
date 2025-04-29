
class MenuMap extends LHSMenuWindow {

      //VARIABLES
      #markers = [];
      SHOW_DEBUG = true;

      //FIELDS
      #f_qty;
      #f_page1;
      #f_createProductBtn;
      #f_truckPackingAndSetupTime;
      #f_searchField;
      #f_setInstallBtn;
      #f_mapContainer;
      #f_timeContainer;
      #f_searchContainer;
      #f_travelDistanceMeters;
      #f_travelTimeMins;
      #f_createParts_DivideEqually;
      #f_createParts_DivideBy$Percentage;
      #f_numberOfMobilisations;
      #f_travelRate;
      #f_mobilisationContainer;
      #f_settingsContainer;
      #f_setting_excludeEWPs;
      #f_setting_excludeArtwork;
      #f_setting_addToSpecificProductsOnly;

      get travelRate() {
            return this.#f_travelRate[1].value;
      }

      constructor(width, height, ID, windowTitle) {
            super(width, height, ID, windowTitle);
            this.addPages(1);
            this.#f_page1 = this.getPage(0);

            this.CreateGUI();

            document.addEventListener("googleMapLoaded", (e) => {
                  if(googleMap == null || googleMapContainer == null) return;

                  this.onGoogleMapHasLoaded();
            });
      }

      CreateGUI() {
            //this.clearPages(0);
            ///SEARCH
            this.#f_searchContainer = createDivStyle5(null, "Search", this.#f_page1)[1];

            this.#f_searchField = createInput_Infield("Search", null, "width:calc(100% - 16px);", async () => { }, this.#f_searchContainer, false, null);
            this.#f_searchField[1].style.cssText += "width:100%;";

            this.#f_setInstallBtn = createButton("Set As Install Address", null, async () => {
                  await this.onsetOrderInstallAddress();
            }, this.#f_searchContainer);

            ///TIMES
            this.#f_timeContainer = createDivStyle5(null, "Times", this.#f_page1)[1];

            this.#f_travelDistanceMeters = createInput_Infield("Distance To", 0, "width:200px;", () => { }, this.#f_timeContainer, false, 1, {postfix: "km"});
            setFieldDisabled(true, this.#f_travelDistanceMeters[1], this.#f_travelDistanceMeters[0]);

            this.#f_travelTimeMins = createInput_Infield("Travel Time To", 0, "width:200px;", () => { }, this.#f_timeContainer, false, 1, {postfix: "mins"});
            setFieldDisabled(true, this.#f_travelTimeMins[1], this.#f_travelTimeMins[0]);

            ///MOBILISATION
            this.#f_mobilisationContainer = createDivStyle5(null, "Mobilisation", this.#f_page1)[1];

            this.#f_truckPackingAndSetupTime = createInput_Infield("Truck Packing And Setup Time", 30, "width:200px;", () => { }, this.#f_mobilisationContainer, false, 5, {postfix: "mins"});

            this.#f_numberOfMobilisations = createInput_Infield("Number of Mobilisations", 1, "width:200px;", () => { }, this.#f_mobilisationContainer, false, 1, {postfix: ""});

            document.addEventListener("loadedPredefinedModifiers", (e) => {
                  let dropdownOptions = [];
                  let modifierOptions = getModifierDropdown_Name_Price_Cost("Travel IH");
                  modifierOptions.forEach((element) => {
                        dropdownOptions.push(createDropdownOption(element.Name, element.Name));
                  });
                  this.#f_travelRate = createDropdown_Infield("Travel Rate", 5, null, dropdownOptions, () => { }, this.#f_mobilisationContainer);
            });

            ///SETTINGS
            this.#f_settingsContainer = createDivStyle5(null, "Settings", this.#f_page1)[1];

            this.#f_setting_excludeEWPs = createCheckbox_Infield("Exclude EWPs", true, "width:20%;", () => { }, this.#f_settingsContainer);
            this.#f_setting_excludeArtwork = createCheckbox_Infield("Exclude Artwork", true, "width:20%;", () => { }, this.#f_settingsContainer);

            this.#f_setting_addToSpecificProductsOnly = createTextarea("Add To Specific Products Only (separate by comma) i.e. 1,3,5", "", "", () => { });
            this.#f_settingsContainer.appendChild(this.#f_setting_addToSpecificProductsOnly);

            ///CREATE
            this.#f_createParts_DivideEqually = createButton('Create -> Split Equally', "margin:0px;width:50%", async () => {
                  await this.Create("Split Equally");
            });
            this.footer.appendChild(this.#f_createParts_DivideEqually);

            this.#f_createParts_DivideBy$Percentage = createButton('Create -> Divide By $ Percentage', "margin:0px;width:50%", async () => {
                  await this.Create("Divide By $ Percentage");
            });
            this.footer.appendChild(this.#f_createParts_DivideBy$Percentage);
      }

      onGoogleMapHasLoaded() {
            this.#f_mapContainer = createDivStyle5(null, "Map", this.#f_page1)[1];

            GoogleMap.borrowGoogleMap(this.#f_mapContainer);

            googleMapContainer.style.cssText += "width:calc(100%);height:600px;";

      }

      show() {
            super.show();

            (async () => {
                  await this.bindAutoComplete();
                  await this.loadOrderAddress();
                  await GoogleMap.showDirections(this.#f_searchField[1].value);
                  await this.updateTravelFields(this.#f_searchField[1].value);
            })();
      }

      async loadOrderAddress() {
            let ko = getKOStorageVariable();

            if(!ko) return;

            if(ko.travelDistance) $(this.#f_travelDistanceMeters[1]).val(ko.travelDistance);
            if(ko.travelTime) $(this.#f_travelTimeMins[1]).val(ko.travelTime);
            if(ko.numberOfMobilisations) $(this.#f_numberOfMobilisations[1]).val(ko.numberOfMobilisations);
            if(ko.truckPackingAndSetupTime) $(this.#f_truckPackingAndSetupTime[1]).val(ko.truckPackingAndSetupTime);

            if(!ko.formattedAddressString) return;

            if(this.SHOW_DEBUG) console.log("Install Address: " + ko.formattedAddressString);

            $(this.#f_searchField[1]).val(ko.formattedAddressString);
      }

      async onsetOrderInstallAddress() {
            GoogleMap.deleteAllMapMarkers();
            GoogleMap.deleteAllDirections();

            await GoogleMap.showDirections(this.#f_searchField[1].value);
            await this.updateTravelFields(this.#f_searchField[1].value);
            await this.setOrderInstallAddress();
      }

      async bindAutoComplete() {
            await google.maps.importLibrary("places");

            this.placeAutocomplete = new google.maps.places.Autocomplete(this.#f_searchField[1], {
                  fields: ["formatted_address", "geometry", "name", "address_components", "icon"],
                  strictBounds: false,
            });
            this.placeAutocomplete.bindTo('bounds', googleMap);

            this.placeAutocomplete.addListener("place_changed", async () => {
                  let place = this.placeAutocomplete.getPlace();

                  if(!place) return;

                  this.formattedAddressString = this.formatedAddressString(place);

                  GoogleMap.deleteAllMapMarkers();
                  GoogleMap.deleteAllDirections();

                  let address = place.formatted_address;

                  if(!place.geometry || !place.geometry.location) {
                        window.alert("No details available for input: '" + place.name + "'");
                        return;
                  }

                  if(place.geometry.viewport) {
                        googleMap.fitBounds(place.geometry.viewport);
                  } else {
                        googleMap.setCenter(place.geometry.location);
                        googleMap.setZoom(17);
                  }

                  GoogleMap.createMarker(place.geometry.location, "<b style='color:black'>" + address + "</b>");

                  await GoogleMap.showDirections(address);
                  await this.updateTravelFields(address);
            });
      }


      formatedAddressString(place) {
            if(!place.address_components) {
                  throw new Error("Invalid place object: no address_components found.");
            }

            const components = {
                  street_number: '',
                  route: '',
                  locality: '',          // City
                  administrative_area_level_1: '', // State
                  postal_code: '',
                  country: ''
            };

            place.address_components.forEach(component => {
                  const types = component.types;
                  if(types.includes('street_number')) {
                        components.street_number = component.long_name;
                  }
                  if(types.includes('route')) {
                        components.route = component.long_name;
                  }
                  if(types.includes('locality')) {
                        components.locality = component.long_name;
                  }
                  if(types.includes('administrative_area_level_1')) {
                        components.administrative_area_level_1 = component.short_name;
                  }
                  if(types.includes('postal_code')) {
                        components.postal_code = component.long_name;
                  }
                  if(types.includes('country')) {
                        components.country = component.long_name;
                  }
            });

            // Build your final string
            const street = [components.street_number, components.route].filter(Boolean).join(' ');

            return `${street}, ${components.locality}, ${components.administrative_area_level_1}, ${components.postal_code}, ${components.country}`;
      }

      formatedAddressObject(place) {
            if(!place.address_components) {
                  throw new Error("Invalid place object: no address_components found.");
            }

            const components = {
                  street_number: '',
                  route: '',
                  locality: '',                  // City
                  administrative_area_level_1: '',// State
                  postal_code: '',
                  country: ''
            };

            place.address_components.forEach(component => {
                  const types = component.types;
                  if(types.includes('street_number')) {
                        components.street_number = component.long_name;
                  }
                  if(types.includes('route')) {
                        components.route = component.long_name;
                  }
                  if(types.includes('locality')) {
                        components.locality = component.long_name;
                  }
                  if(types.includes('administrative_area_level_1')) {
                        components.administrative_area_level_1 = component.short_name;
                  }
                  if(types.includes('postal_code')) {
                        components.postal_code = component.long_name;
                  }
                  if(types.includes('country')) {
                        components.country = component.long_name;
                  }
            });

            const street = [components.street_number, components.route].filter(Boolean).join(' ');

            return {
                  street: street || null,
                  city: components.locality || null,
                  state: components.administrative_area_level_1 || null,
                  postcode: components.postal_code || null,
                  country: components.country || null
            };
      }


      async setOrderInstallAddress() {
            let koStorageObject = getKOStorageVariable();

            koStorageObject.formattedInstallAddress = this.formattedAddressString;
            //koStorageObject.installAddress = this.#f_searchField[1].value;
            koStorageObject.travelDistance = this.#f_travelDistanceMeters[1].value || 0;
            koStorageObject.travelTime = this.#f_travelTimeMins[1].value || 0;
            koStorageObject.numberOfMobilisations = this.#f_numberOfMobilisations[1].value || 0;
            koStorageObject.truckPackingAndSetupTime = this.#f_truckPackingAndSetupTime[1].value || 0;

            if(this.SHOW_DEBUG) console.log(JSON.stringify(koStorageObject));

            setKOStorageVariable(koStorageObject);
      }

      async updateTravelFields(destinationAddress) {
            if(!destinationAddress) return;

            let updatedStats = await GoogleMap.getTravelStats(destinationAddress);

            $(this.#f_travelDistanceMeters[1]).val(roundNumber(updatedStats.distance / 1000, 2)).change();
            $(this.#f_travelTimeMins[1]).val(roundNumber(updatedStats.duration / 60, 2)).change();
      }

      hide() {
            super.hide();
      }

      async Create(method) {
            this.minimize();

            await this.onsetOrderInstallAddress();

            let totalOrderPrice = 0;
            let totalOrderPriceLessTravel = 0;
            let travelPrices = [];
            let numProducts = getNumProducts();
            let numProductsToDivideAgainst = numProducts;
            let productNames = getProductNames();
            let numberOfMobilisations = this.#f_numberOfMobilisations[1].value;

            let totalTravelMins = zeroIfNaNNullBlank(this.#f_travelTimeMins[1].value) * 2 * numberOfMobilisations + zeroIfNaNNullBlank(this.#f_truckPackingAndSetupTime[1].value);
            let totalTravelDistance = zeroIfNaNNullBlank(this.#f_travelDistanceMeters[1].value) * 2 * numberOfMobilisations;

            let productNumbersToAddTo = this.#f_setting_addToSpecificProductsOnly.value.replace(" ", "");
            productNumbersToAddTo = productNumbersToAddTo ? productNumbersToAddTo.split(",").map(Number) : [];
            let priceOfProductsNotIncluded = 0;

            let domProducts = document.getElementsByClassName("ord-prod-model-item");

            //delete travel-auto parts from those that dont need it anymore
            for(let i = 0; i < numProducts; i++) {

                  let partNamesInProduct = getPartNamesInProduct(i + 1);
                  let travelPartNo = null;
                  let travelPrice = 0;
                  let productPrice = getProductPrice(i + 1);
                  let productNumberIsPartOfList = productNumbersToAddTo.includes(i + 1);
                  let productNumberListEmpty = productNumbersToAddTo.length == 0;
                  let includesTravel = false;

                  for(let j = 0; j < partNamesInProduct.length; j++) {
                        if(partNamesInProduct[j] == "TRAVEL [Automatic]") {
                              travelPartNo = j + 1;
                              includesTravel = true;

                              travelPrice = parseFloat(domProducts[i].getElementsByClassName("ord-prod-part-header")[j].getElementsByClassName("partPrice")[0].innerText.replace("$", ""));
                        }
                  }

                  travelPrices.push({
                        productNo: i + 1,
                        includesTravel: includesTravel,
                        productPrice: productPrice,
                        travelPrice: travelPrice,
                        excludedFromCalculations: false,
                        priceExcludingTravel: productPrice - travelPrice
                  });

                  if(productNumberIsPartOfList) continue;
                  if(/*doesn't include travel*/travelPartNo == null) continue;

                  if(travelPrices[i].includesTravel && travelPrices[i].priceExcludingTravel == 0) {
                        await DeletePart(i + 1, travelPartNo);

                        travelPrices[i] = {
                              productNo: i + 1,
                              includesTravel: false,
                              productPrice: productPrice,
                              travelPrice: 0,
                              excludedFromCalculations: false,
                              priceExcludingTravel: productPrice - travelPrice
                        };
                  }
                  if(travelPrices[i].includesTravel && !productNumberListEmpty) {
                        await DeletePart(i + 1, travelPartNo);

                        travelPrices[i] = {
                              productNo: i + 1,
                              includesTravel: false,
                              productPrice: productPrice,
                              travelPrice: 0,
                              excludedFromCalculations: false,
                              priceExcludingTravel: productPrice - travelPrice
                        };
                  }
            }

            for(let i = 0; i < numProducts; i++) {

                  //totalOrderPrice += productPrice;
                  totalOrderPriceLessTravel += travelPrices[i].priceExcludingTravel;

                  //if not part of list
                  if(productNumbersToAddTo.length != 0 && !productNumbersToAddTo.includes(i + 1)) {
                        numProductsToDivideAgainst--;
                        priceOfProductsNotIncluded += travelPrices[i].priceExcludingTravel;
                        travelPrices[i].excludedFromCalculations = true;
                        continue;
                  }

                  if(travelPrices[i].priceExcludingTravel == 0 && !productNumbersToAddTo.includes(i + 1)) {
                        numProductsToDivideAgainst--;
                        priceOfProductsNotIncluded += travelPrices[i].priceExcludingTravel;
                        travelPrices[i].excludedFromCalculations = true;
                        continue;
                  }

                  //if ewp
                  if(productNames[i].toLowerCase().includes("ewp") && this.#f_setting_excludeEWPs[1].checked) {
                        numProductsToDivideAgainst--;
                        priceOfProductsNotIncluded += travelPrices[i].priceExcludingTravel;
                        travelPrices[i].excludedFromCalculations = true;
                        continue;
                  }

                  //if artwork
                  if(productNames[i].toLowerCase().includes("artwork") && this.#f_setting_excludeArtwork[1].checked) {
                        numProductsToDivideAgainst--;
                        priceOfProductsNotIncluded += travelPrices[i].priceExcludingTravel;
                        travelPrices[i].excludedFromCalculations = true;
                        continue;
                  }
            }

            //if product numbers specified
            if(productNumbersToAddTo.length != 0) {
                  numProductsToDivideAgainst = productNumbersToAddTo.length;
            }

            //Final Creation
            for(let i = 0; i < numProducts; i++) {
                  let productPrice = getProductPrice(i + 1);
                  let productPriceLessTravel = travelPrices[i].priceExcludingTravel;


                  if(travelPrices[i].excludedFromCalculations == true) continue;

                  let productNo = i + 1;
                  let partIndex = getNumPartsInProduct(productNo); //last index by default

                  let productIncludesTravelAlready = {value: false, index: null};
                  let partNamesInProduct = getPartNamesInProduct(productNo);

                  for(let j = 0; j < partNamesInProduct.length; j++) {
                        if(partNamesInProduct[j] != "TRAVEL [Automatic]") continue;

                        productIncludesTravelAlready.value = true;
                        productIncludesTravelAlready.index = j + 1;
                        partIndex = j + 1;
                  }

                  let productTravelTime = 0;

                  let travelPrices_reduced = travelPrices.filter(item => item["excludedFromCalculations"] === false);

                  if(method == "Split Equally") {
                        productTravelTime = totalTravelMins / numProductsToDivideAgainst;
                  } else if(method == "Divide By $ Percentage") {

                        let isAllZeros = travelPrices_reduced.every(item => item['priceExcludingTravel'] === 0);


                        if(isAllZeros) {
                              productTravelTime = totalTravelMins / numProductsToDivideAgainst;
                        } else {
                              productTravelTime = totalTravelMins * (productPriceLessTravel / (totalOrderPriceLessTravel - priceOfProductsNotIncluded));
                        }
                  }

                  if(productIncludesTravelAlready.value == false) {
                        await AddPart("Install - IH", productNo);
                        partIndex++;
                        console.log("adding part ", productNo, partIndex);
                        await setPartDescription(productNo, partIndex, "TRAVEL [Automatic]");
                        setPartDescriptionDisabled(productNo, partIndex, true);
                        await setTravelTimeMHD(productNo, partIndex, productTravelTime, 0, 0);
                        await setTravelType(productNo, partIndex, this.travelRate);
                        await savePart(productNo, partIndex);
                  } else if(productIncludesTravelAlready.value == true) {
                        console.log("opening part ", productNo, partIndex);
                        await openPart(productNo, partIndex);
                        await setTravelTimeMHD(productNo, partIndex, productTravelTime, 0, 0);
                        await setTravelType(productNo, partIndex, this.travelRate);
                        await savePart(productNo, partIndex);
                  }
            }

            Ordui.Alert("Done");
      }

      Description() {
            return "";
      }
} 