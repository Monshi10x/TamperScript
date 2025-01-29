
class MenuMap extends LHSMenuWindow {

      //VARIABLES
      #page1;

      //FIELDS
      #f_qty;
      #f_createProductBtn;

      #artwork;

      constructor(width, height, ID, windowTitle) {
            super(width, height, ID, windowTitle);
            this.addPages(1);
            this.#page1 = this.getPage(0);

            this.CreateGUI();
      }

      show() {
            super.show();
      }

      CreateGUI() {
            //this.clearPages(0);

            let container = createDivStyle5(null, "Type", this.#page1)[1];

            let container5 = createDivStyle5(null, "Artwork", this.#page1)[1];
            this.#artwork = new Artwork(container5, null, null);

            this.#f_createProductBtn = createButton('Create Product', "margin:0px;width:100%", async () => {
                  await this.Create();
            });
            this.footer.appendChild(this.#f_createProductBtn);
      }

      hide() {
            super.hide();
      }

      async Create() {
            this.minimize();
            await AddBlankProduct();
            let productNo = getNumProducts();
            var newPartIndex = 1;

            //await q_AddPart_CostMarkup(productNo, 0, true, false, 1, parseFloat(this.#f_costForQty[1].value) / parseFloat(this.#f_qty[1].value), this.#f_markup[1].value, "");
            await setProductQty(productNo, this.#f_qty[1].value);
            await setProductSummary(productNo, this.Description());
            // await setProductName(productNo, this.#f_typeDropdown[1].value);

            Ordui.Alert("Done");
            return newPartIndex;
      }
      //catchNull(value, valueIfNull)
      Description() {
            return "" +
                  this.#artwork.Description();
      }
} 