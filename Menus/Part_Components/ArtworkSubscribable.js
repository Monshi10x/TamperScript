class ArtworkSubscribable extends Material {
      static DISPLAY_NAME = "ARTWORK";
      /*override*/get Type() {return "ARTWORK";}
      /**
       * @Inherited
       * @example
       * [{parent: 'SHEET-1699952073332-95570559', data: []},
       * {parent: 'SHEET-1699952073332-95574529', data: []}]
       */
      //#inheritedData2 = [];
      #inheritedSizes = [];
      #inheritedSizeTable;

      #dataForSubscribers = [];

      #artworkItem;
      get artworkItem() {return this.#artworkItem;}

      constructor(parentObject, sizeClass, type) {
            super(parentObject, sizeClass, type);

            /*
            InheritedParentSizeSplits*/
            let f_container_inheritedParentSizeSplits = createDivStyle5(null, "Inherited Parent Size Splits", this.container)[1];

            this.#inheritedSizeTable = new Table(f_container_inheritedParentSizeSplits, "100%", 20, 250);
            this.#inheritedSizeTable.container.style.cssText += "width:calc(100% - 20px);margin:10px;";
            this.#inheritedSizeTable.setHeading("Qty", "Width", "Height");
            this.#inheritedSizeTable.addRow("-", "-", "-");

            let f_container_artwork = createDivStyle5(null, "Artwork", this.container)[1];

            this.#artworkItem = new Artwork(f_container_artwork, null, () => { }, null);

            /*
            Update*/
            this.UpdateDataForSubscribers();
      }

      /*
      Inherited*/
      UpdateFromFields() {
            super.UpdateFromFields();

            this.UpdateFromInheritedData();
            this.UpdateDataForSubscribers();
            this.UpdateSubscribedLabel();
            this.PushToSubscribers();
      }

      UpdateDataForSubscribers() {
            this.DATA_FOR_SUBSCRIBERS = {
                  parent: this,
                  data: this.#dataForSubscribers
            };
      }

      UpdateFromInheritedData = () => {
            this.#inheritedSizes = [];
            this.#inheritedSizeTable.deleteAllRows();

            //Per Parent Subscription:
            for(let a = 0; a < this.SUBSCRIPTION_DATA.length; a++) {
                  let recievedInputSizes = this.SUBSCRIPTION_DATA[a].data;
                  for(let i = 0; i < recievedInputSizes.length; i++) {
                        if(!recievedInputSizes[i].QWHD) continue/**Only this iteration*/;

                        this.#inheritedSizes.push(recievedInputSizes[i].QWHD);
                        this.#inheritedSizeTable.addRow(recievedInputSizes[i].QWHD.qty, recievedInputSizes[i].QWHD.width, recievedInputSizes[i].QWHD.height);
                  }
            }
      };

      async Create(productNo, partIndex) {
            partIndex = await super.Create(productNo, partIndex);
            partIndex = await this.#artworkItem.Create(productNo, partIndex);
            return partIndex;
      }

      Description() {
            super.Description();

            return this.#artworkItem.Description();
      }
}