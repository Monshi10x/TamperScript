class QWH {
      qty;
      get qty() {return this.qty;}
      set qty(value) {this.qty = value;}

      width;
      get width() {return this.width;}
      set width(value) {this.width = value;}

      height;
      get height() {return this.height;}
      set height(value) {this.height = value;}

      constructor(qty = 0, width = 0, height = 0) {
            this.qty = qty;
            this.width = width;
            this.height = height;
      }
}