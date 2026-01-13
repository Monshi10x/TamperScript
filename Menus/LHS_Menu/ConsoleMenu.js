class ConsoleMenu extends LHSMenuWindow {

    #logField;

    constructor(width, height, ID, windowTitle) {
        super(width, height, ID, windowTitle);
        this.addPages(1);
        this.doesTick = true;
    }

    show() {
        super.show();
        const page = this.getPage(0);
        if(!this.#logField) {
            this.#logField = createTextarea("Console Output", "", "width:95%;height:calc(100% - 20px);margin:10px;box-sizing:border-box;", null, page);
            this.#logField.readOnly = true;
        }
        this.updateLogText();
    }

    tick() {
        this.updateLogText();
    }

    updateLogText() {
        if(!this.#logField) return;
        this.#logField.value = getConsoleLogText();
    }
}
