class ChartMenu extends LHSMenuWindow {

      constructor(width, height, ID, windowTitle) {
            super(width, height, ID, windowTitle);
            this.addPages(1);
      }

      show() {
            super.show();

            var page = this.getPage(0);

            while(page.hasChildNodes()) {page.removeChild(page.lastChild);}
            while(this.footer.hasChildNodes()) {this.footer.removeChild(this.footer.lastChild);}

            let testChart = new BarGraph([{x: 10, y: 10}, {x: 15, y: 20}, {x: 40, y: 30}], "x", "y", "title", page);
      }

      hide() {
            super.hide();
      }

      tick() {
            this.tickUpdate();
      }

      tickUpdate() {

      }
}