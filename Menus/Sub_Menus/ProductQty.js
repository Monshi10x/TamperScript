class ProductQty extends SubscriptionManager {
      static DISPLAY_NAME = "PRODUCT_QTY";

      #container;
      get container() {return this.#container;}

      #Type = "PRODUCT QTY";
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

            this.#deleteBtn = createButton("X", "display: block; float: right; width: 35px;height:40px; border:none;padding:2px; color:white;min-height: 20px; margin: 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Red + ";", () => {this.Delete();});
            this.#container.appendChild(this.#deleteBtn);

            this.UpdateDataForSubscribers();
      }

      UpdateFromChange() {
            this.UpdateDataForSubscribers();
            this.PushToSubscribers();
      }


      UpdateDataForSubscribers() {
            /*this.#dataForSubscribers = [];
            this.#matrixSizes = [];

            this.#dataForSubscribers.push(this.getQWH());
            this.#matrixSizes.push([[[this.getQWH().width, this.getQWH().height, this.getQWH().depth]]]);

            this.dataToPushToSubscribers = {
                  parent: this,
                  data: this.#dataForSubscribers,
                  matrixSizes: this.#matrixSizes
            };*/
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
            await setProductQty(productNo, this.qty);
            return partIndex;
      }

      Description() {

      }
}