class ProductDetails extends SubscriptionManager {

      #container;
      get container() {return this.#container;}

      #Type = "PRODUCT DETAILS";
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
      #setting_KeepQty1;
      #setting_IncludeSizeInDescription;
      #includeSizeInDescription = false;
      #showIDInContainer = true;
      #rowName;
      #lhsMenuWindow;
      #backgroundColor = COLOUR.Pink;
      get backgroundColor() {return this.#backgroundColor;}
      #textColor = COLOUR.White;
      get textColor() {return this.#textColor;}

      #productLocationField = "";
      set productLocation(value) {this.#productLocationField[1].value = value;}
      get productLocation() {return this.#productLocationField;}

      #productNameField = "";
      set productName(value) {this.#productNameField[1].value = value;}
      get productName() {return this.#productNameField;}

      /**
       * @SIZES
       */
      #qty;
      get qty() {return zeroIfNaNNullBlank(this.#qty[1].value);}
      set qty(value) {$(this.#qty[1]).val(value).change();};

      /**
       * @Subscribers
       * @Updated on table changes
       * @example 
       *          [{qty: 4, width: '2440', height: '1220'},
       *           {qty: 4, width: '2440', height: '580'},
       *           {qty: 1, width: '240', height: '1220'},
       *           {qty: 1, width: '240', height: '580'}]
       */
      //#dataForSubscribers = [];

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
                        this.onProductNumberChange();
                  });
                  modal.value = this.productNumber;
            }, this.#container);

            this.#typeLabel = createText(this.#Type, "height:40px;margin:0px;background-color:" + this.#backgroundColor + ";width:150px;font-size:10px;color:" + this.#textColor + ";text-align:center;line-height:30px;position:relative;border:1px solid " + this.#backgroundColor + ";", this.#container);

            this.#qty = createInput_Infield("Qty", 1, "width:80px;margin:0px 5px;box-shadow:none;box-sizing: border-box;", () => {this.UpdateFromChange();}, this.#container, true, 1);

            this.#productLocationField = createInput_Infield("Product Location", null, "margin:0px 5px;box-shadow:none;box-sizing: border-box;width:180px;", null, this.#container, false, null);
            this.#productLocationField[1].placeholder = "i.e. Main Fascia";
            this.#productNameField = createInput_Infield("Product Name", null, "margin:0px 5px;box-shadow:none;box-sizing: border-box;width:180px;", null, this.#container, false, null);
            this.#productNameField[1].placeholder = "i.e. ACM Panel";

            this.#deleteBtn = createIconButton(GM_getResourceURL("Icon_Bin"), "", "display: block; float: right; width: 35px;height:40px; border:none;padding:0px;color:white;min-height: 20px; margin: 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Red + ";", () => {this.Delete();});
            this.#container.appendChild(this.#deleteBtn);

            this.UpdateDataForSubscribers();
      }

      UpdateFromChange() {
            this.UpdateDataForSubscribers();
            this.PushToSubscribers();
      }


      UpdateDataForSubscribers() { }

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
            await setProductQty(productNo, this.qty);
            await setProductName(productNo, "[" + this.#productLocationField[1].value + "] " + this.#productNameField[1].value);
            return partIndex;
      }

      Description() {
            return "";
      }
}