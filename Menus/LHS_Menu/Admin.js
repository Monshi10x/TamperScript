var global_orderMinimum_Price_Install = 95;
var global_orderMinimum_Profit = 60;
var global_orderMinimum_Profit_InstallJob = 100;
var global_orderMinimum_Price = 95;
var global_orderContainsAnInstall = false;
var global_containsOtherInformation = false;
var global_password = "ChewyYoda93";

class AdminPanel extends LHSMenuWindow {

    #passwordOverride;
    #minimumPrice;
    #minimumProfit;
    #minimumInstallPrice;
    #minimumProfitForInstallJobs;
    #unlockAllErrors;

    constructor(width, height, ID, windowTitle) {
        super(width, height, ID, windowTitle);
        this.addPages(1);
    }

    show() {
        super.show();

        var page = this.getPage(0);

        while(page.hasChildNodes()) {page.removeChild(page.lastChild);}
        while(this.footer.hasChildNodes()) {this.footer.removeChild(this.footer.lastChild);}

        this.#passwordOverride = createInput_Infield("Password Override", null, "width:90%;box-sizing:border-box;", () => {this.Update();}, page, true, 1);
        this.#passwordOverride[1].type = "password";

        this.#minimumPrice = createInput_Infield("Minimum Price", global_orderMinimum_Price, "width:90%;box-sizing:border-box;", () => {this.Update();}, page, true, 1);
        this.#minimumProfit = createInput_Infield("Minimum Profit", global_orderMinimum_Profit, "width:90%;box-sizing:border-box;", () => {this.Update();}, page, true, 1);
        this.#minimumInstallPrice = createInput_Infield("Minimum Install Price", global_orderMinimum_Price_Install, "width:90%;box-sizing:border-box;", () => {this.Update();}, page, true, 1);
        this.#minimumProfitForInstallJobs = createInput_Infield("Minimum Profit For Install Jobs", global_orderMinimum_Profit_InstallJob, "width:90%;box-sizing:border-box;", () => {this.Update();}, page, true, 1);
        this.#unlockAllErrors = createCheckbox_Infield("Unlock All Errors", false, "width:90%;box-sizing:border-box;", () => {this.unlockAllErrors();}, page);

        this.lockAll();
    }

    Update() {
        if(this.passwordOverride == global_password) {
            this.unlockAll();
        } else {
            this.lockAll();
        }
        updateErrors();
    }

    unlockAll() {
        setFieldDisabled(false, this.#minimumPrice[1], this.#minimumPrice[0]);
        setFieldDisabled(false, this.#minimumProfit[1], this.#minimumProfit[0]);
        setFieldDisabled(false, this.#minimumInstallPrice[1], this.#minimumInstallPrice[0]);
        setFieldDisabled(false, this.#minimumProfitForInstallJobs[1], this.#minimumProfitForInstallJobs[0]);
        setFieldDisabled(false, this.#unlockAllErrors[1], this.#unlockAllErrors[0]);
    }
    lockAll() {
        setFieldDisabled(true, this.#minimumPrice[1], this.#minimumPrice[0]);
        setFieldDisabled(true, this.#minimumProfit[1], this.#minimumProfit[0]);
        setFieldDisabled(true, this.#minimumInstallPrice[1], this.#minimumInstallPrice[0]);
        setFieldDisabled(true, this.#minimumProfitForInstallJobs[1], this.#minimumProfitForInstallJobs[0]);
        setFieldDisabled(true, this.#unlockAllErrors[1], this.#unlockAllErrors[0]);
    }

    unlockAllErrors() {
        $(this.#minimumPrice[1]).val(-10000000).change();
        global_orderMinimum_Price = -10000000;
        $(this.#minimumProfit[1]).val(-10000000).change();
        global_orderMinimum_Profit = -10000000;
        $(this.#minimumInstallPrice[1]).val(-10000000).change();
        global_orderMinimum_Price_Install = -10000000;
        $(this.#minimumProfitForInstallJobs[1]).val(-10000000).change();
        global_orderMinimum_Profit_InstallJob = -10000000;

        updateErrors();
    }

    hide() {
        super.hide();
    }

    tick() {
        this.tickUpdate();
    }

    tickUpdate() { }

    get passwordOverride() {
        return this.#passwordOverride[1].value;
    }
}