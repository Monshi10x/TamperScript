class PathLength extends SubscriptionManager {
      static DISPLAY_NAME = "PATH LENGTH";

      #container;
      get container() {return this.#container;}

      #Type = "PATH LENGTH";
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
      #visualiser;
      #visualiserBtn;
      #svgFile;
      #minimizeBtn;
      #deleteBtn;
      #getPathLengthFromSVG;
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

      #pathLength;
      get pathLength() {return zeroIfNaNNullBlank(this.#pathLength[1].value);}
      set pathLength(value) {$(this.#pathLength[1]).val(value).change();};
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
            if(parentContainer != null) parentContainer.appendChild(this.#container);
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

            this.#pathLength = createInput_Infield("Path Length", null, "width:13%;margin:0px 5px;box-shadow:none;box-sizing: border-box;", () => {this.UpdateFromChange();}, this.#container, true, 100, {postfix: "mm"});

            this.#getPathLengthFromSVG = createFileChooserButton("", "margin:0px;min-height:32px;", (fileContent) => {
                  this.#svgFile = fileContent;
                  console.log("svg file set to");
                  console.log(this.#svgFile);
                  if(this.#svgFile) $(this.#visualiserBtn).show();
                  else $(this.#visualiserBtn).hide();

                  $(this.#pathLength[1]).val(roundNumber(svg_getTotalPathLengths(svg_makeElementFromString(this.#svgFile)), 2)).change();
            }, this.#container);

            this.#visualiserBtn = createIconButton("https://cdn.gorilladash.com/images/media/6195615/signarama-australia-searching-63ad3d8672602.png", "", "width:calc(60px);display:none;height:40px;margin:0px;background-color:" + COLOUR.Orange + ";", () => {
                  this.#visualiser = new ModalSVG("SVG", 100, () => {
                        this.UpdateFromChange();
                  }, this.#svgFile);
            }, this.#container, true);

            let settingsButton = createButton("", "width:40px;height:40px;margin:0px;margin-left:5px;margin-right:10px;font-size:20px;", () => {
                  this.#openSettingsModal();
            }, this.#container);
            settingsButton.innerHTML = "&#9881";

            this.#setting_IncludeSizeInDescription = createCheckbox_Infield("Include Size(s) In Description", false, "width: 450px;", () => {
                  this.#includeSizeInDescription = this.#setting_IncludeSizeInDescription[1].checked;
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
            this.#matrixSizes.push([[[this.getQWH().width]]]);

            this.dataToPushToSubscribers = {
                  parent: this,
                  data: this.#dataForSubscribers,
                  matrixSizes: this.#matrixSizes
            };
      }

      getQWH() {
            return new QWHD(this.qty, this.pathLength, 0, 0);
      }

      #openSettingsModal() {
            let modal = new Modal("Settings", () => { });
            modal.setContainerSize(500, 500);
            modal.addBodyElement(this.#setting_IncludeSizeInDescription[0]);
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
            if(this.#includeSizeInDescription) return "x" + qwh.qty + " @ " + qwh.width + "mm";
            return "";
      }
}