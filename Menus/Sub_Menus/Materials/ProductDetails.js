class ProductDetails extends Material {
      static DISPLAY_NAME = "PRODUCT DETAILS";

      #productLocationField = "";
      set productLocation(value) {this.#productLocationField[1].value = value;}
      get productLocation() {return this.#productLocationField;}

      #productNameField = "";
      set productName(value) {this.#productNameField[1].value = value;}
      get productName() {return this.#productNameField;}

      /**
       * @Inherited
       * @example
       * [{parent: 'SHEET-1699952073332-95570559', data: []},
       * {parent: 'SHEET-1699952073332-95574529', data: []}]
       */
      #inheritedData = [];

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

      #includeSizeInWording;

      get backgroundColor() {return "rgb(156 35 71);";}
      get textColor() {return COLOUR.White;}

      constructor(parentObject, sizeClass, type) {
            super(parentObject, sizeClass, type);

            this.#productLocationField = createInput_Infield("Product Location", null, "width:30%", null, this.container, false, null);
            this.#productLocationField[1].placeholder = "i.e. Main Fascia";
            this.#productNameField = createInput_Infield("Product Name", null, "width:30%", null, this.container, false, null);
            this.#productNameField[1].placeholder = "i.e. ACM Panel";

            this.dataToPushToSubscribers = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
      }

      /**@Inherited */
      UpdateFromChange() {
            super.UpdateFromChange();

            this.dataToPushToSubscribers = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
            this.UpdateSubscribedLabel();
            this.PushToSubscribers();
      }

      ReceiveSubscriptionData(data) {
            let dataIsNew = true;
            for(let i = 0; i < this.#inheritedData.length; i++) {
                  if(data.parent == this.#inheritedData[i].parent) {
                        dataIsNew = false;
                        this.#inheritedData[i] = data;
                        break;
                  }
            }
            if(dataIsNew) {
                  this.#inheritedData.push(data);
            }

            super.ReceiveSubscriptionData(data);
      }

      /**@Override */
      UnSubscribeFrom(parent) {
            for(let i = 0; i < this.#inheritedData.length; i++) {
                  if(this.#inheritedData[i].parent == parent) {
                        this.#inheritedData.splice(i, 1);
                        break;
                  }
            }
            super.UnSubscribeFrom(parent);
      }

      async Create(productNo, partIndex) {
            partIndex = await super.Create(productNo, partIndex);
            await setProductName(productNo, "[" + this.#productLocationField[1].value + "] " + this.#productNameField[1].value);
            return partIndex;
      }

      Description() {
            return "";
      }
}