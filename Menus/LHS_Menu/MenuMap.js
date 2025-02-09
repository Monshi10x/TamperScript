
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

            this.#f_truckPackingAndSetupTime = createInput_Infield("Truck Packing And Setup Time", 30, "width:200px;", () => { }, this.#f_timeContainer, false, 5, {postfix: "mins"});

            this.#f_travelDistanceMeters = createInput_Infield("Distance To", 0, "width:200px;", () => { }, this.#f_timeContainer, false, 1, {postfix: "km"});
            setFieldDisabled(true, this.#f_travelDistanceMeters[1], this.#f_travelDistanceMeters[0]);

            this.#f_travelTimeMins = createInput_Infield("Travel Time To", 0, "width:200px;", () => { }, this.#f_timeContainer, false, 1, {postfix: "mins"});
            setFieldDisabled(true, this.#f_travelTimeMins[1], this.#f_travelTimeMins[0]);

            ///

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

            if(!ko.installAddress) return;

            console.log(ko.installAddress);

            $(this.#f_searchField[1]).val(ko.installAddress);
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
                  fields: ["formatted_address", "geometry", "name"],
                  strictBounds: false,
            });
            this.placeAutocomplete.bindTo('bounds', googleMap);

            this.placeAutocomplete.addListener("place_changed", async () => {
                  let place = this.placeAutocomplete.getPlace();

                  if(!place) return;

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

      async setOrderInstallAddress() {
            let koStorageObject = getKOStorageVariable();

            koStorageObject.installAddress = this.#f_searchField[1].value;
            koStorageObject.travelDistance = this.#f_travelDistanceMeters[1].value || 0;
            koStorageObject.travelTime = this.#f_travelTimeMins[1].value || 0;

            console.log(JSON.stringify(koStorageObject));

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

            let totalTravelMins = this.#f_travelTimeMins[1].value * 2 + this.#f_truckPackingAndSetupTime[1].value;
            let totalTravelDistance = this.#f_travelDistanceMeters[1].value * 2;

            let totalOrderPrice = 0;
            let numProducts = getNumProducts();
            let numProductsToDivideAgainst = numProducts;

            switch(method) {
                  case "Split Equally":
                        for(let i = 0; i < numProducts; i++) {
                              let productPrice = getProductPrice(i + 1);
                              if(productPrice == 0) numProductsToDivideAgainst--;
                              totalOrderPrice += productPrice;
                        }

                        for(let i = 0; i < numProducts; i++) {
                              let productPrice = getProductPrice(i + 1);
                              if(productPrice == 0) continue;
                        }
                        console.log(totalTravelMins / numProductsToDivideAgainst, totalTravelMins, numProductsToDivideAgainst);
                  case "Divide By $ Percentage":
                        for(let i = 0; i < numProducts; i++) {
                              let productPrice = getProductPrice(i + 1);
                              if(productPrice == 0) numProductsToDivideAgainst--;
                              totalOrderPrice += productPrice;
                        }

                        for(let i = 0; i < numProducts; i++) {
                              let productPrice = getProductPrice(i + 1);
                              if(productPrice == 0) continue;

                              let productMultiplier = productPrice / totalOrderPrice;

                              let productTravelMins = totalTravelMins * productMultiplier;

                              console.log(productTravelMins);
                        }
                        break;
                  default: break;
            }
            /* await AddBlankProduct();
             let productNo = getNumProducts();
             var newPartIndex = 1;
 
             //await q_AddPart_CostMarkup(productNo, 0, true, false, 1, parseFloat(this.#f_costForQty[1].value) / parseFloat(this.#f_qty[1].value), this.#f_markup[1].value, "");
             await setProductQty(productNo, this.#f_qty[1].value);
             await setProductSummary(productNo, this.Description());
             // await setProductName(productNo, this.#f_typeDropdown[1].value);
 */
            Ordui.Alert("Done");
      }
      //catchNull(value, valueIfNull)
      Description() {
            return "";
      }
} 