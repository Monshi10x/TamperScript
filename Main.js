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
var totalOrderPricePreGst = 0;
var totalOrderPriceIncGst = 0;
var totalOrderProfit = 0;
var totalOrderInstallCost = 0;
var totalOrderInstallPrice = 0;
var totalOrderInstallProfit = 0;
var installSummary;
var quoteSeconds_CurrentSession = 0;
var quoteSeconds_Stored = 0;
var quoteSeconds_Total = 0;
var saveReminder;


(function() {
  "use strict";

  let head = document.head || document.documentElement;

  var script2 = document.createElement("script");
  script2.textContent = GM_getResourceText("GoogleScript");
  script2.async = true;
  script2.defer = true;
  head.appendChild(script2);


  var script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_MAP_API_KEY + "&loading=async&libraries=maps,places,marker&v=beta&callback=initMap";
  script.async = true;
  script.defer = true;
  head.appendChild(script);

  const myCss = GM_getResourceText("IMPORTED_CSS");
  GM_addStyle(myCss);

  createCopyPartModal();
  createCostAnalysisSummaryContainer();
  createTogglePartsContainer();
  createSummaryHelper();
  installSummary = new InstallSummary();
  saveReminder = new SaveReminder();
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

  let mapDiv = document.createElement("div");
  mapDiv.id = "map";
  document.getElementById("MainContent").appendChild(mapDiv);

  createPartCombinedPrice();
  addQuickFindProducts();
  await loadPredefinedQuickProducts();
  await loadPredefinedParts();
  await loadPredefinedModifiers();
  await loadModifiersData();
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

const quoteReviewEvent = new CustomEvent('quoteReview', {
  detail: {
    foo: 'test',
    value: 123
  },
  bubbles: true,
  cancelable: true
});

function keyboardTick() {
  $(document.body).keyup(function(e) {
    if(e.keyCode == KEYCODE.GRAVE_ACCENT_TILDE) {
      document.dispatchEvent(quoteReviewEvent);
      console.log("dispatched quoteReviewEvent");
    }
    if(e.keyCode == 188) {
      //var t = new ModalStandoffHelper("Standoff Helper", 100, null);
      //console.log(getProductPrice(1));
    }
  });
  $(document).keydown(function(e) {
    if(e.which == 81) {
      //window.dispatchEvent(event_testing);
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
