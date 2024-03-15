var sleepMS = 300;
var menuXOffset = 160;
var dayHours = 8;
var widthText;
var heightText;
var nameText;
var width;
var height;
var parts;
var products;
var partSqm;
var partCost;
var partCostElement;
var partPrice;
var partPriceElement;
var partNameNumber;
var productNumber;
var productTotalPrice;
var productTotalPricePostDiscounts;
var productTotalCost;
var partNumber;
var partInfo;
var prevPartNumber;
var prevProductNumber;
var SqmPriceGroup;
var PriceGroup;
var totalNumberOfProducts;
var productQty;
var partQty;
var quickSearchInputField;
var quickSearchContainer;
var totalOrderCost = 0;
var totalOrderPrice = 0;
var totalOrderProfit = 0;
var totalOrderInstallCost = 0;
var totalOrderInstallPrice = 0;
var totalOrderInstallProfit = 0;
var installSummary;
var quoteSeconds_CurrentSession = 0;
var quoteSeconds_Stored = 0;
var quoteSeconds_Total = 0;

(function() {
  "use strict";

  createCopyPartModal();
  createCostAnalysisSummaryContainer();
  createOptionsContainer();
  createSummaryHelper();
  installSummary = new InstallSummary();
  initLHSMenu();
  init();
  updateErrors();
  createLog();
  hideLog();
  keyboardTick();

  setInterval(function() {
    tick();
  }, 800);
  setInterval(function() {
    tickSecond();
  }, 1000);
})();

async function init() {
  document.getElementById("ctl00_RibbonsTabs").style = "position:fixed;";
  document.getElementById("MainContent").style = "margin-top:80px;";
  nextStepBtn = document.getElementById("btnGoToOrderStep2");
  nextStepBtn2 = document.getElementById("btnGoToOrderStep3");
  orderStep1Btn = document.getElementById("orderStep1Btn");
  orderStep2Btn = document.getElementById("orderStep2Btn");
  orderStep3Btn = document.getElementById("orderStep3Btn");

  addQuickFindProducts();
  await loadPredefinedQuickProducts();
  await loadPredefinedParts();
  await loadPredefinedModifiers();
  await loadRHSList();
  await loadBaseplateList();
}

function tick() {
  partInfoTick();
  costAnalysisSummaryTick();
  summaryHelperTick();
  installSummary.update();
  consoleTick();
}

function tickSecond() {
  quoteSeconds_CurrentSession++;
}

const event_testing = new Event("testingEvent");
function keyboardTick() {
  $(document.body).keyup(function(e) {
    if(e.keyCode == 188) {
      //var t = new ModalStandoffHelper("Standoff Helper", 100, null);
      console.log(getProductPrice(1));
    }
  });
  $(document).keydown(function(e) {
    if(e.which == 81) {
      window.dispatchEvent(event_testing);
    }
    if(e.which == 87) {
      //test3();
    }
    if(e.which == 69) {
      //test2();
    }
    if(e.which == 82) {
    }
  });
}

