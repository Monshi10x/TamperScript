class QWHD {
      qty;
      get qty() {return this.qty;}
      set qty(value) {this.qty = value;}

      width;
      get width() {return this.width;}
      set width(value) {this.width = value;}

      height;
      get height() {return this.height;}
      set height(value) {this.height = value;}

      depth;
      get depth() {return this.depth;}
      set depth(value) {this.depth = value;}

      constructor(qty = 0, width = 0, height = 0, depth = 0) {
            this.qty = qty;
            this.width = width;
            this.height = height;
            this.depth = depth;
      }
}