class Size2 extends SubscriptionManager {
      static DISPLAY_NAME = "SIZE2";

      #commonSizes = {
            "DL": {
                  "show": false,
                  "width": 210,
                  "height": 99
            },
            "A0": {
                  "show": false,
                  "width": 841,
                  "height": 1189
            },
            "A1": {
                  "show": false,
                  "width": 594,
                  "height": 841
            },
            "A2": {
                  "show": false,
                  "width": 420,
                  "height": 594
            },
            "A3": {
                  "show": false,
                  "width": 297,
                  "height": 420
            },
            "A4": {
                  "show": false,
                  "width": 210,
                  "height": 297
            },
            "A5": {
                  "show": false,
                  "width": 148.5,
                  "height": 210
            },
            "A6": {
                  "show": false,
                  "width": 105,
                  "height": 148.5
            },
            "A7": {
                  "show": false,
                  "width": 74,
                  "height": 105
            },
            "A8": {
                  "show": false,
                  "width": 52,
                  "height": 74
            },
            "A9": {
                  "show": false,
                  "width": 37,
                  "height": 52
            },
            "A10": {
                  "show": false,
                  "width": 26,
                  "height": 37
            },
            "600x450": {
                  "show": false,
                  "width": 600,
                  "height": 450
            },
            "600x900": {
                  "show": false,
                  "width": 600,
                  "height": 900
            },
            "610x1220": {
                  "show": false,
                  "width": 610,
                  "height": 1220
            },
            "1000x1000": {
                  "show": false,
                  "width": 1000,
                  "height": 1000
            },
            "900x1220": {
                  "show": false,
                  "width": 900,
                  "height": 1220
            },
            "1220x1220": {
                  "show": false,
                  "width": 1220,
                  "height": 1220
            },
            "2440x1220": {
                  "show": false,
                  "width": 2440,
                  "height": 1220
            },
            "3050x1220": {
                  "show": false,
                  "width": 3050,
                  "height": 1220
            },
            "3050x1500": {
                  "show": false,
                  "width": 3050,
                  "height": 1500
            },
            "3660x1220": {
                  "show": false,
                  "width": 3660,
                  "height": 1220
            },
            "3050x2000": {
                  "show": false,
                  "width": 3050,
                  "height": 2000
            },
            "4000x1500": {
                  "show": false,
                  "width": 4000,
                  "height": 1500
            },
            "4000x2000": {
                  "show": false,
                  "width": 4000,
                  "height": 2000
            },
            "10000x2550": {
                  "show": false,
                  "width": 10000,
                  "height": 2550
            },
      };

      #container;
      get container() {return this.#container;}

      #Type = "SIZE2";
      get Type() {return this.#Type;}
      set Type(type) {this.#Type = type;};

      #UNIQUEID = generateUniqueID();
      get ID() {return this.#Type + "-" + this.#UNIQUEID;}

      #productNumberLabel;
      #productNumber = -1;
      get productNumber() {return this.#productNumber;}
      set productNumber(value) {this.#productNumber = value; this.#productNumberLabel.innerText = value;}

      #typeLabel;
      get typeLabel() {return this.#typeLabel;}

      #subscribedToLabel;
      get inheritedRowSizeLabel() {return this.#subscribedToLabel;}

      #heading;
      #minimizeBtn;
      #deleteBtn;
      #setting_IncludeDepth;
      #setting_IncludeSizeInDescription;
      #includeSizeInDescription = false;
      #showIDInContainer = true;
      #rowName;
      #lhsMenuWindow;
      #backgroundColor = COLOUR.BrightGreen;
      get backgroundColor() {return this.#backgroundColor;}
      #textColor = COLOUR.White;
      get textColor() {return this.#textColor;}

      /**
       * @SIZES
       */
      #qtyIsEmbeddedInProduct = false;
      #qty;
      get qty() {return zeroIfNaNNullBlank(this.#qty[1].value);}
      set qty(value) {$(this.#qty[1]).val(value).change();};

      #width;
      get width() {return zeroIfNaNNullBlank(this.#width[1].value);}
      set width(value) {$(this.#width[1]).val(value).change();};

      #height;
      get height() {return zeroIfNaNNullBlank(this.#height[1].value);}
      set height(value) {$(this.#height[1]).val(value).change();};

      #depth;
      get depth() {return zeroIfNaNNullBlank(this.#depth[1].value);}
      set depth(value) {$(this.#depth[1]).val(value).change();};
      /**
       * @Subscribers
       * @Updated on table changes
       * @example 
       *          [{qty: 4, width: '2440', height: '1220'},
       *           {qty: 4, width: '2440', height: '580'},
       *           {qty: 1, width: '240', height: '1220'},
       *           {qty: 1, width: '240', height: '580'}]
       */
      #dataForSubscribers = [];
      #matrixSizes = [];

      constructor(parentContainer, lhsMenuWindow) {
            super();
            if(!lhsMenuWindow instanceof LHSMenuWindow) throw new Error('Parameter 2 must be an instance of LHSMenuWindow');
            this.#lhsMenuWindow = lhsMenuWindow;

            this.#container = document.createElement("div");
            this.#container.style =
                  "display: block; float: left; width: calc(100% - 16px);min-height:20px; background-color:" +
                  COLOUR.White +
                  ";border:2px solid;border-color: black;margin:8px;box-shadow: rgb(0 0 0 / 80%) 3px 4px 10px 0px;padding:0px;overflow:hidden;box-sizing: border-box;";
            parentContainer.appendChild(this.#container);
            $(this.#container).hover(function() {
                  $(this).css("box-shadow", "rgba(0, 0, 0, 1) 3px 4px 10px 0px");
            }, function() {
                  $(this).css("box-shadow", "rgba(0, 0, 0, 0.8) 3px 4px 10px 0px");
            });

            this.#productNumberLabel = createButton(this.productNumber, "height:40px;margin:0px;background-color:" + this.backgroundColor + ";width:60px;font-size:10px;color:" + this.textColor + ";text-align:center;line-height:30px;border:1px solid " + this.backgroundColor + ";", () => {
                  let modal = new ModalSingleInput("Enter New Product Number", () => {
                        this.productNumber = modal.value;
                        console.log(modal.value);
                        this.onproductNumberChange();
                  });
                  modal.value = this.productNumber;
            }, this.#container);

            this.#typeLabel = createText(this.#Type, "height:40px;margin:0px;background-color:" + this.#backgroundColor + ";width:150px;font-size:10px;color:" + this.#textColor + ";text-align:center;line-height:30px;position:relative;border:1px solid " + this.#backgroundColor + ";", this.#container);

            this.#qty = createInput_Infield("Qty", 1, "width:80px;margin:0px 5px;box-shadow:none;box-sizing: border-box;", () => {this.UpdateFromChange();}, this.#container, true, 1);

            this.#width = createInput_Infield("Width", null, "width:13%;margin:0px 5px;box-shadow:none;box-sizing: border-box;", () => {this.UpdateFromChange();}, this.#container, true, 100, {postfix: "mm"});

            this.#height = createInput_Infield("Height", null, "width:13%;margin:0px 5px;box-shadow:none;box-sizing: border-box;", () => {this.UpdateFromChange();}, this.#container, true, 100, {postfix: "mm"});

            this.#depth = createInput_Infield("Depth", null, "width:13%;margin:0px 5px;box-shadow:none;box-sizing: border-box;", () => {this.UpdateFromChange();}, this.#container, false, 10, {postfix: "mm"});
            $(this.#depth[0]).hide();

            let commonSizeButton = createButton("A4,...", "width:60px;height:40px;margin:0px;margin-left:5px;margin-right:10px", () => {
                  this.#openCommonSizeModal();
            }, this.#container);

            let settingsButton = createButton("", "width:40px;height:40px;margin:0px;margin-left:5px;margin-right:10px;font-size:20px;", () => {
                  this.#openSettingsModal();
            }, this.#container);
            settingsButton.innerHTML = "&#9881";

            this.#setting_IncludeSizeInDescription = createCheckbox_Infield("Include Size(s) In Description", false, "width: 450px;", () => {
                  this.#includeSizeInDescription = this.#setting_IncludeSizeInDescription[1].checked;
            });
            this.#setting_IncludeDepth = createCheckbox_Infield("Include Depth", false, "width: 450px;", () => {
                  $(this.#depth[0]).toggle();
            });

            this.#deleteBtn = createIconButton(GM_getResourceURL("Icon_Bin"), "", "display: block; float: right; width: 35px;height:40px; border:none;padding:0px; color:white;min-height: 20px; margin: 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Red + ";", () => {this.Delete();});
            this.#container.appendChild(this.#deleteBtn);

            this.UpdateDataForSubscribers();
      }

      UpdateFromChange() {
            this.UpdateDataForSubscribers();
            this.PushToSubscribers();
      }

      UpdateDataForSubscribers() {
            this.#dataForSubscribers = [];
            this.#matrixSizes = [];

            this.#dataForSubscribers.push(this.getQWH());
            this.#matrixSizes.push([[[this.getQWH().width, this.getQWH().height, this.getQWH().depth]]]);

            this.dataToPushToSubscribers = {
                  parent: this,
                  data: this.#dataForSubscribers,
                  matrixSizes: this.#matrixSizes
            };
      }

      getQWH() {
            return new QWHD(this.qty, this.width, this.height, this.depth);
      }

      #openCommonSizeModal() {
            let modal = new ModalToggleTokens("Choose Common Size", this.#commonSizes, (arg1_returnedSizes) => {
                  if(arg1_returnedSizes.length == 0) console.error("No new option pairs arg provided");
                  let returnedSizes = arg1_returnedSizes[0];
                  for(let i = 0; i < Object.keys(returnedSizes).length; i++) {
                        if(returnedSizes[Object.keys(returnedSizes)[i]]["show"] === true) {
                              $(this.#width[1]).val(parseFloat(returnedSizes[Object.keys(returnedSizes)[i]]["width"])).change();
                              $(this.#height[1]).val(parseFloat(returnedSizes[Object.keys(returnedSizes)[i]]["height"])).change();
                              break;
                        }
                  }
            }, false);
      }

      #openSettingsModal() {
            let modal = new Modal("Settings", () => { });
            modal.setContainerSize(500, 500);
            modal.addBodyElement(this.#setting_IncludeSizeInDescription[0]);
            modal.addBodyElement(this.#setting_IncludeDepth[0]);
            modal.addFooterElement(createButton("Ok", "width:100px;float:right;", () => {modal.hide();}));
      }

      onproductNumberChange() {
            this.UpdateFromChange();
      }

      onKeepQty1Change() {
            this.UpdateFromChange();
      }

      /**
       * @DeleteThis
       */
      Delete() {
            super.Delete();
            this.#lhsMenuWindow.DeleteMaterial(this);
            deleteElement(this.#container);
      }

      /**
       * @CorebridgeCreate
       */
      async Create(productNo, partIndex) {
            return partIndex;
      }

      Description() {
            let qwh = this.getQWH();
            if(this.#includeSizeInDescription) return "x" + qwh.qty + " @ " + qwh.width + "mmW x " + qwh.height + "mmH";
            return "";
      }
}