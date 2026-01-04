//enter_payment or override_payment
var orders_payments_identifier = true;

if(typeof useSlicePaymentForOnline == "undefined") {
      if($("#hfUseSlyce").length > 0) {
            useSlicePaymentForOnline = $("#hfUseSlyce").val().toLowerCase() == "true";
      }
      else {
            useSlicePaymentForOnline = false;
      }
}

var PaymentsMode = "";
var IsPayment = false;
var PaymentIsOnOrdersPage = (($('#OrderStatusLabel').length > 0) || ($('#lblOrderStatus').length > 0));


if(typeof useAPEPaymentForOnline == "undefined") {
      if($("#hfUseAPE").length > 0) {
            useAPEPaymentForOnline = $("#hfUseAPE").val().toLowerCase() == "true";
      }
      else {
            useAPEPaymentForOnline = false;
      }
}


if(typeof useAPEDomain == "undefined" || useAPEDomain == "" || useAPEDomain == null) {
      if($("#hfApeDomain").length > 0) {
            useAPEDomain = $("#hfApeDomain").val();
      }
      else {
            useAPEDomain = "http://localhost:12898";
      }

      if(useAPEDomain == "" || useAPEDomain == null) {
            useAPEDomain = "http://localhost:12898";
      }
}


$(function() {
      if($("#hfUseAPE").length > 0) {
            useAPEPaymentForOnline = $("#hfUseAPE").val().toLowerCase() == "true";
      }
      else {
            useAPEPaymentForOnline = false;
      }

      if($("#hfApeDomain").length > 0) {
            useAPEDomain = $("#hfApeDomain").val();
      }
      else {
            useAPEDomain = "http://localhost:12898";
      }

      if(useAPEDomain == "" || useAPEDomain == null) {
            useAPEDomain = "http://localhost:12898";
      }

});

//Payment History Override Table ----------------------
var PaymentHistoryOverrideTable = null;

// this is the Edit Payments Table
var InitPaymentHistoryOverride_OneTimeAjaxSourced = function() {
      var orderId = $('#hfOrderId').val();
      if(!ValidateVar(orderId))
            orderId = $('[id^=hfOrderId').first();

      if($('#PaymentHistoryOverride').length > 0) {
            PaymentHistoryOverrideTable =
                  $('#PaymentHistoryOverride').dataTable({
                        'bDestroy': true,
                        "bFilter": false,
                        "bInfo": false,
                        "bPaginate": false,
                        "bSort": false,
                        'aoColumnDefs': [
                              {'bSearchable': true, 'aTargets': ['_all']}
                        ],
                        'aoColumns': [
                              {
                                    'mDataProp': 'CreatedDate', sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var returnData = oObj.aData["CreatedDate"];
                                          return returnData.Display;
                                    }
                              },
                              {'mDataProp': 'TypeLong', sClass: "PaymentHistoryStandardField"},
                              {
                                    'mDataProp': 'Amount', sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var returnData = oObj.aData["Amount"];
                                          returnData = formatMoney(returnData);
                                          return returnData;
                                    }
                              },
                              {'mDataProp': 'Notes', sClass: "PaymentHistoryStandardField"},
                              {'mDataProp': 'UpdatedByUserName', sClass: "PaymentHistoryStandardField"},
                              {
                                    'mDataProp': null, sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var parentTransactionId = oObj.aData["ParentTransactionId"];
                                          if(((parentTransactionId == undefined) || (parentTransactionId == ''))) { //&& oObj.aData["Type"] != 'CustomerCredit'
                                                var paymentId = oObj.aData["Id"];
                                                var paymentAmount = oObj.aData["Amount"];
                                                var paymentType = oObj.aData["Type"];
                                                var paymentTypeLong = oObj.aData["TypeLong"];
                                                var paymentCheckNumber = CheckPaymentValues(oObj.aData["CheckNumber"]);
                                                var paymentCheckIdNumber = CheckPaymentValues(oObj.aData["CheckIDNumber"]);
                                                var paymentCardDigits = CheckPaymentValues(oObj.aData["CcLast4Digits"]);
                                                var reconciliationDate = CheckPaymentValues(oObj.aData["ReconciliationDateDisplay"]);
                                                var nameOnCard = op_htmlEscape(CheckPaymentValues(oObj.aData["NameOnCard"]));
                                                var masterTransactionId = oObj.aData["MasterTransactionId"];
                                                var isOnline = oObj.aData["IsOnline"];
                                                var isRefunded = oObj.aData["RefundableAmount"] == 0;
                                                var hasPartialRefund = oObj.aData["HasRefundOnPayment"];
                                                var paymentSubTypeId = oObj.aData["PaymentSubTypeId"];
                                                if(paymentType == 'Imported') {
                                                      return "<a href='#' onclick='#' disabled title='cannot edit Imported payment'>Edit Payment</a>";
                                                } else if(isOnline) { // isonline
                                                      if(isRefunded)
                                                            return "<img class='' src='/Themes/Images/imgSmallQuestion.png' title='Payment has been fully refunded.'/>";
                                                      else if(hasPartialRefund)
                                                            return "<img class='' src='/Themes/Images/imgSmallQuestion.png' title='A refund has been applied against this payment. You cannot edit a payment if a refund is already applied against it.'/>";
                                                      else
                                                            return "<img class='' src='/Themes/Images/imgSmallQuestion.png' title='Cannot edit Online CC Payments. Please use refund.'/>";
                                                } else if(paymentSubTypeId == 3) {
                                                      return "<img class='' src='/Themes/Images/imgSmallQuestion.png' title='Cannot edit Refunds'/>";
                                                } else if(reconciliationDate != '') {
                                                      return "<img class='' src='/Themes/Images/imgSmallQuestion.png' title='Cannot edit reconciled payments.'/>";
                                                } else if(paymentType == 'CustomerCredit') {
                                                      return "<img class='' src='/Themes/Images/imgSmallQuestion.png' title='Cannot edit In-Store Credit payments'/>";
                                                } else {
                                                      if(isRefunded)
                                                            return "<img class='' src='/Themes/Images/imgSmallQuestion.png' title='Payment has been fully refunded.'/>";
                                                      else if(hasPartialRefund)
                                                            return "<img class='' src='/Themes/Images/imgSmallQuestion.png' title='A refund has been applied against this payment. You cannot edit a payment if a refund is already applied against it.'/>";
                                                      else {
                                                            paymentCheckIdNumber = paymentCheckIdNumber.replace(new RegExp("'", 'g'), "`");
                                                            paymentCheckNumber = paymentCheckNumber.replace(/[^\w\s]/gi, ''); // strip all but word and space characters
                                                            paymentCheckNumber = paymentCheckNumber.replace(new RegExp("'", 'g'), "`");
                                                            return "<a href='javascript:void(0);' onclick='javascript:edit_payments.OpenModal(\"" + paymentId + "\",\"" + paymentAmount + "\",\"" + paymentType + "\",\"" + paymentCheckNumber + "\",\"" + paymentCheckIdNumber + "\",\"" + paymentCardDigits + "\",\"" + reconciliationDate + "\",\"" + paymentTypeLong + "\",\"" + nameOnCard + "\",\"" + masterTransactionId + "\");'>Edit Payment</a>";
                                                            //return "<a href='#' onclick='SetOverridePayments(\"" + paymentId + "\",\"" + paymentAmount + "\",\"" + paymentType + "\",\"" + paymentCheckNumber + "\",\"" + paymentCheckIdNumber + "\",\"" + paymentCardDigits + "\",\"" + reconciliationDate + "\",\"" + paymentTypeLong + "\",\"" + nameOnCard + "\",\"" + masterTransactionId + "\");'>Edit Payment</a>";
                                                      }
                                                }
                                          } else {
                                                return "<img class='' src='/Themes/Images/imgSmallQuestion.png' title='This payment is part of a master payment and cannot be edited directly.'/>";
                                          }
                                    }

                              }
                        ],
                        'aaSorting': [[0, 'asc']],
                        'bAutoWidth': false,
                        'sPaginationType': 'full_numbers',
                        'oLanguage': {
                              "sLengthMenu": "",
                              "sInfoEmpty": "",
                              "sInfoFiltered": "",
                              "sInfo": ""
                        },
                        'bLengthChange': false,
                        'iDisplayLength': 20,
                        'sAjaxSource': '/SalesModule/Reports/Reports.asmx/GetOrderPayments2',
                        'sAjaxDataProp': 'ReportResults',
                        'bDeferRender': true,
                        'fnServerData': function(sSource, aoData, fnCallback, oSettings) {
                              aoData.push({name: 'OrderId', value: orderId});
                              aoData.push({name: 'IsPaymentHistoryOverride', value: true});
                              $.ajax({
                                    'type': 'POST',
                                    'url': sSource,
                                    'data': GetSerializedJsonParams(aoData, ['OrderId', 'IsPaymentHistoryOverride']),
                                    'contentType': 'application/json; charset=utf-8',
                                    'dataType': 'json',
                                    'success': function(data, textStatus, xmlHttpRequest) {
                                          fnCallback(data.d);
                                    },
                                    'error': function(jqxhr, textStatus, errorThrown) {
                                          //debugger;
                                          //var x = aoData;
                                          //alert('Error loading report from server: ' + textStatus);
                                          Commonui.Alert('Error loading report from server: ' + textStatus);
                                    }
                              });
                        }
                  });
      }

};

//Payment History Override Table ----------------------
var RefundHistoryOverrideTable = null;

// this is the Edit Payments Table
var InitRefundHistoryOverride_OneTimeAjaxSourced = function() {
      var orderId = $('#hfOrderId').val();
      if(!ValidateVar(orderId))
            orderId = $('[id^=hfOrderId').first();

      if($('#RefundHistoryOverride').length > 0) {
            RefundHistoryOverrideTable =
                  $('#RefundHistoryOverride').dataTable({
                        'bDestroy': true,
                        "bFilter": false,
                        "bInfo": false,
                        "bPaginate": false,
                        "bSort": false,
                        'aoColumnDefs': [
                              {'bSearchable': true, 'aTargets': ['_all']}
                        ],
                        'aoColumns': [
                              {
                                    'mDataProp': 'CreatedDate', sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var returnData = oObj.aData["CreatedDate"];
                                          return returnData.Display;
                                    }
                              },
                              {'mDataProp': 'TypeLong', sClass: "PaymentHistoryStandardField"},
                              {
                                    'mDataProp': 'Amount', sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var returnData = oObj.aData["Amount"];
                                          returnData = formatMoney(returnData);
                                          return returnData;
                                    }
                              },
                              {'mDataProp': 'Notes', sClass: "PaymentHistoryStandardField"},
                              {'mDataProp': 'UpdatedByUserName', sClass: "PaymentHistoryStandardField"},
                              {
                                    'mDataProp': null, sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var parentTransactionId = oObj.aData["ParentTransactionId"];
                                          if(((parentTransactionId == undefined) || (parentTransactionId == ''))) { //&& oObj.aData["Type"] != 'CustomerCredit'
                                                var paymentId = oObj.aData["Id"];
                                                var paymentAmount = oObj.aData["Amount"];
                                                var paymentType = oObj.aData["Type"];
                                                var paymentTypeLong = oObj.aData["TypeLong"];
                                                var paymentCheckNumber = CheckPaymentValues(oObj.aData["CheckNumber"]);
                                                var paymentCheckIdNumber = CheckPaymentValues(oObj.aData["CheckIDNumber"]);
                                                var paymentCardDigits = CheckPaymentValues(oObj.aData["CcLast4Digits"]);
                                                var reconciliationDate = CheckPaymentValues(oObj.aData["ReconciliationDateDisplay"]);
                                                var nameOnCard = op_htmlEscape(CheckPaymentValues(oObj.aData["NameOnCard"]));
                                                var masterTransactionId = oObj.aData["MasterTransactionId"];
                                                var isOnline = oObj.aData["IsOnline"];
                                                var isRefunded = oObj.aData["RefundableAmount"] == 0 ? true : false;
                                                var paymentSubTypeId = oObj.aData["PaymentSubTypeId"];

                                                if(paymentType == 'Imported') {
                                                      return "<img class='' src='/Themes/Images/imgSmallQuestion.png' title='Cannot edit Imported payment.'/>";
                                                } else if(reconciliationDate != '') {
                                                      return "<img class='' src='/Themes/Images/imgSmallQuestion.png' title='Cannot edit reconciled transactions.'/>";
                                                } else if(paymentSubTypeId == 3) {
                                                      return "<a href='javascript:void(0);' onclick='javascript:edit_refunds.OpenModal(\"" + paymentId + "\",\"" + paymentAmount + "\",\"" + paymentType + "\",\"" + paymentCheckNumber + "\",\"" + paymentCheckIdNumber + "\",\"" + paymentCardDigits + "\",\"" + reconciliationDate + "\",\"" + paymentTypeLong + "\",\"" + nameOnCard + "\",\"" + masterTransactionId + "\");'>Edit Refund</a>";
                                                }
                                          } else {
                                                return "<img class='' src='/Themes/Images/imgSmallQuestion.png' title='This payment is part of a master payment and cannot be editing directly.'/>";
                                          }
                                    }

                              }
                        ],
                        'aaSorting': [[0, 'asc']],
                        'bAutoWidth': false,
                        'sPaginationType': 'full_numbers',
                        'oLanguage': {
                              "sLengthMenu": "",
                              "sInfoEmpty": "",
                              "sInfoFiltered": "",
                              "sInfo": ""
                        },
                        'bLengthChange': false,
                        'iDisplayLength': 20,
                        'sAjaxSource': '/SalesModule/Reports/Reports.asmx/GetOrderRefunds',
                        'sAjaxDataProp': 'ReportResults',
                        'bDeferRender': true,
                        'fnServerData': function(sSource, aoData, fnCallback, oSettings) {
                              aoData.push({name: 'OrderId', value: orderId});
                              aoData.push({name: 'IsPaymentHistoryOverride', value: true});
                              $.ajax({
                                    'type': 'POST',
                                    'url': sSource,
                                    'data': GetSerializedJsonParams(aoData, ['OrderId', 'IsPaymentHistoryOverride']),
                                    'contentType': 'application/json; charset=utf-8',
                                    'dataType': 'json',
                                    'success': function(data, textStatus, xmlHttpRequest) {
                                          fnCallback(data.d);
                                    },
                                    'error': function(jqxhr, textStatus, errorThrown) {
                                          alert('Error loading report from server: ' + textStatus);
                                    }
                              });
                        }
                  });
      }

};





//Payment History Override Table ----------------------
var tblRefundPayment = null;

// this is the Edit Payments Table
var InitRefundPaymentsTable_OneTimeAjaxSourced = function() {

      var orderId = $('#hfOrderId').val();
      if(!ValidateVar(orderId))
            var orderId = $('[id^=hfOrderId').first();

      if($('#tblRefundPayments').length > 0) {
            tblRefundPayment =
                  $('#tblRefundPayments').dataTable({
                        'bDestroy': true,
                        "bFilter": false,
                        "bInfo": false,
                        "bPaginate": false,
                        "bSort": false,
                        'aoColumnDefs': [
                              {'bSearchable': true, 'aTargets': ['_all']}
                        ],
                        'aoColumns': [
                              {
                                    'mDataProp': 'CreatedDate', sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var returnData = oObj.aData["CreatedDate"];
                                          return returnData.Display;
                                    }
                              },
                              {'mDataProp': 'TypeLong', sClass: "PaymentHistoryStandardField"},
                              {
                                    'mDataProp': 'Amount', sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var returnData = oObj.aData["Amount"];
                                          returnData = formatMoney(returnData);
                                          return returnData;
                                    }
                              },
                              {'mDataProp': 'Notes', sClass: "PaymentHistoryStandardField"},
                              {'mDataProp': 'UpdatedByUserName', sClass: "PaymentHistoryStandardField"},
                              {
                                    'mDataProp': null, sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var parentTransactionId = oObj.aData["ParentTransactionId"];
                                          if((parentTransactionId == undefined) || (parentTransactionId == '')) {
                                                var paymentId = oObj.aData["Id"];
                                                var paymentAmount = oObj.aData["Amount"];
                                                var paymentType = oObj.aData["Type"];
                                                var paymentTypeLong = oObj.aData["TypeLong"];
                                                var paymentCheckNumber = CheckPaymentValues(oObj.aData["CheckNumber"]);
                                                var paymentCheckIdNumber = CheckPaymentValues(oObj.aData["CheckIDNumber"]);
                                                var paymentCardDigits = CheckPaymentValues(oObj.aData["CcLast4Digits"]);
                                                var reconciliationDate = CheckPaymentValues(oObj.aData["ReconciliationDateDisplay"]);
                                                var nameOnCard = op_htmlEscape(CheckPaymentValues(oObj.aData["NameOnCard"]));
                                                var masterTransactionId = oObj.aData["MasterTransactionId"];
                                                var isOnline = oObj.aData["IsOnline"];

                                                if(paymentType == 'Imported') {
                                                      return "<a href='#' onclick='#' disabled title='cannot edit Imported payment'>Refund Payment</a>";
                                                }
                                                else {
                                                      return "<a href='#' onclick='SetRefundPayments(\"" + paymentId + "\",\"" + paymentAmount + "\",\"" + paymentType + "\",\"" + paymentCheckNumber + "\",\"" + paymentCheckIdNumber + "\",\"" + paymentCardDigits + "\",\"" + reconciliationDate + "\",\"" + paymentTypeLong + "\",\"" + nameOnCard + "\",\"" + masterTransactionId + "\");'>Refund Payment</a>";
                                                }
                                          }
                                          else {
                                                return "";
                                          }
                                    }

                              }
                        ],
                        'aaSorting': [[0, 'asc']],
                        'bAutoWidth': false,
                        'sPaginationType': 'full_numbers',
                        'oLanguage': {
                              "sLengthMenu": "",
                              "sInfoEmpty": "",
                              "sInfoFiltered": "",
                              "sInfo": ""
                        },
                        'bLengthChange': false,
                        'iDisplayLength': 20,
                        'sAjaxSource': '/SalesModule/Reports/Reports.asmx/GetOrderPaymentsForPaymentRefund',
                        'sAjaxDataProp': 'ReportResults',
                        'bDeferRender': true,
                        'fnServerData': function(sSource, aoData, fnCallback, oSettings) {
                              aoData.push({name: 'OrderId', value: orderId});
                              $.ajax({
                                    'type': 'POST',
                                    'url': sSource,
                                    'data': GetSerializedJsonParams(aoData, ['OrderId']),
                                    'contentType': 'application/json; charset=utf-8',
                                    'dataType': 'json',
                                    'success': function(data, textStatus, xmlHttpRequest) {
                                          fnCallback(data.d);
                                    },
                                    'error': function(jqxhr, textStatus, errorThrown) {
                                          alert('Error loading report from server: ' + textStatus);
                                    }
                              });
                        }
                  });
      }

};

function SetRefundPayments(paymentId, paymentAmount, paymentType, paymentCheckNumber, paymentCheckIdNumber, paymentCardDigits, reconciliationDate, typeLong, nameOnCard, masterTransactionId) {
      if(masterTransactionId != '' && masterTransactionId != "null") {
            $("#hfMasterTxnId").val(masterTransactionId);
      }
      else {
            $("#hfMasterTxnId").val('');
      }

      var paymentHasBeenReconciled = false;

      if(reconciliationDate == null || reconciliationDate == '') {
            $("#hfIsReconciled").val("0");
            paymentHasBeenReconciled = false;
      }
      else {
            $("#hfIsReconciled").val("1");
            paymentHasBeenReconciled = true;
            $('#hfReconciliationDate').val(reconciliationDate);
      }

      // Overridding a payment on the Order.aspx page
      PaymentsMode = "override_payment";

      paymentAmount = parseStringToFloat(paymentAmount);
      $('#modalAddOrderPayment').modal({positoin: ["12%"]});
      $('#modalAddOrderPayment').draggable({handle: '.modal-drag'});

      if(typeof Commonui !== 'undefined') {
            Commonui.RegisterModalMediaResponsive($('"#simplemodal-container:has(#modalAddOrderPayment)"').filter(':visible'), 'payment-modal-op-1');
      }

      $("#spnOrderPaymentTitle").text("Refund Payment");
      if(typeof OrderPaymentSlice != 'undefined') {
            OrderPaymentSlice.SetModal();
      }
      SetPaymentTypeDropDown(paymentType, typeLong);
      TrySetCardTypeDropDowns(paymentType);

      // this sets UI state based on paymenttypeDropDown setting
      getPaymentType(paymentHasBeenReconciled);

      $("#txtPreviousTotalPaymentAmount").val(formatMoney(paymentAmount));
      $("#txtTotalPaymentAmount").prop("readonly", "true");
      $("#spnOrderPaymentAmountLabel").text("Difference: ");
      $("#spnOrderPaymentNotesLabel").text("Reason For Refunding: ");
      $("#spnOrderPaymentButtonLabel").text("Refund Payment");
      $("#pnlOrderPaymentOverride").show();
      $("#txtNewTotalPaymentAmount").val(formatMoney(paymentAmount));
      $("#txtCheckNum").val(paymentCheckNumber);
      $("#txtCheckId").val(paymentCheckIdNumber);
      $("#txtOfflineCcLast4Digits").val(paymentCardDigits);
      $("#txtOfflineCcNameOnCard").val(nameOnCard);
      $("#txtOnlineCcNameOnCard").val(nameOnCard);

      $("#hfPaymentTransactionId").val(paymentId);
      $("#hfMasterTxnId").val(masterTransactionId);
      $("#hfPaymentSubTypeId").val('3'); //CbPaymentSubTypeEnum 3 - Refund

      $("#txtTotalPayment").attr("disabled", "disabled");
      $("#txtNewTotalPaymentAmount").val(0);
      $("#txtNewTotalPaymentAmount").attr("disabled", "disabled");;

      if(paymentHasBeenReconciled) {
            $("#txtCheckNum").attr("disabled", "disabled");
            $("#txtCheckId").attr("disabled", "disabled");
            $("#ddOfflineCcType").attr("disabled", "disabled");
            $("#txtOfflineCcNameOnCard").attr("disabled", "disabled");
            $("#txtOfflineCcLast4Digits").attr("disabled", "disabled");
            $("#ddOnlineCcType").attr("disabled", "disabled");
            $("#txtOnlineCcNameOnCard").attr("disabled", "disabled");
            $("#txtOnlineCcLast4Digits").attr("disabled", "disabled");
            $("#ddPaymentType").attr("disabled", "disabled");
      }
      else {
            $("#ddPaymentType").removeAttr("disabled");
            $("#txtCheckNum").removeAttr("disabled");
            $("#txtCheckId").removeAttr("disabled");
            $("#ddOfflineCcType").removeAttr("disabled");
            $("#txtOfflineCcNameOnCard").removeAttr("disabled");
            $("#txtOfflineCcLast4Digits").removeAttr("disabled");
            $("#ddOnlineCcType").removeAttr("disabled");
            $("#txtOnlineCcNameOnCard").removeAttr("disabled");
            $("#txtOnlineCcLast4Digits").removeAttr("disabled");
      }


      // calculated payment difference and sets payment amount
      // if paymentHasBeenReconciled then paymentamount is == difference since an adjustment will be created
      // otherwise the amount will just be the total amount since the payment will just be edited/changed

      CalculateOrderPaymentDifference();

      _accountId = (typeof _accountId === 'undefined') ? $('#hfOrdAccountId').val() : _accountId;
      if(_accountId > 0) {
            RefreshInStoreAvailableCredit(_accountId);
      }
}


function SetOverridePayments(paymentId, paymentAmount, paymentType, paymentCheckNumber, paymentCheckIdNumber, paymentCardDigits, reconciliationDate, typeLong, nameOnCard, masterTransactionId) {

      if(masterTransactionId != '' && masterTransactionId != "null") {
            $("#hfMasterTxnId").val(masterTransactionId);
      }
      else {
            $("#hfMasterTxnId").val('');
      }

      var paymentHasBeenReconciled = false;

      if(reconciliationDate == null || reconciliationDate == '') {
            $("#hfIsReconciled").val("0");
            paymentHasBeenReconciled = false;
      }
      else {
            $("#hfIsReconciled").val("1");
            paymentHasBeenReconciled = true;
            $('#hfReconciliationDate').val(reconciliationDate);
      }

      // Overridding a payment on the Order.aspx page
      PaymentsMode = "override_payment";

      paymentAmount = parseStringToFloat(paymentAmount);

      $('#modalAddOrderPayment').modal({position: ["12%"]});
      $('#modalAddOrderPayment').draggable({handle: '.modal-drag'});
      $("#spnOrderPaymentTitle").text("Override Payment");
      if(typeof Commonui !== 'undefined') {
            Commonui.RegisterModalMediaResponsive($('"#simplemodal-container:has(#modalAddOrderPayment)"').filter(':visible'), 'payment-modal-op-2');
      }
      if(typeof OrderPaymentSlice != 'undefined') {
            OrderPaymentSlice.SetModal();
      }
      //disable ENTER key 
      //    $('input,select').keypress(function (e) {
      //        if (e.which == 13) // Enter key = keycode 13
      //        { 
      //            return false;
      //        }
      //    });


      SetPaymentTypeDropDown(paymentType, typeLong);
      TrySetCardTypeDropDowns(paymentType);

      // this sets UI state based on paymenttypeDropDown setting
      getPaymentType(paymentHasBeenReconciled);

      $("#txtPreviousTotalPaymentAmount").val(formatMoney(paymentAmount));
      $("#txtTotalPaymentAmount").prop("readonly", "true");
      $("#txtTotalPaymentAmount").css({"border": "0px", "padding-left": "0px"});

      $("#spnOrderPaymentAmountLabel").text("Difference: ");
      $("#spnOrderPaymentAmountLabel").css("margin-left", "180px");

      $("#spnOrderPaymentNotesLabel").text("Reason for Overriding: ");
      $("#spnOrderPaymentButtonLabel").text("Adjust Payment");
      $("#pnlOrderPaymentOverride").show();
      $("#txtNewTotalPaymentAmount").val(formatMoney(paymentAmount));
      $("#txtCheckNum").val(paymentCheckNumber);
      $("#txtCheckId").val(paymentCheckIdNumber);
      $("#txtOfflineCcLast4Digits").val(paymentCardDigits);
      $("#txtOfflineCcNameOnCard").val(nameOnCard);
      $("#txtOnlineCcNameOnCard").val(nameOnCard);

      $("#hfPaymentTransactionId").val(paymentId);
      $("#hfMasterTxnId").val(masterTransactionId);
      $("#hfPaymentSubTypeId").val('2'); //CbPaymentSubTypeEnum 2 - Edit

      if(paymentHasBeenReconciled) {
            $("#txtCheckNum").attr("disabled", "disabled");
            $("#txtCheckId").attr("disabled", "disabled");
            $("#ddOfflineCcType").attr("disabled", "disabled");
            $("#txtOfflineCcNameOnCard").attr("disabled", "disabled");
            $("#txtOfflineCcLast4Digits").attr("disabled", "disabled");
            $("#ddOnlineCcType").attr("disabled", "disabled");
            $("#txtOnlineCcNameOnCard").attr("disabled", "disabled");
            $("#txtOnlineCcLast4Digits").attr("disabled", "disabled");
            $("#ddPaymentType").attr("disabled", "disabled");
      }
      else {
            $("#ddPaymentType").removeAttr("disabled");
            $("#txtCheckNum").removeAttr("disabled");
            $("#txtCheckId").removeAttr("disabled");
            $("#ddOfflineCcType").removeAttr("disabled");
            $("#txtOfflineCcNameOnCard").removeAttr("disabled");
            $("#txtOfflineCcLast4Digits").removeAttr("disabled");
            $("#ddOnlineCcType").removeAttr("disabled");
            $("#txtOnlineCcNameOnCard").removeAttr("disabled");
            $("#txtOnlineCcLast4Digits").removeAttr("disabled");
      }


      // calculated payment difference and sets payment amount
      // if paymentHasBeenReconciled then paymentamount is == difference since an adjustment will be created
      // otherwise the amount will just be the total amount since the payment will just be edited/changed

      CalculateOrderPaymentDifference();

      _accountId = (typeof _accountId === 'undefined') ? $('#hfOrdAccountId').val() : _accountId;
      if(_accountId > 0) {
            RefreshInStoreAvailableCredit(_accountId);
      }
}

function TrySetCardTypeDropDowns(cardType) {
      $("#ddOfflineCcType").val(cardType);
      $("#ddOnlineCcType").val(cardType);
}

function SetPaymentTypeDropDown(paymentType, typeLong) {

      var paymentTypeText = paymentType;
      //OnlineCc
      if(typeLong != null && typeLong != '' && typeLong.indexOf("Online") !== -1) {
            paymentTypeText = "OnlineCc";
      }

      //OfflineCc
      if(typeLong != null && typeLong != '' && typeLong.indexOf("Offline") !== -1) {
            paymentTypeText = "OfflineCc";
      }

      $("#ddPaymentType").val(paymentTypeText);
}

function CheckPaymentValues(paymentValue) {
      if(paymentValue == null) {
            return "";
      }
      return paymentValue;
}

function CalculateOrderPaymentDifference() {
      var useDifference = parseInt($("#hfIsReconciled").val());
      var paymentAmount = parseStringToFloat($("#txtPreviousTotalPaymentAmount").val());
      var newPaymentAmount = parseStringToFloat($("#txtNewTotalPaymentAmount").val());
      //var difference = newPaymentAmount - paymentAmount;
      var difference = Decimal.sub(newPaymentAmount, paymentAmount).toNumber();
      difference = formatMoney(difference);

      $("#txtTotalPaymentAmount").val(difference);

}

function parseStringToFloat(valueString) {
      valueString += '';
      valueString = valueString.replace(/\,/g, '');

      var returnValue = parseFloat(CleanAmount(valueString));
      if(isNaN(returnValue)) {
            return 0;
      }

      return returnValue;
}

//Payment History Table -------------------------------

var PaymentHistoryTable = null;

var InitPaymentHistory_OneTimeAjaxSourced = function() {

      if($('#PaymentHistory').length > 0) {
            var totalPayment = 0;
            var orderId = $('#hfOrderId').val();
            if(!ValidateVar(orderId))
                  orderId = $('[id^=hfOrderId').first();

            PaymentHistoryTable =
                  $('#PaymentHistory').dataTable({
                        'bDestroy': true,
                        "bFilter": false,
                        "bInfo": false,
                        "bPaginate": false,
                        "bSort": false,
                        'aoColumnDefs': [
                              {'bSearchable': true, 'aTargets': ['_all']}
                        ],
                        'aoColumns': [
                              {
                                    'mDataProp': 'CreatedDate', sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var returnData = oObj.aData["CreatedDate"];

                                          if(typeof OrderProperties !== 'undefined' && OrderProperties.EnableCustomPaymentDate) {
                                                var customDate = oObj.aData["CustomPaymentDate"];
                                                var btn = `<span class="btn-custom-payment-date" id="btnCustomDate_${oObj.aData["Id"]}">${customDate == null ? 'custom' : customDate.Display}</span>`; //`<i class="fa fa-edit btn-custom-payment-date" id="btnCustomDate_${oObj.aData["Id"]}"></i>`;
                                                var input = `<input type="text" id="txtCustomDate_${oObj.aData["Id"]}" class="txt-custom-payment-date hide datepicker" value="${customDate == null ? '' : customDate.Display}" />`;

                                                var html = `<div>${returnData.Display}</div><div style="white-space: nowrap">${input}${btn}</div>`;
                                                return html;
                                          }

                                          return returnData.Display;
                                    }
                              },
                              {'mDataProp': 'PaymentInteropId', sClass: "PaymentHistoryStandardField"},
                              {
                                    'mDataProp': function(source, type, val) {
                                          var display = source["TypeLong"];
                                          var notes = source["Notes"];

                                          if(!notes) {
                                                notes = "";
                                          }

                                          if(notes.toLowerCase().indexOf("echeck (online)") >= 0) {
                                                display = "eCheck (Online)";
                                          }

                                          return display;
                                    }, sClass: "PaymentHistoryStandardField"
                              },
                              {
                                    'mDataProp': function(source, type, val) {
                                          var display = source["Type"];
                                          let isOnline = source["IsOnline"];

                                          switch(display.toLowerCase()) {
                                                case "check":
                                                      //CB2-3491 - do not show "null" text on empty check id number in payment history view
                                                      if(source["CheckIDNumber"] == null) {
                                                            display = source["CheckNumber"];
                                                      }
                                                      else {
                                                            display = source["CheckNumber"] + " <br /> " + source["CheckIDNumber"];
                                                      }
                                                      break;
                                                case "discover":
                                                case "mastercard":
                                                case "visa":
                                                case "amex":
                                                case "creditcard":
                                                      display = source["CcLast4Digits"]; // [Transaction].[TransactionData1]

                                                      if(display == "") {
                                                            display = source["GatewayTransactionNumber"];
                                                      }

                                                      if(!isOnline) {
                                                            let nameOnCard = source["NameOnCard"];
                                                            let dash = "";
                                                            if(display == null || !display) {
                                                                  display = "";
                                                            }

                                                            if(nameOnCard == null || !nameOnCard) {
                                                                  nameOnCard = "";
                                                            }


                                                            if(display != "" && nameOnCard != "") {

                                                                  dash = " - ";
                                                            }

                                                            display = display + dash + nameOnCard;
                                                      }

                                                      break;

                                                case "cash":
                                                case "ach":
                                                      display = source["PayProcessingRefNumber"];

                                                      break;
                                                case "other":
                                                      display = source["TransactionData3"]; // [Transaction].[TransactionData3]
                                                      break;
                                                case "wire":
                                                case "customercredit": // in-store credit
                                                default:
                                                      display = "";
                                                      break;
                                          }
                                          return display;
                                    },
                                    sClass: "PaymentHistoryStandardField HoverHiddenOverflow HoverHiddenOverflowFix"
                              },
                              {
                                    'mDataProp': 'Amount', sClass: "PaymentHistoryStandardField HoverHiddenOverflowFix2",
                                    'fnRender': function(oObj) {
                                          var returnData = oObj.aData["Amount"];
                                          totalPayment += parseStringToFloat(returnData);
                                          returnData = ToCurrency(returnData, 2, true);

                                          var transactionFeeFeeValue = oObj.aData["TransactionFeeFeeValue"];

                                          if(transactionFeeFeeValue > 0) {
                                                returnFeeData = transactionFeeFeeValue;
                                                //var totalFeePayment += parseStringToFloat(returnData);
                                                returnFeeData = ToCurrency(returnFeeData, 2, true);

                                                var html = `<div>${returnData}</div><div style="white-space: nowrap"><span style="color: #669900;">${returnFeeData}</span></div>`;

                                                return html;
                                          }
                                          else {
                                                return returnData;
                                          }

                                    }
                              },
                              {'mDataProp': 'Notes', sClass: "PaymentHistoryStandardField"},
                              {'mDataProp': 'UpdatedByUserName', sClass: "PaymentHistoryStandardField"},
                              {
                                    "sClass": "PaymentHistoryStandardField",
                                    "mDataProp": function(source, type, val) {
                                          var tehs = source["TransactionEditHistories"];
                                          var tpl_th = '<span class="sectionTitle">Edit History</span><br /><table class="editHistory"><tr><th>Date</th><th>Type</th><th>Amount</th><th>Notes</th><th>User</th></tr>{0}</table>';
                                          var tpl_tr = '<tr><td style="text-align:center;">{0}</td><td style="text-align:center;">{1}</td><td style="text-align:center;">{2}</td><td>{3}</td><td style="text-align:center;">{4}</td></tr>';
                                          var tpl_item = '<span id="paytrans{0}" class="help">{1}</span><div id="data_paytrans{0}" style="display:none;">{2}</div>';

                                          var trs = '';
                                          for(var i = 0; i < tehs.length; i++) {
                                                trs += tpl_tr.format((new Date(parseInt(tehs[i].EditDate.LocalDateTime.substr(6)))).format("MM/dd/yyyy hh:mm:ss tt"),
                                                      tehs[i].TransactionEditTypeEnumText, ToCurrency(tehs[i].Amount, 2, true), tehs[i].Notes, tehs[i].EditedByUserName);
                                          }

                                          var help = tpl_th.format(trs);
                                          var id = source["Id"];
                                          if(tehs.length > 0) {
                                                return tpl_item.format(id, '<img src="/Themes/Images/icon-view.png" alt="edit history" />', help);
                                          } else {
                                                return '<span title="no edit history" style="cursor:help">&nbsp;</span>';
                                          }
                                    }
                              }
                        ],
                        "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                              $('td:nth-child(7)', nRow).attr('style', 'border-right:none;');
                              // $('td:nth-child(4)', nRow).attr('style', 'text-align:center;');
                        },
                        'aaSorting': [[0, 'asc']],
                        'bAutoWidth': false,
                        'sPaginationType': 'full_numbers',
                        'oLanguage': {
                              "sLengthMenu": "",
                              "sInfoEmpty": "",
                              "sInfoFiltered": "",
                              "sInfo": ""
                        },
                        'bLengthChange': false,
                        'iDisplayLength': 20,
                        'sAjaxSource': '/SalesModule/Reports/Reports.asmx/GetOrderPayments',
                        'sAjaxDataProp': 'ReportResults',
                        'bDeferRender': true,
                        'fnServerData': function(sSource, aoData, fnCallback, oSettings) {
                              aoData.push({name: 'OrderId', value: orderId});
                              $.ajax({
                                    'type': 'POST',
                                    'url': sSource,
                                    'data': GetSerializedJsonParams(aoData, ['OrderId']),
                                    'contentType': 'application/json; charset=utf-8',
                                    'dataType': 'json',
                                    'async': false,
                                    'success': function(data, textStatus, xmlHttpRequest) {
                                          fnCallback(data.d);
                                          $("#lblTotalPayedHistory").text(ToCurrency(totalPayment, 2, true));
                                          $(".help").tooltip({width: '700px'});
                                          customPaymentDate.initialize();
                                    },
                                    'error': function(jqxhr, textStatus, errorThrown) {
                                          alert('Error loading report from server: ' + textStatus);
                                    }
                              });
                        }
                  });
      }
};

function formatMoney(amount) {
      var value = parseStringToFloat(amount);
      var formattedValue = jQuery().number_format(value, {
            numberOfDecimals: 2,
            decimalSeparator: '.',
            thousandSeparator: ','
      });
      return formattedValue;
}

//Payments --------------------------------------

var cardParsed = false;

function SetupCreditCardSwipe() {
      $("#txtCreditCardCardNumber").change(function() {TryReadingInput($(this).val());});
      $('#txtCreditCardCardNumber').focus(function() {
            $('#alertStartHere').fadeOut('slow');
            $('#divScanOrEnterCardPrompt').fadeIn('slow');
      });
      $('#txtCreditCardCardNumber').keypress(function() {$('#divScanOrEnterCardPrompt').hide();});
}

function DisableEnterForCcSwipe() {
      // disable 'enter' key on modal
      $('html').bind('keypress', function(e) {
            if(e.keyCode == 13) {
                  if($("#txtCreditCardCardNumber").val() != '') {
                        $('#txtCreditCardCVC').focus();
                        return false;
                  }
            }
      });
}

function TryReadingInput(string) {
      if(string.substring(0, 2) == "%B" || string.substring(19, 21) == "B%") {

            var isEncrypted = string.substring(19, 21) == "B%";

            if(isEncrypted) {
                  $('#hfMagstripeData').val(string);
            }

            string = string.replace('%B', '');
            var arr = string.split('^');
            if(arr[0].length > 2) {

                  if(isEncrypted) {
                        var card = arr[0].split('B%*');
                        $('#txtCreditCardCardNumber').val(card[card.length - 1]);
                  }
                  else {
                        $('#txtCreditCardCardNumber').val(arr[0]);
                  }

                  $('#ddCreditCardExpirationMonth').val(arr[2].substring(2, 4));
                  $('#ddCreditCardExpirationYear').val('20' + arr[2].substring(0, 2));
                  var nameArr = arr[1].split('/');
                  $('#txtCreditCardNameOnCard').val(nameArr[1] + ' ' + nameArr[0]);
                  SetCreditCardType(arr[0].substring(0, 1));
            }
            cardParsed = true;
            // return false;
      }
      else {
            $('#hfMagstripeData').val("");
      }
      SetCreditCardType(string.substring(0, 1)); // for manual CC# entry
      $('#txtCreditCardCVC').focus();
}

function ValidatePaySubmit() {
      if(cardParsed) {
            cardParsed = false;
            $('#txtCreditCardCVC').focus();
            return false;
      }
      return true;
}

function SetCreditCardType(ccnum) {
      switch(ccnum) {
            case "4": $('#ddCreditCardCardType').val('Visa'); break;
            case "5": $('#ddCreditCardCardType').val('MasterCard'); break;
            case "6": $('#ddCreditCardCardType').val('Discover'); break;
            case "7": $('#ddCreditCardCardType').val('AMEX'); break;
            case "3": $('#ddCreditCardCardType').val('AMEX'); break;
      }
}

function SetCreditCardTypeByName(ccnum) {
      ccnum = ccnum.toLowerCase();

      switch(ccnum) {
            case "visa": $('#ddCreditCardCardType').val('Visa'); break;
            case "mastercard": $('#ddCreditCardCardType').val('MasterCard'); break;
            case "discover": $('#ddCreditCardCardType').val('Discover'); break;
            case "amex": $('#ddCreditCardCardType').val('AMEX'); break;
            case "american express": $('#ddCreditCardCardType').val('AMEX'); break;
      }
}

function SetupManualCcEntryDiv() {
      jQuery('#tblManualOnlineCcEntry').css('display', 'block');
      $('#txtCreditCardCardNumber').focus();
}

function RegisterStoredCardChangeEvent(sender, args) {
      jQuery('input[name="storedCard"]:radio').change(function() {

            var selectedTokenValue = $('input[name="storedCard"]:checked').val();
            var selectedPaymentType = $('input[name="storedCard"]:checked').attr("paymenttype");
            // this is the manual case
            if(selectedTokenValue == '-1') {
                  jQuery('#divSelectStoredPayment').css('display', 'none');
                  jQuery('#tblManualOnlineCcEntry').css('display', 'block');
                  $('#txtCreditCardCardNumber').focus();
            }
            else {
                  jQuery('#hfOnlineCcPaymentToken').val(selectedTokenValue);
                  SetCreditCardTypeByName(selectedPaymentType);
            }
      });
}

function calculateChangeDue() {
      var diff = $('#txtCashReceived').val() - $('#txtTotalPaymentAmount').val();
      if($('#txtCashReceived').val() <= 0) {$('#txtChange').val(0);}
      else {
            $('#txtChange').val(diff.toFixed(2));
      }
}

function getPaymentType() {
      //var dropDown = document.getElementById('PaymentTypeDrowDown');
      //var selection = dropDown.options[dropDown.selectedIndex].value;

      $('#txtTotalPaymentAmount').unbind('keyup'); // reset any bound triggers on the field
      RebindPostOrderPaymentButton();

      if($("#hfIsReconciled").val() == "1") {
            $("#pnlReconciledMessage").show();
      }
      else {
            $("#pnlReconciledMessage").hide();
      }

      $("#spnGenericMessage").html("");
      $("#spnGenericMessage").hide();
      $("#pnlOrderPayment_Buttons").show();
      $("#hlPostOrderTransaction").removeAttr("disabled");
      $('#pnlOrderPayment_Cash').hide();

      SetupPaymentTypeSpecificValidation();

      if(useAPEPaymentForOnline) {
            OrderPaymentAPE.Init($("#pnlOrderPayment_CreditCardOnline"));

            OrderPaymentAPEV2.Init($("#pnlOrderPayment_CreditCardOnline"));

      }
      else if(useSlicePaymentForOnline) {
            OrderPaymentSlice.Init($("#pnlOrderPayment_CreditCardOnline"));
      }

      var selection = jQuery(".clsPaymentTypeDropDown").val();

      OrderPaymentAPE.PaymentType = selection;
      OrderPaymentAPEV2.PaymentType = selection;

      if(selection === "Cash") {
            document.getElementById('pnlOrderPayment_TopAll').style.display = "block";
            document.getElementById('pnlOrderPayment_BottomAll').style.display = "block";
            document.getElementById('pnlOrderPayment_Check').style.display = "none";
            document.getElementById('pnlOrderPayment_CreditCardOnline').style.display = "none";
            document.getElementById('pnlOrderPayment_CreditCardOffline').style.display = "none";
            document.getElementById('pnlOrderPayment_CustomerCredit').style.display = "none";
            document.getElementById('pnlOrderPayment_Buttons').style.display = "block";
            document.getElementById('pnlOrderPayment_EFT').style.display = "none";
            document.getElementById('pnlOrderPayment_Other').style.display = "none";
            $("#hlPostOrderTransaction").removeAttr("disabled");

            if(
                  ($("#spnOrderPaymentTitle").text() != "Override Payment")
                  && ($("#spnOrderPaymentTitle").text() != "Refund Payment")
                  && ($("#spnOrderPaymentTitle").text() != "Refund In-Store Credit")
            ) {
                  $('#pnlOrderPayment_Cash').show();
                  //$('.circleNumber:contains("3")').parent().parent().hide();
            }

            $('#txtCashReceived').keyup(function() {
                  calculateChangeDue();
            });
            HideInStoreCreditValidation();
      }
      else if(selection === "Check") {
            document.getElementById('pnlOrderPayment_TopAll').style.display = "block";
            document.getElementById('pnlOrderPayment_BottomAll').style.display = "block";
            document.getElementById('pnlOrderPayment_Check').style.display = "block";
            document.getElementById('pnlOrderPayment_CreditCardOnline').style.display = "none";
            document.getElementById('pnlOrderPayment_CreditCardOffline').style.display = "none";
            document.getElementById('pnlOrderPayment_CustomerCredit').style.display = "none";
            document.getElementById('pnlOrderPayment_Buttons').style.display = "block";
            document.getElementById('pnlOrderPayment_EFT').style.display = "none";
            document.getElementById('pnlOrderPayment_Other').style.display = "none";
            $("#hlPostOrderTransaction").removeAttr("disabled");
            if(
                  ($("#spnOrderPaymentTitle").text() == "Refund Payment")
                  ||
                  ($("#spnOrderPaymentTitle").text() == "Refund In-Store Credit")
            ) {
                  document.getElementById('pnlOrderPayment_Check').style.display = "none";
            }
            HideInStoreCreditValidation();
      }
      else if(selection === "OnlineCc" || selection === "eCheck") {
            $('#pnlOrderPayment_CreditCardOnline').show();
            document.getElementById('pnlOrderPayment_TopAll').style.display = "block";
            document.getElementById('pnlOrderPayment_BottomAll').style.display = "block";
            document.getElementById('pnlOrderPayment_Check').style.display = "none";
            document.getElementById('pnlOrderPayment_CreditCardOnline').style.display = "block";
            document.getElementById('pnlOrderPayment_CreditCardOffline').style.display = "none";
            document.getElementById('pnlOrderPayment_CustomerCredit').style.display = "none";
            document.getElementById('pnlOrderPayment_Buttons').style.display = "block";
            document.getElementById('pnlOrderPayment_EFT').style.display = "none";
            document.getElementById('pnlOrderPayment_Other').style.display = "none";
            $("#pnlOrderPayment_CreditCardOnline_Header").show();
            $("#pnlOrderPayment_CreditCardOnline_Detail").show();
            $("#hlPostOrderTransaction").removeAttr("disabled");
            $('#imgLock').show();

            if(PaymentsMode != 'override_payment') {
                  // Intialize card swipe JS
                  RegisterStoredCardChangeEvent();
                  SetupCreditCardSwipe();
                  DisableEnterForCcSwipe();
            } else {
                  $('#pnlOrderPayment_CreditCardOnline').hide();
            }

            if(useAPEPaymentForOnline) {
                  $("#newPaymentDiv").hide();
                  $("#divOldPayment").hide();
                  $("#newPaymentDivAPE").show();
                  $("#divCcOnlineCircle2").hide();
                  //$("#spnOrderPaymentTitle").text("Refund Online Credit Card Payment");
                  document.getElementById('pnlOrderPayment_TopAll').style.display = "none";
                  document.getElementById('pnlOrderPayment_BottomAll').style.display = "none";
                  document.getElementById('pnlOrderPayment_Buttons').style.display = "none";

                  if((OrderPaymentAPE.AttachementOfAPEIsNotOn_getPaymentType == false && useV2PaymentProcessing == false) || (OrderPaymentAPEV2.AttachementOfAPEIsNotOn_getPaymentType == false && useV2PaymentProcessing == true)) {
                        var orderId = IntOrDefault($('#hfOrderId').val());
                        var accountId = IntOrDefault($('#hfOrdAccountId').val());
                        if(!accountId) {
                              accountId = IntOrDefault($('#hfAccountId').val());
                        }
                        var paymentAmount = 0;
                        paymentAmount = $('#txtTotalPaymentAmount').val();
                        var locationId = $("#hfLocationId").val();
                        var accountName = $("#hfAccountName").val();

                        var balanceDueLabel = GILT.RemoveDirhamCurrencySign($('#BalanceDueLabel').text());

                        if(isNaN(balanceDueLabel) || balanceDueLabel <= 0) {
                              balanceDueLabel = GILT.RemoveDirhamCurrencySign($('#tbPaymentAmount').val());
                        }

                        if(isNaN(balanceDueLabel) || balanceDueLabel <= 0) {
                              balanceDueLabel = GILT.RemoveDirhamCurrencySign($('#lblAmountDue').text());
                        }

                        var userId = $("#hfUserId").val();
                        var isQuickPrice = false;
                        var invoiceNumber = $("#hdnInvoiceNumber").val();
                        if(typeof OrderProperties != "undefined" && typeof OrderProperties.IsQuickPrice != "undefined") {
                              if(OrderProperties.IsQuickPrice === true) {
                                    isQuickPrice = true;
                                    if((locationId == null) || (locationId == "") || (locationId == 0)) {
                                          locationId = OrderProperties.UserContext.LocationId;
                                    }
                              }
                        }
                        var apeDataBulkList = [];
                        if(typeof payments !== 'undefined') {
                              // GetSelectedTRows function is found account_payments2.js               
                              var aSelectedTrs = payments.GetSelectedTRows();

                              $.each(aSelectedTrs, function(i, item) {
                                    if($(item).prop('id') === undefined)
                                          failure = true;

                                    var orderId = FloatOrDefault($(item).prop('id').replace('tr_', ''));
                                    var payment = GILT.RemoveDirhamCurrencySign($($($(item).children().get(6)).children().get(0)).val());
                                    var paymentAmount = GILT.RemoveDirhamCurrencySign($($($(item).children().get(5)).children().get(0)).text());
                                    var invoiceNumber = $.trim($($($(item).children().get(2)).children().get(0)).text());
                                    if(locationId == "" || locationId == null || locationId == 0) {
                                          locationId = $(item).find(".location-data").val();
                                    }
                                    //CB2-3146 - Force get the item location ID since this is needed for credential verification on APE
                                    var itemLocationId = $(item).find(".location-data").val();
                                    if(itemLocationId != "" && itemLocationId != null && itemLocationId != 0) {
                                          locationId = itemLocationId;
                                    }

                                    if(payment > 0) {
                                          apeDataBulkList.push({OrderId: orderId, OrderAmountDue: payment, BalanceDue: paymentAmount, LocationId: locationId, InvoiceNumber: invoiceNumber});
                                    }
                              });

                              //Add overpayment amount if found...
                              var paymentTotal = parseFloat($('#tbPaymentTotal').val().replace(/[^0-9-.]/g, ''));
                              paymentAmount = parseFloat($('#tbPaymentAmount').val().replace(/[^0-9-.]/g, ''));
                              var isOverPayment = false;
                              if(paymentAmount >= paymentTotal) {
                                    $('#tbPaymentAmount').val(paymentAmount.toFixed(2));
                                    //var overpaymentAmount = paymentAmount - paymentTotal;
                                    var overpaymentAmount = Decimal.sub(paymentAmount, paymentTotal).toNumber();

                                    // no overpayment for APE for now
                                    if(overpaymentAmount > 0) {
                                          //isOverPayment = true;
                                          //apeDataBulkList.push({ OrderId: 0, OrderAmountDue: overpaymentAmount, LocationId: locationId, InvoiceNumber: invoiceNumber });
                                    }
                              }
                        }
                        //OrderPaymentSlice.InitializeVariables(orderId, accountId, accountName, balanceDueLabel, locationId, userId, null, isQuickPrice, invoiceNumber, null, null, null, sliceDataBulkList, isOverPayment);

                        if(apeDataBulkList.length == 0) {
                              apeDataBulkList.push({OrderId: orderId, OrderAmountDue: balanceDueLabel, LocationId: locationId, InvoiceNumber: invoiceNumber});
                        }
                        userId = $("#hfUserId").val();
                        OrderPaymentAPE.IsQuickPrice = isQuickPrice;
                        OrderPaymentAPEV2.IsQuickPrice = isQuickPrice;

                        if(useV2PaymentProcessing) {
                              var returnMsg = OrderPaymentAPEV2.StartPayment(apeDataBulkList, locationId, userId, false, null, userId);
                              if(returnMsg != "") {
                                    Commonui.Alert(returnMsg, "Error");
                              }
                        }
                        else {
                              var returnMsg = OrderPaymentAPE.StartPayment(apeDataBulkList, locationId, userId, false, null, userId);
                              if(returnMsg != "") {
                                    Commonui.Alert(returnMsg, "Error");
                              }

                        }
                  }
                  HideInStoreCreditValidation();
            }
            else if(useSlicePaymentForOnline) {
                  $("#newPaymentDiv").show();
                  $("#divOldPayment").hide();
                  $("#newPaymentDivAPE").hide();
                  $("#divCcOnlineCircle2").hide();
                  //$("#spnOrderPaymentTitle").text("Refund Online Credit Card Payment");
                  document.getElementById('pnlOrderPayment_TopAll').style.display = "none";
                  document.getElementById('pnlOrderPayment_BottomAll').style.display = "none";
                  document.getElementById('pnlOrderPayment_Buttons').style.display = "none";
                  $("#hlPostOrderTransaction").removeAttr("disabled");

                  if(OrderPaymentSlice.AttachementOfSliceIsNotOn_getPaymentType == false) {
                        var orderId = IntOrDefault($('#hfOrderId').val());
                        var accountId = IntOrDefault($('#hfOrdAccountId').val());
                        if(!accountId) {
                              accountId = IntOrDefault($('#hfAccountId').val());
                        }
                        var paymentAmount = 0;
                        paymentAmount = $('#txtTotalPaymentAmount').val();
                        var locationId = $("#hfLocationId").val();
                        var accountName = $("#hfAccountName").val();

                        var balanceDueLabel = GILT.RemoveDirhamCurrencySign($('#BalanceDueLabel').text());

                        if(isNaN(balanceDueLabel) || balanceDueLabel <= 0) {
                              balanceDueLabel = GILT.RemoveDirhamCurrencySign($('#tbPaymentAmount').val());
                        }

                        var userId = $("#hfUserId").val();
                        var isQuickPrice = false;
                        var invoiceNumber = $("#hdnInvoiceNumber").val();
                        if(typeof OrderProperties != "undefined" && typeof OrderProperties.IsQuickPrice != "undefined") {
                              if(OrderProperties.IsQuickPrice === true) {
                                    isQuickPrice = true;
                              }
                        }

                        if(typeof payments !== 'undefined') {
                              // GetSelectedTRows function is found account_payments2.js               
                              var aSelectedTrs = payments.GetSelectedTRows();
                              var sliceDataBulkList = [];
                              $.each(aSelectedTrs, function(i, item) {
                                    if($(item).prop('id') === undefined)
                                          failure = true;

                                    var orderId = FloatOrDefault($(item).prop('id').replace('tr_', ''));
                                    var payment = GILT.RemoveDirhamCurrencySign($($($(item).children().get(6)).children().get(0)).val());
                                    var paymentAmount = GILT.RemoveDirhamCurrencySign($($($(item).children().get(5)).children().get(0)).text());
                                    var invoiceNumber = $.trim($($($(item).children().get(2)).children().get(0)).text());
                                    var locationIdFound = $(item).find(".location-data").val();
                                    if(!(locationIdFound == "" || locationIdFound == null || locationIdFound == "0")) {
                                          locationId = locationIdFound;
                                    }
                                    // in case location was not set
                                    if(locationId == "" || locationId == null || locationId == "0") {
                                          locationId = $("#hfLocationId").val();
                                    }

                                    if(payment > 0) {
                                          sliceDataBulkList.push({OrderId: orderId, OrderAmountDue: payment, LocationId: locationId, InvoiceNumber: invoiceNumber});
                                    }
                              });

                              //Add overpayment amount if found...
                              var paymentTotal = parseFloat($('#tbPaymentTotal').val().replace(/[^0-9-.]/g, ''));
                              var paymentAmount = parseFloat($('#tbPaymentAmount').val().replace(/[^0-9-.]/g, ''));
                              var isOverPayment = false;
                              if(paymentAmount >= paymentTotal) {
                                    $('#tbPaymentAmount').val(paymentAmount.toFixed(2));
                                    //var overpaymentAmount = paymentAmount - paymentTotal;
                                    var overpaymentAmount = Decimal.sub(paymentAmount, paymentTotal).toNumber();
                                    if(overpaymentAmount > 0) {
                                          isOverPayment = true;
                                          sliceDataBulkList.push({OrderId: 0, OrderAmountDue: overpaymentAmount, LocationId: locationId, InvoiceNumber: invoiceNumber});
                                          var paymentAmountNew = 0;
                                          for(var i1 = 0; i1 < sliceDataBulkList.length; i1++) {
                                                var item = sliceDataBulkList[i1];
                                                paymentAmountNew = Decimal.add(paymentAmountNew, item.OrderAmountDue).toNumber();
                                          }
                                          balanceDueLabel = paymentAmountNew;
                                    }
                              }
                        }

                        OrderPaymentSlice.InitializeVariables(orderId, accountId, accountName, balanceDueLabel, locationId, userId, null, isQuickPrice, invoiceNumber, null, null, null, sliceDataBulkList, isOverPayment);
                        var returnMsg = OrderPaymentSlice.StartPayment();
                        if(returnMsg != "") {
                              Commonui.Alert(returnMsg, "Error");
                        }
                  }
                  HideInStoreCreditValidation();
            }
            else {
                  $("#newPaymentDiv").hide();
                  $("#divOldPayment").show();
                  $("#newPaymentDivAPE").hide();
                  // Intialize card swipe JS
                  RegisterStoredCardChangeEvent();
                  SetupCreditCardSwipe();
                  DisableEnterForCcSwipe();

                  if(typeof OrderDataHelper != 'undefined') {
                        var accountId = HasValue(OrderProperties.AccountId) && OrderProperties.AccountId != "" ? OrderProperties.AccountId : CurrentOrder.AccountId();
                        OrderDataHelper.GetPaymentData(accountId,
                              function(jsonData) {
                                    $("#txtCreditCardAddress1").val(jsonData.BillingAddressStreet1);
                                    $("#txtCreditCardAddress2").val(jsonData.BillingAddressStreet2);
                                    $("#txtCreditCardCity").val(jsonData.BillingAddressCity);
                                    $("#ddCreditCardState").val(jsonData.BillingAddressState);
                                    $("#txtCreditCardPostalCode").val(jsonData.BillingAddressZip);
                                    $("#txtCreditCardCompanyPhone").val(jsonData.CompanyPhone);
                                    $("#txtCreditCardCompanyFax").val(jsonData.CompanyFax);
                                    $("#txtCreditCardPrimaryContactEmail").val(jsonData.PrimaryContactEmail);
                              },
                              function() {

                              }, $("#tblManualOnlineCcEntry_BillingAddress"));
                  }
            }
            HideInStoreCreditValidation();
      }
      else if(selection === "OfflineCc") {
            document.getElementById('pnlOrderPayment_TopAll').style.display = "block";
            document.getElementById('pnlOrderPayment_BottomAll').style.display = "block";
            document.getElementById('pnlOrderPayment_Check').style.display = "none";
            document.getElementById('pnlOrderPayment_CreditCardOnline').style.display = "none";
            document.getElementById('pnlOrderPayment_CreditCardOffline').style.display = "block";
            document.getElementById('pnlOrderPayment_CustomerCredit').style.display = "none";
            document.getElementById('pnlOrderPayment_Buttons').style.display = "block";
            document.getElementById('pnlOrderPayment_EFT').style.display = "none";
            document.getElementById('pnlOrderPayment_Other').style.display = "none";
            $("#hlPostOrderTransaction").removeAttr("disabled");
            HideInStoreCreditValidation();
      }
      else if(selection === "CustomerCredit") {
            //Overpayments are not allowed when paying with In-Store Credit...
            if($("#lblPaymentAmountMessage").html().indexOf("overpayment of $") != -1) {
                  document.getElementById('pnlOrderPayment_TopAll').style.display = "none";
                  document.getElementById('pnlOrderPayment_BottomAll').style.display = "none";
                  document.getElementById('pnlOrderPayment_Check').style.display = "none";
                  document.getElementById('pnlOrderPayment_CreditCardOnline').style.display = "none";
                  document.getElementById('pnlOrderPayment_CreditCardOffline').style.display = "none";
                  document.getElementById('pnlOrderPayment_CustomerCredit').style.display = "none";
                  document.getElementById('pnlOrderPayment_Buttons').style.display = "none";
                  document.getElementById('pnlOrderPayment_EFT').style.display = "none";
                  document.getElementById('pnlOrderPayment_Other').style.display = "none";
                  $("#spnGenericMessage").html("Overpayments are not allowed when paying with In-Store Credit.");
                  $("#spnGenericMessage").show();
                  $("#hlPostOrderTransaction").removeAttr("disabled");
            }
            else {
                  document.getElementById('pnlOrderPayment_TopAll').style.display = "block";
                  document.getElementById('pnlOrderPayment_BottomAll').style.display = "block";
                  document.getElementById('pnlOrderPayment_Check').style.display = "none";
                  document.getElementById('pnlOrderPayment_CreditCardOnline').style.display = "none";
                  document.getElementById('pnlOrderPayment_CreditCardOffline').style.display = "none";
                  document.getElementById('pnlOrderPayment_CustomerCredit').style.display = "block";
                  document.getElementById('pnlOrderPayment_Buttons').style.display = "block";
                  document.getElementById('pnlOrderPayment_EFT').style.display = "none";
                  document.getElementById('pnlOrderPayment_Other').style.display = "none";
                  $("#hlPostOrderTransaction").removeAttr("disabled");

                  if($("#hfPaymentSubTypeId").val() == '3') {
                        document.getElementById('pnlOrderPayment_CustomerCredit').style.display = "none";
                  }

                  if(PaymentsMode != 'override_payment' && !$('#txtTotalPaymentAmount').isBound('keyup', getPaymentType)) {
                        //alert('bound new trigger!');
                        $('#txtTotalPaymentAmount').keyup(function() {
                              var payAmt = $(this).val();
                              var availCreditAmt = $('#txtAvailableCredit').val();
                              if(FloatOrDefault(availCreditAmt) < FloatOrDefault(payAmt)) {
                                    $('#hlPostOrderTransaction')
                                          .prop('class', 'btnDisabled')
                                          .prop('title', 'Insufficient credit.');
                                    $('#lblPaymentAmountMessage')
                                          .addClass('text-danger')
                                          .text('Insufficient credit.')
                                          .fadeIn();

                                    $('#hlPostOrderTransaction').unbind('click');
                              } else {
                                    HideInStoreCreditValidation();
                                    RebindPostOrderPaymentButton();
                              }
                        });
                  }
                  $('#txtTotalPaymentAmount').trigger('keyup');
            }
      }
      else if(selection === "EFT") {
            document.getElementById('pnlOrderPayment_TopAll').style.display = "block";
            document.getElementById('pnlOrderPayment_BottomAll').style.display = "block";
            document.getElementById('pnlOrderPayment_Check').style.display = "none";
            document.getElementById('pnlOrderPayment_CreditCardOnline').style.display = "none";
            document.getElementById('pnlOrderPayment_CreditCardOffline').style.display = "none";
            document.getElementById('pnlOrderPayment_CustomerCredit').style.display = "none";
            document.getElementById('pnlOrderPayment_Buttons').style.display = "block";
            document.getElementById('pnlOrderPayment_EFT').style.display = "block";
            document.getElementById('pnlOrderPayment_Other').style.display = "none";
            $("#hlPostOrderTransaction").removeAttr("disabled");
            HideInStoreCreditValidation();
      }
      else if(selection === "Other") {
            document.getElementById('pnlOrderPayment_TopAll').style.display = "block";
            document.getElementById('pnlOrderPayment_BottomAll').style.display = "block";
            document.getElementById('pnlOrderPayment_Check').style.display = "none";
            document.getElementById('pnlOrderPayment_CreditCardOnline').style.display = "none";
            document.getElementById('pnlOrderPayment_CreditCardOffline').style.display = "none";
            document.getElementById('pnlOrderPayment_CustomerCredit').style.display = "none";
            document.getElementById('pnlOrderPayment_Buttons').style.display = "block";
            document.getElementById('pnlOrderPayment_EFT').style.display = "none";
            $("#hlPostOrderTransaction").removeAttr("disabled");

            if($('#ddOtherType option').length > 0) {
                  document.getElementById('pnlOrderPayment_Other').style.display = "block";
            }
            HideInStoreCreditValidation();
      }
      else if(selection === "BadDebt") {
            document.getElementById('pnlOrderPayment_TopAll').style.display = "block";
            document.getElementById('pnlOrderPayment_BottomAll').style.display = "block";
            document.getElementById('pnlOrderPayment_Check').style.display = "none";
            document.getElementById('pnlOrderPayment_CreditCardOnline').style.display = "none";
            document.getElementById('pnlOrderPayment_CreditCardOffline').style.display = "none";
            document.getElementById('pnlOrderPayment_CustomerCredit').style.display = "none";
            document.getElementById('pnlOrderPayment_Buttons').style.display = "block";
            document.getElementById('pnlOrderPayment_EFT').style.display = "none";
            document.getElementById('pnlOrderPayment_Other').style.display = "none";
            $("#hlPostOrderTransaction").removeAttr("disabled");
            HideInStoreCreditValidation();
      }
      else {
            if(document.getElementById('pnlOrderPayment_TopAll') !== null) document.getElementById('pnlOrderPayment_TopAll').style.display = "none";
            if(document.getElementById('pnlOrderPayment_BottomAll') !== null) document.getElementById('pnlOrderPayment_BottomAll').style.display = "none";
            if(document.getElementById('pnlOrderPayment_Check') !== null) document.getElementById('pnlOrderPayment_Check').style.display = "none";
            if(document.getElementById('pnlOrderPayment_CreditCardOnline') !== null) document.getElementById('pnlOrderPayment_CreditCardOnline').style.display = "none";
            if(document.getElementById('pnlOrderPayment_CreditCardOffline') !== null) document.getElementById('pnlOrderPayment_CreditCardOffline').style.display = "none";
            if(document.getElementById('pnlOrderPayment_CustomerCredit') !== null) document.getElementById('pnlOrderPayment_CustomerCredit').style.display = "none";
            if(document.getElementById('pnlOrderPayment_Buttons') !== null) document.getElementById('pnlOrderPayment_Buttons').style.display = "none";
            if(document.getElementById('pnlOrderPayment_EFT') !== null) document.getElementById('pnlOrderPayment_EFT').style.display = "none";
            if(document.getElementById('pnlOrderPayment_Other') !== null) document.getElementById('pnlOrderPayment_Other').style.display = "none";
            HideInStoreCreditValidation();
      }
}

function HideInStoreCreditValidation() {
      $('#hlPostOrderTransaction')
            .removeClass('btnDisabled')
            .removeAttr('title')
            .removeAttr('disabled')
            .addClass('btnAddProduct');
      $('#lblPaymentAmountMessage')
            .fadeOut(function() {
                  $(this).removeClass('text-danger').text('');
            });
}

function RebindPostOrderPaymentButton() {
      // re-bind if the button was unbind due to CustomerCredit not enough for payment
      var btnSubmitPayment = $('#hlPostOrderTransaction');
      if(!btnSubmitPayment.isBound('click', postOrderTransaction) && $("#hlPostOrderTransaction").attr("disabled") != "disabled") {
            $("#hlPostOrderTransaction").attr("disabled", true);
            $('#hlPostOrderTransaction').prop('class', 'btnAddProduct');
            $('#hlPostOrderTransaction').click(function(event) {
                  event.preventDefault();
                  postOrderTransaction();
            });
      }
}

function MakeCcInfoViewObject(offline) {
      var token = $('#hfOnlineCcPaymentToken').val();
      var ccinfo = null;

      var cardType = "";
      if(offline) {
            cardType = $('#ddOfflineCcType').val();
      }
      else {
            cardType = $('#ddCreditCardCardType').val();
      }

      if(token != null && token.length > 0) {
            ccinfo = {
                  CcToken: token,
                  CcType: $('#ddCreditCardCardType').val(),
                  CcAddress1: $('#txtCreditCardAddress1').val(),
                  CcAddress2: $('#txtCreditCardAddress2').val(),
                  CcCardNumber: $('#txtCreditCardCardNumber').val(),
                  CcCity: $('#txtCreditCardCity').val(),
                  CcState: $('#ddCreditCardState').val(),
                  CcExpirationMonth: $('#ddCreditCardExpirationMonth').val(),
                  CcExpirationYear: $('#ddCreditCardExpirationYear').val(),
                  CcPostalCode: $('#txtCreditCardPostalCode').val(),
                  CcNameOnCard: $('#txtCreditCardNameOnCard').val(),
                  CcCVC: $('#txtCreditCardCVC').val(),
                  CcCVV2: $('#txtCreditCardCVV2').val(),
                  CcCompanyPhone: $("#txtCreditCardCompanyPhone").val(),
                  CcCompanyFax: $("#txtCreditCardCompanyFax").val(),
                  CcPrimaryContactEmail: $("#txtCreditCardPrimaryContactEmail").val(),
                  CCMagStripe: $('#hfMagstripeData').val()
            };
      }
      else {
            ccinfo = {
                  CcAddress1: $('#txtCreditCardAddress1').val(),
                  CcAddress2: $('#txtCreditCardAddress2').val(),
                  CcCardNumber: $('#txtCreditCardCardNumber').val(),
                  CcCity: $('#txtCreditCardCity').val(),
                  CcState: $('#ddCreditCardState').val(),
                  CcExpirationMonth: $('#ddCreditCardExpirationMonth').val(),
                  CcExpirationYear: $('#ddCreditCardExpirationYear').val(),
                  CcPostalCode: $('#txtCreditCardPostalCode').val(),
                  CcNameOnCard: $('#txtCreditCardNameOnCard').val(),
                  CcType: cardType,
                  CcCVC: $('#txtCreditCardCVC').val(),
                  CcCVV2: $('#txtCreditCardCVV2').val(),
                  CcCompanyPhone: $("#txtCreditCardCompanyPhone").val(),
                  CcCompanyFax: $("#txtCreditCardCompanyFax").val(),
                  CcPrimaryContactEmail: $("#txtCreditCardPrimaryContactEmail").val(),
                  CCMagStripe: $('#hfMagstripeData').val()
            };
      }

      return ccinfo;
}

// TODO: Shadow method; to be removed
function SendOrderPayments(request) {
      SendOrderTransactions(request);
}

function SendOrderTransactions(request, successCallBack, errorCallBack) {
      if(request == null) {
            alert('Error sending payment. Request contains no data!');
            return;
      }

      if(typeof DisableActions === 'function') {
            DisableActions();
      }
      voidText = request.PaymentNote.split('Refund Payment:');
      voidText = $.trim(voidText[1]);
      IsPayment = true;
      ShowCommonUpdatingBox('Processing Payment..');

      PrivateWeb.SalesModule.OrderWebService.SendOrderPayments(request,
            function(response) {
                  paymentPosted = 0;

                  if(typeof EnableActions === 'function') {
                        EnableActions();
                  }

                  if(successCallBack && $.isFunction(successCallBack)) {
                        if((typeof OrderOverpaymentObject != 'undefined')
                              && (OrderOverpaymentObject != null)
                              && OrderOverpaymentObject.FromGlobalSearch == true) {
                              OrderOverpaymentObject.WasRefunded = true;
                        }
                        successCallBack(response);
                  }
                  OnSendOrderPaymentsComplete(response, request.CallerId);
            }, function(arg) {
                  paymentPosted = 0;
                  if(typeof EnableActions === 'function') {
                        EnableActions();
                  }

                  if(errorCallBack && $.isFunction(errorCallBack)) {
                        errorCallBack(arg);
                  }
                  OnSendOrderPaymentsError(arg);
            }, OnSendOrderPaymentsTimeOut);
}

/**
 * 
 * @param {any} response
 * @param {any} callerId

response.IsSuccess
response.OrderId
response.Requested.OrderPayments[0].AmountDue
response.PaymentType
response.FlagRefundOverpaymentMode)
 */
function OnSendOrderPaymentsComplete(response, callerId) {
      HideCommonUpdatingBox();
      if(typeof EnableActions === 'function') {
            EnableActions();
      }

      if(response.IsSuccess) {
            // Since we reload the page for status CLOSED after payment, 
            //  the rest of the codes below does not need to run so we end here.
            if(response.FlagRefundOverpaymentMode === 1 && OrderProperties.IsUsingTaxJarTax) {
                  pageReload = false;
            } else {
                  pageReload = true;
            }

            $("#spnAmountDue_" + response.OrderId).text(response.Requested.OrderPayments[0].AmountDue);
            if(response.NewOrderStatus == "CLOSED") {
                  if(response.PaymentType != "OnlineCc") {
                        $.modal.close();
                        showUpdatingBox('Reloading page...');
                        __doPostBack(); // reload page to prevent editing of status fields
                        return; // ends the method here to prevent thread abort errors.
                  }
                  $("#tr_" + response.OrderId).remove();
            }

            if(response.Requested.OrderPayments[0].AmountDue == 0) {
                  $("#tr_" + response.OrderId).remove();
            }

            if(response.PaymentType != "OnlineCc") {
                  // called by SlycePayment.aspx
                  $('.simplemodal-close').trigger('click');

                  //if on bulk payment page force refresh
                  if((window.location).toString().toLowerCase().indexOf('payments.aspx') > -1 && payments != undefined) {
                        $("#txtCompanyName").change();
                        if(useSlicePaymentForOnline) {
                              return;
                        }
                  }
            }
            else {
                  if(useSlicePaymentForOnline) {
                        OrderPaymentSlice.CloseActionEvent = function(currentWindow) {
                              currentWindow.$('.simplemodal-close').trigger('click');
                              if((window.location).toString().toLowerCase().indexOf('payments.aspx') > -1 && payments != undefined) {
                                    $("#txtCompanyName").change();
                                    if(useSlicePaymentForOnline) {
                                          return;
                                    }
                              }
                        };
                  }
                  else {
                        //CB2-2475 -Turn off auto close modal for now...
                        if(!useAPEPaymentForOnline) {
                              $('.simplemodal-close').trigger('click');
                              if((window.location).toString().toLowerCase().indexOf('payments.aspx') > -1 && payments != undefined) {
                                    $("#txtCompanyName").change();
                              }
                        }
                  }
            }
            var isNotRefund = false;
            switch(response.FlagRefundOverpaymentMode) {
                  case 1:
                        if(
                              (typeof OrderOverpaymentObject != 'undefined' && OrderOverpaymentObject != null) &&
                              (OrderOverpaymentObject.FromGlobalSearch == true)
                        ) {
                              if(useSlicePaymentForOnline) {
                                    return;
                              }
                        }
                        ConfirmOrderProductStatusVoid(true);
                        return;
                  case 2:
                        if(typeof OrderOverpaymentObject != 'undefined' && OrderOverpaymentObject.CallBackFunction != null && OrderOverpaymentObject.CallBackFunction != undefined) {
                              OrderOverpaymentObject.CallBackFunction();
                        } else {
                              showUpdatingBox("Reloading page...");
                              var orderPath = ResolvePath("/SalesModule/Orders/Order.aspx?OrderId=" + response.OrderId + "");
                              window.onbeforeunload = null;
                              window.location.replace(orderPath);
                        }
                        //OrderStep3.Order_SaveOrder(true);
                        break;
                  case 3:
                        if((typeof OrderOverpaymentObject != 'undefined') && (OrderOverpaymentObject != null)) {
                              OrderOverpaymentObject.UpdateTaxExemptSetting();
                              if(useSlicePaymentForOnline) {
                                    return;
                              }
                        } else {
                              alert('OrderOverpaymentObject should not be null from here.');
                        }
                        break;
                  case 4:
                        if(response.Requested.OrderPayments[0].AmountDue > 0) {
                              $("#tr_" + response.OrderId).remove();
                              $("#tr_" + response.TransactionToRefundID).remove();
                              $('.chkBoxRefund').prop('disabled', false);
                        }
                  default:
                        isNotRefund = true;
                        break;
            }


            if(isNotRefund && typeof UpdateDomForPaymentsSuccess === 'function') {
                  UpdateDomForPaymentsSuccess(response, callerId == "QUICKPRICE");
            }

            var message = 'Payment posted successfully.';

            if(!(response.VaultStorageErrorMessage == null || response.VaultStorageErrorMessage == "")) {
                  message += " But storing to customer vault was unsuccessful. " + response.VaultStorageErrorMessage;
            }

            if($('#hfRedirectTo').val() != "") {

                  $.jGrowl(message, {position: 'nearItem', life: 1000, beforeClose: function(e, m) {showUpdatingBox('Updating...');}});
            }
            else {
                  $.jGrowl(message, {position: 'nearItem'});
            }

            InitPaymentHistory_OneTimeAjaxSourced();
            InitPaymentHistoryOverride_OneTimeAjaxSourced();
            InitRefundPaymentsTable_OneTimeAjaxSourced();
            InitPaymentHistoryOverride_Check_OneTimeAjaxSourced();

            var orderproductStatusDropdowns = $('[id^="ddlStatus_"]');
            if(orderproductStatusDropdowns.length > 0) {
                  RefershAllOrderStatusDropdowns(true);
            }

            var $ordStatusLabel = $('#OrderStatusLabel');
            if($('#OrderStatusLabel').length == 0)
                  $ordStatusLabel = $('#lblOrderStatus');

            if($ordStatusLabel.length > 0) {
                  // aggregate order status change

                  if($('#OrderStatusLabel').text() != response.NewOrderStatus || $('#lblOrderStatus').text() != response.NewOrderStatus) {
                        if($('#OrderStatusLabel').length > 0)
                              $('#OrderStatusLabel').text(response.NewOrderStatus);
                        else
                              $('#lblOrderStatus').text(response.NewOrderStatus);

                        if((response.NewOrderStatus == "CLOSED") || (response.NewOrderStatus == "COMPLETED")) {
                              if(response.IsAbleToEditCompletedOrClosedOrders) {
                                    $('#lbEditOrder').unbind('click');
                                    $('#lbEditOrder').bind('click', function() {
                                          OpenEditCompletedOrClosedOrderModal(response.NewOrderStatus, response.OrderId);
                                          //EditCompletedOrder();
                                    });
                              } else {
                                    $('#lbEditOrder').attr('disabled', 'disabled');
                                    $('#lbEditOrder').attr('alt', 'Cannot edit an order that is completed or closed.');

                                    if(typeof (disableAnchorLinks) == "function") {
                                          disableAnchorLinks('lbEditOrder');
                                    }
                              }
                        }

                        var hasPayment = response.Requested.OrderPayments[0].AmountPaid > 0;

                        // Should remove this?
                        if(response.NewOrderStatus == "COMPLETED" && !hasPayment) {
                              var voidButton = $("<a></a>");
                              voidButton.attr("onclick", "BtnVoidEvent()");
                              voidButton.attr("id", "lbVoidOrder");
                              voidButton.attr("title", "Order &gt; Void");
                              voidButton.attr("class", "btnAddProduct");
                              voidButton.attr("href", 'javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions("ctl00$ContentPlaceHolder1$lbVoidOrder", "", true, "", "", false, true))');
                              voidButton.css({"width": "120px", "margin-top": "5px", "float": "left", "text-align": "left"});
                              voidButton.html('<i class="fal fa-file-minus icon-clone" style="color:maroon;font-size:16px;"></i> Void Order');

                              $("#voidContainer").append(voidButton);
                        } else if(hasPayment && (
                              response.NewOrderStatus == "WIP" ||
                              response.NewOrderStatus == "BUILT" ||
                              response.NewOrderStatus == "COMPLETED"
                        )) {
                              //$('#lbVoidOrder').attr('title', "has paymentThere is a payment on this order that must be refunded before you can VOID the order. \nPlease go to the Customer Payments page to process a refund for the over-payment.");

                              disableAnchorLinks('lbVoidOrder');
                              $('#lbVoidOrder').removeAttr('title').addClass("help");
                              $('#lnkOrderViewTotalRefund2').attr('href',
                                    `/SalesModule/Accounts/Payments.aspx?acctid=${OrderProperties.AccountId}&acctname=${OrderProperties.OrderCompanyName}&search=${OrderProperties.InvoiceNumber}#divProcessRefund`);
                        } else {
                              if(callerId == null) callerId = "";

                              if(typeof OrderDataHelper != 'undefined' && response.PaymentType == "OnlineCc" && !(callerId.toLowerCase() === "slice" || callerId.toLowerCase() === "ape")) {
                                    OrderDataHelper.GetInitStoredPaymentOptions(response.AccountId, response.MSLocationId, function(htmlData, vaultCustomerList) {

                                          if(vaultCustomerList !== null && vaultCustomerList.length > 0) {
                                                htmlData = htmlData + "<input type='radio' id='manualOnlineCcEntry' onclick='javascript:SetupManualCcEntryDiv();' name='storedCard' value='-1'> Non-Stored Card<br>";
                                                $('#divStoredPaymentRadioEntries').html(htmlData);
                                                $('#tblManualOnlineCcEntry').css('display', 'none');
                                                $('#divSelectStoredPayment').css('display', 'block');
                                                RegisterStoredCardChangeEvent("", "");
                                          }

                                    }, function() { }, null);
                              }
                        }

                        if(response.NewOrderStatus == "CANCELLED") {
                              SetPageAsCancelled();
                        }
                  }
            }

            if(typeof (refreshOrderDates) == "function") {
                  if(response.OrderId != 0) {
                        refreshOrderDates(response.OrderId);
                  }
            }

            if(callerId == "QUICKPRICE") {
                  RedirectToOrder();
            }

      }
      else {
            var message = 'Payment Failed: ' + response.Message;

            if(!(response.VaultStorageErrorMessage == null || response.VaultStorageErrorMessage == "")) {
                  message += " And storing to customer vault was unsuccessful. " + response.VaultStorageErrorMessage;
            }

            $.jGrowl(message, {position: 'nearItem'});
      }
}

function RedirectToOrder(viewDetails) {
      if(FormatString(GetPropertyValue(CurrentOrder.TotalPaid), "#.##") == FormatString(GetPropertyValue(CurrentOrder.TotalPaid), "#.##")) {
            Commonui.ShowLoading($("#finalizeQuickPrice"));
            var orderPath = Common.ResolvePath("/SalesModule/Orders/Order.aspx?OrderId=" + CurrentOrder.Id + "");
            window.onbeforeunload = null;
            if(viewDetails === true) {
                  $("#viewDetails").css('display', 'block');
                  $("#viewDetails").attr("href", orderPath);
            } else {
                  window.location.replace(orderPath);
            }
      }
};


function BtnVoidEvent() {
      ShowVoidModal(true);
      $("#txtHiddenOpIdToVoid").val("0");
      return false;
}

function OnSendOrderPaymentsError(arg) {
      HideCommonUpdatingBox();
      if(typeof EnableActions === 'function') {
            EnableActions();
      }
      $('.simplemodal-close').trigger('click');
      $.jGrowl('Error has occured: ' + arg._message, {position: 'nearItem'});
}

function OnSendOrderPaymentsTimeOut(arg) {
      HideCommonUpdatingBox();
      if(typeof EnableActions === 'function') {
            EnableActions();
      }
      $('.simplemodal-close').trigger('click');
      $.jGrowl('Timeout has occured', {position: 'nearItem'});
}

function OnAddInStoreCreditComplete(result) {
      if(typeof payments !== 'undefined') payments.ajaxQs.pop();
      if(result == "") {
            _accountId = (typeof _accountId === 'undefined') ? $('#hfAccountId').val() : _accountId;
            RefreshInStoreAvailableCredit(_accountId);
      }
      else {

            var message = "ERROR: " + result;

            if(!(response.VaultStorageErrorMessage == null || response.VaultStorageErrorMessage == "")) {
                  message += " And storing to customer vault was unsuccessful. " + response.VaultStorageErrorMessage;
            }

            $.jGrowl(message, {position: 'managementBar'});
      }
}

function OnAddInStoreCreditError(arg) {
      if(typeof payments !== 'undefined') payments.ajaxQs.pop();
      alert("Error has occured: " + arg._message);
}

function OnAddInStoreCreditTimeOut(arg) {
      if(typeof payments !== 'undefined') payments.ajaxQs.pop();
      alert("TimeOut has occured");
}

function RefreshInStoreAvailableCredit(acctId, locationId) {
      //Add instore credit dropdown option even if there is none... only for CbPaymentSubTypeEnum 3 - Refund
      if($("#hfPaymentSubTypeId").val() == '3') {
            $('#spnOrderPaymentHasCredit').text('');
            $("option[value='CustomerCredit']").remove();
            $("#ddPaymentType").append($("<option />").val("CustomerCredit").text("In-Store Credit"));
      }
      else {
            if(typeof payments !== 'undefined') payments.ajaxQs.push(1);
            var orderId = $('#hfOrderId').val();
            if(orderId != null && !isNaN(orderId) && parseInt(orderId) > 0) {
                  PrivateWeb.SalesModule.AccountWebService.GetInStoreCreditTotalByOrder(acctId, orderId,
                        OnRefreshInStoreAvailableCreditComplete, OnRefreshInStoreAvailableCreditError, OnRefreshInStoreAvailableCreditTimeOut);
            } else if(locationId != undefined && !isNaN(locationId)) {
                  PrivateWeb.SalesModule.AccountWebService.GetInStoreCreditTotalByLocation(acctId, locationId,
                        OnRefreshInStoreAvailableCreditComplete, OnRefreshInStoreAvailableCreditError, OnRefreshInStoreAvailableCreditTimeOut);
            } else {
                  PrivateWeb.SalesModule.AccountWebService.GetInStoreCreditTotal(acctId,
                        OnRefreshInStoreAvailableCreditComplete, OnRefreshInStoreAvailableCreditError, OnRefreshInStoreAvailableCreditTimeOut);
            }
      }
}

function OnRefreshInStoreAvailableCreditComplete(result) {
      if(typeof payments !== 'undefined') payments.ajaxQs.pop();
      $('#txtAvailableCredit').val(result);

      if(parseStringToFloat(result) <= 0) {
            $("option[value='CustomerCredit']").remove();
            $('#spnOrderPaymentHasCredit').text('');
      }
      else {
            $("option[value='CustomerCredit']").remove();
            $('#spnOrderPaymentHasCredit').text('In-Store Credit Available');
            $("#ddPaymentType").append($("<option />").val("CustomerCredit").text("In-Store Credit"));
      }
}

function OnRefreshInStoreAvailableCreditError(arg) {
      alert("Error has occured: " + arg._message);
}

function OnRefreshInStoreAvailableCreditTimeOut(arg) {
      alert("TimeOut has occured");
}

function ClearAllPaymentFields() {
      $('#txtCheckNum').val('');
      $('#txtCheckId').val('');
      $('#ddCreditCardCardType :nth-child(1)').prop('selected', 'selected');
      $('#txtCreditCardAddress1').val('');
      $('#txtCreditCardNameOnCard').val('');
      $('#txtCreditCardAddress2').val('');
      $('#txtCreditCardCardNumber').val('');
      $('#txtCreditCardCity').val('');
      $('#ddCreditCardExpirationMonth :nth-child(1)').prop('selected', 'selected');
      $('#ddCreditCardExpirationYear :nth-child(1)').prop('selected', 'selected');
      $('#ddCreditCardState :nth-child(1)').prop('selected', 'selected');
      $('#txtCreditCardCVC').val('');
      $('#txtCreditCardCVV2').val('');
      $('#txtCreditCardPostalCode').val('');
      $('#ddPaymentType :nth-child(1)').prop('selected', 'selected');
      $('#txtTotalPaymentAmount').val('');
      $('#hfRedirectTo').val('');
      $("#hfIsReconciled").val('');
      $('#ddEFTType :nth-child(1)').prop('selected', 'selected');
}

function Check4Digits() {
      var checkLast4Re = new RegExp("^[0-9]{4}$");
      ///^[0-9]{3,4}$/
      if(checkLast4Re.test($('#txtOfflineCcLast4Digits').val())) {
            return true;
      }
      else {
            $('#spnCcLast4DigitsValidation').html('requires 4 numeric digits');
            $('#spnCcLast4DigitsValidation').css('display', '');
            return false;
      }
}


function CheckSelectedOfflineCcType() {
      if($('#ddOfflineCcType')[0].selectedIndex != -1) {
            return true;
      } else {
            $('#spnOfflineCCType').html('requires credit card type');
            $('#spnOfflineCCType').css('display', '');
            return false;
      }
}

function SetupPaymentTypeSpecificValidation() {
      if(PaymentsMode == 'override_payment') {
            ValidatePayment_Click = function() {
                  var isValid = true;
                  var balanceDue = GILT.RemoveDirhamCurrencySign($('#BalanceDueLabel').text());
                  var paymentEdited = parseStringToFloat($("#txtPreviousTotalPaymentAmount").val());
                  var maxPayment = balanceDue + paymentEdited;
                  var newPaymentAmount = parseStringToFloat($("#txtNewTotalPaymentAmount").val());

                  if(newPaymentAmount > maxPayment) {
                        $('#lblPaymentAmountValidationMessage').html('Please enter overpayments through the Customer Payments page.');
                        $('#lblPaymentAmountValidationMessage').css('display', '');
                        isValid = false;
                  }
                  else {
                        $('#lblPaymentAmountValidationMessage').html('');
                        $('#lblPaymentAmountValidationMessage').css('display', '');
                        isValid = true;
                  }

                  if(isValid) {
                        if($('#ddPaymentType').val() == 'OfflineCc') {
                              if($('#txtOfflineCcLast4Digits').length > 0) {
                                    isValid = Check4Digits();
                              }

                              if(isValid) isValid = CheckSelectedOfflineCcType();
                        }
                  }

                  return isValid;
            };
            return;
      }

      if($('#hlShowAddPayment').length > 0) {

            var balanceDue = GILT.RemoveDirhamCurrencySign($('#BalanceDueLabel').text());

            if(balanceDue <= 0) {
                  balanceDue = GILT.RemoveDirhamCurrencySign($('#tbPaymentAmount').val());
            }

            if(balanceDue <= 0) {
                  alert(' A payment cannot be made on an Invoice with a $0 balance!');
                  return false;
            }

            var downPayment = GILT.RemoveDirhamCurrencySign($('#DownpaymentDueValue').text());
            var overCreditPayment = GILT.RemoveDirhamCurrencySign($('#hfOverCreditPaymentDue').text());

            // ***************************************************************************************************
            // *** Set payment modal as Down payment (cash customers) / Over Credit (credit customers) if > $0 ***
            // ***  Else set to Balance Due                                                                    ***
            // ***************************************************************************************************
            if((Math.round(downPayment * 100) / 100) > 0) {
                  $('#txtPaymentNotes').val('Required Downpayment');
                  $('#txtTotalPaymentAmount').val(downPayment.toFixed(2)); // Update total into modal total textbox

                  // Validation of Downpayment Range
                  ValidatePayment_Click = function() {
                        var isValid = true;

                        var paymentAmount = $('#txtTotalPaymentAmount').val();
                        if((paymentAmount < .01) || (paymentAmount > balanceDue)) {
                              var href = `/SalesModule/Accounts/Payments.aspx?acctid=${OrderProperties.AccountId}&acctname=${OrderProperties.OrderCompanyName}#divPayments`;
                              var message = `Payment cannot exceed the balance due.  To enter an over-payment, you can go to Customers > <a href="${href}">Payments</a> page.`;
                              $('#lblPaymentAmountValidationMessage').html(message);
                              //$('#lblPaymentAmountValidationMessage').html('Payment must be between $.01 and balance due');
                              $('#lblPaymentAmountValidationMessage').css('display', '');
                              return false;
                        }

                        if($('#ddPaymentType').val() == 'OfflineCc') {
                              if($('#txtOfflineCcLast4Digits').length > 0) {
                                    isValid = Check4Digits();
                              }
                              if(isValid) isValid = CheckSelectedOfflineCcType();
                        }

                        if(isValid) {
                              $('#lblPaymentAmountValidationMessage').html('');
                              $('#lblPaymentAmountValidationMessage').css('display', '');
                        }
                        return isValid;
                  };
            }
            else if((Math.round(overCreditPayment * 100) / 100) > 0) {

                  // Validation of Over credit limit
                  ValidatePayment_Click = function() {
                        var paymentAmount = $('#txtTotalPaymentAmount').val();
                        if((paymentAmount < overCreditPayment) || (paymentAmount > balanceDue)) {
                              $('#lblPaymentAmountValidationMessage').html('Payment over credit limit');
                              $('#lblPaymentAmountValidationMessage').css('display', '');
                              return false;
                        }

                        if($('#ddPaymentType').val() == 'OfflineCc') {
                              if($('#txtOfflineCcLast4Digits').length > 0) {
                                    isValid = Check4Digits();
                              }
                              if(isValid) isValid = CheckSelectedOfflineCcType();
                        }
                        if(isValid) {
                              $('#lblPaymentAmountValidationMessage').html('');
                              $('#lblPaymentAmountValidationMessage').css('display', '');
                        }
                        return isValid;

                  };

                  $('#txtPaymentNotes').val('Payment over credit limit');
                  $('#txtTotalPaymentAmount').val(overCreditPayment.toFixed(2)); // Update total into modal total textbox
            }
            else {

                  // Standard Validation
                  ValidatePayment_Click = function() {
                        var isValid = true;
                        var paymentAmount = $('#txtTotalPaymentAmount').val();
                        if((paymentAmount < .01) || (paymentAmount > balanceDue)) {
                              var href = `/SalesModule/Accounts/Payments.aspx?acctid=${OrderProperties.AccountId}&acctname=${OrderProperties.OrderCompanyName}#divPaymentReceive`;
                              var message = `Payment cannot exceed the balance due.<br /> To enter an over-payment, you can go to Customers > <a href="${href}" target="_blank">Payments</a> page.`;
                              $('#lblPaymentAmountValidationMessage').html(message);
                              //$('#lblPaymentAmountValidationMessage').html('Payment must be between $.01 and balance due');
                              $('#lblPaymentAmountValidationMessage').css('display', '');
                              return false;
                        }

                        if($('#ddPaymentType').val() == 'OfflineCc') {
                              if($('#txtOfflineCcLast4Digits').length > 0) {
                                    isValid = Check4Digits();
                              }
                              if(isValid) isValid = CheckSelectedOfflineCcType();
                        }

                        if($('#ddPaymentType').val() == 'Check') {
                              if($('#txtCheckNum').val().length <= 0) {
                                    $('#spnCheckNumberRequired').addClass('triggered');
                                    return false;
                              }
                        }
                        if(isValid) {
                              $('#lblPaymentAmountValidationMessage').html('');
                              $('#lblPaymentAmountValidationMessage').css('display', '');
                              $('#spnCheckNumberRequired').removeClass('triggered');
                        }
                        return isValid;

                  };
            }
      }
}

//Payment History Check Override Table ----------------------
var PaymentHistoryCheckOverrideTable = null;

var InitPaymentHistoryOverride_Check_OneTimeAjaxSourced = function() {

      var orderId = $('#hfOrderId').val();
      if(!ValidateVar(orderId))
            orderId = $('[id^=hfOrderId').first();

      if($('#PaymentHistoryOverride_Check').length > 0) {
            PaymentHistoryCheckOverrideTable =
                  $('#PaymentHistoryOverride_Check').dataTable({
                        'bDestroy': true,
                        "bFilter": false,
                        "bInfo": false,
                        "bPaginate": false,
                        "bSort": false,
                        'aoColumnDefs': [
                              {'bSearchable': true, 'aTargets': ['_all']}
                        ],
                        'aoColumns': [
                              {
                                    'mDataProp': 'CreatedDate', sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var returnData = oObj.aData["CreatedDate"];
                                          return returnData.Display;
                                    }
                              },
                              {'mDataProp': 'TypeLong', sClass: "PaymentHistoryStandardField"},
                              {
                                    'mDataProp': 'Amount', sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var returnData = oObj.aData["Amount"];
                                          returnData = formatMoney(returnData);
                                          return returnData;
                                    }
                              },
                              {'mDataProp': 'Notes', sClass: "PaymentHistoryStandardField"},
                              {'mDataProp': 'UpdatedByUserName', sClass: "PaymentHistoryStandardField"},
                              {
                                    'mDataProp': null, sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          //CB2-3293 - Prevent reversing payment if check transaction is part of an overpayment.
                                          if(oObj.aData.IsOverPayment == true) {
                                                return '<img class="" title="This check payment is linked to an in-store credit and cannot be reversed.  You can post individual refunds against the check and in-store credit transactions to balance." src="/Themes/Images/imgSmallQuestion.png">';
                                          }

                                          var id = oObj.aData["Id"];
                                          var parentTransactionId = oObj.aData["ParentTransactionId"];
                                          var paymentSubTypeId = oObj.aData["PaymentSubTypeId"];
                                          var RefundableAmount = oObj.aData["RefundableAmount"];
                                          var amount = oObj.aData["Amount"];
                                          amount = parseFloat(CleanAmount(amount.replace(/,/g, '')));
                                          if((parentTransactionId == undefined || parentTransactionId == '')
                                                && RefundableAmount == amount) {
                                                var paymentId = id; //oObj.aData["Id"];
                                                var paymentAmount = amount; //oObj.aData["Amount"];
                                                var paymentType = oObj.aData["Type"];
                                                var paymentCheckNumber = CheckPaymentValues(oObj.aData["CheckNumber"]);
                                                var paymentCheckIdNumber = CheckPaymentValues(oObj.aData["CheckIDNumber"]);
                                                var paymentCardDigits = CheckPaymentValues(oObj.aData["CcLast4Digits"]);
                                                paymentCheckIdNumber = paymentCheckIdNumber.replace(/\'/g, "\\\'");
                                                return '<a href="#" onclick="RemoveCheckPayments(\'' + paymentId + '\', \'' + paymentAmount + '\',\'' + paymentType + '\',\'' + paymentCheckNumber + '\',\'' + paymentCheckIdNumber + '\',\'' + paymentCardDigits + '\');">Reverse Payment</a>';
                                          } else if(RefundableAmount !== amount) {
                                                return '<img class="" title="Cannot reverse a payment that has been partially or fully refunded." src="/Themes/Images/imgSmallQuestion.png">';
                                          } else {
                                                return "";
                                          }
                                    }
                              }
                        ],
                        'aaSorting': [[0, 'asc']],
                        'bAutoWidth': false,
                        'sPaginationType': 'full_numbers',
                        'oLanguage': {
                              "sLengthMenu": "",
                              "sInfoEmpty": "",
                              "sInfoFiltered": "",
                              "sInfo": ""
                        },
                        'bLengthChange': false,
                        'iDisplayLength': 20,
                        'sAjaxSource': '/SalesModule/Reports/Reports.asmx/GetOrderPaymentsCheck',
                        'sAjaxDataProp': 'ReportResults',
                        'bDeferRender': true,
                        'fnServerData': function(sSource, aoData, fnCallback, oSettings) {
                              aoData.push({name: 'OrderId', value: orderId});
                              $.ajax({
                                    'type': 'POST',
                                    'url': sSource,
                                    'data': GetSerializedJsonParams(aoData, ['OrderId']),
                                    'contentType': 'application/json; charset=utf-8',
                                    'dataType': 'json',
                                    'success': function(data, textStatus, xmlHttpRequest) {
                                          fnCallback(data.d);
                                    },
                                    'error': function(jqxhr, textStatus, errorThrown) {
                                          alert('Error loading report from server: ' + textStatus);
                                    }
                              });
                        }
                  });
      }

};

function SetMasterCheckInformationDiv(data) {

      $("#pnlMasterCheckInformation").hide();
      if(data.d.IsSuccess) {
            $("#pnlMasterCheckInformation").show();
            $("#pnlMasterCheckInformation").empty().append("<div><b>Check#:<b/> " + data.d.MasterCheckInfo.CheckNumber + " for $" + data.d.MasterCheckInfo.AmountDisplay + "</div>");
            $("#pnlMasterCheckInformation").append("<div>Affected Invoices:</div>");
            $.each(data.d.SubCheckInfos, function(i, item) {
                  $("#pnlMasterCheckInformation").append("<div style='padding-left:4px;'>Invoice: " + item.InvoiceNumber + "&nbsp;&nbsp;&nbsp;  $" + item.AmountDisplay + "</div>");
            });
      }

      /*
      public class GetCheckWithSubCheckInformationResp : BaseResponse
      { 
      public MasterCheckInformationView MasterCheckInfo { get; set;}   
      public List<SubCheckInformationView> SubCheckInfos { get; set;}  
      }
  
      public class MasterCheckInformationView
      {
      public string CheckNumber { get; set; }
      public decimal Amount { get; set; }
      }
  
      public class SubCheckInformationView
      {
      public string InvoiceNumber { get; set; }
      public decimal Amount { get; set; }
      }
      */

      // This Payment is affected ... by 
      // Invoice Number   Amount 
      // 11111              $4
      // 11111              $4
      // 11111              $4

      //-List all affected invoices and list amounts that will be reversed
      // go get the information via a webmethod call
      //return "foobar";
}

function SetMasterCheckInformationDivFromServer(paymentId) {

      var valuesParams = '{"aSubPaymentId":' + paymentId + '}';

      $.ajax({
            type: 'POST',
            url: "/SalesModule/Orders/Order.asmx/GetCheckInformationForMasterPaymentBySubPaymentId",
            data: valuesParams,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function(msg) {

                  SetMasterCheckInformationDiv(msg);
                  //alert('succ' + msg);

            },
            error: function(msg) {
                  alert('error: ' + msg);
            }
      });

}

function RemoveCheckPayments(paymentId, paymentAmount, paymentType, paymentCheckNumber, paymentCheckIdNumber, paymentCardDigits) {

      PaymentsMode = "override_payment";

      paymentAmount = parseStringToFloat(paymentAmount);

      $('#modalAddOrderPayment').modal({position: ["12%"]});
      $('#modalAddOrderPayment').draggable({handle: '.modal-drag'});
      $("#spnOrderPaymentTitle").text("Reverse Check Payment");

      if(typeof Commonui !== 'undefined') {
            Commonui.RegisterModalMediaResponsive($('"#simplemodal-container:has(#modalAddOrderPayment)"').filter(':visible'), 'payment-modal-op-3');
      }

      if(paymentType == "ACH" || paymentType == "Wire") {
            paymentType = "EFT";
      }

      $("#ddPaymentType").val(paymentType);
      getPaymentType();
      $("#txtPreviousTotalPaymentAmount").val(formatMoney(paymentAmount));
      $("#txtTotalPaymentAmount").prop("readonly", "true");
      $("#spnOrderPaymentAmountLabel").text("Difference: ");
      $("#spnOrderPaymentNotesLabel").text("Reason For Reversing: ");
      $("#spnOrderPaymentButtonLabel").text("Reverse Payment");
      if(typeof OrderPaymentSlice != 'undefined') {
            OrderPaymentSlice.SetModal();
      }
      SetMasterCheckInformationDivFromServer(paymentId);

      $("#pnlOrderPaymentOverride").show();

      //$("#txtNewTotalPaymentAmount").val(formatMoney(paymentAmount));
      $("#txtNewTotalPaymentAmount").val('0');
      $("#txtCheckNum").val(paymentCheckNumber);
      $("#txtCheckId").val(paymentCheckIdNumber);
      $("#txtOfflineCcLast4Digits").val(paymentCardDigits);

      $("#txtPaymentNotes").val("");

      $("#hfPaymentTransactionId").val(paymentId);
      $("#hfPaymentSubTypeId").val('4'); //CbPaymentSubTypeEnum 4 - NSF

      $("#divTopPaymentEntries").hide();

      CalculateOrderPaymentDifference();

      ValidatePayment_Click = function() {return true;};

      _accountId = (typeof _accountId === 'undefined') ? $('#hfAccountId').val() : _accountId;
      if(_accountId > 0) {
            RefreshInStoreAvailableCredit(_accountId);
      }
}

//Payment History Credit Card Override Table ----------------------
var PaymentHistoryCreditCardOverrideTable = null;

var InitPaymentHistoryOverride_CreditCard_OneTimeAjaxSourced = function() {

      var orderId = $('#hfOrderId').val();
      if(!ValidateVar(orderId))
            orderId = $('[id^=hfOrderId').first();

      if($('#PaymentHistoryOverride_CreditCard').length > 0) {
            PaymentHistoryCheckOverrideTable =
                  $('#PaymentHistoryOverride_CreditCard').dataTable({
                        'bDestroy': true,
                        "bFilter": false,
                        "bInfo": false,
                        "bPaginate": false,
                        "bSort": false,
                        'aoColumnDefs': [
                              {'bSearchable': true, 'aTargets': ['_all']}
                        ],
                        'aoColumns': [
                              {
                                    'mDataProp': 'CreatedDate', sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var returnData = oObj.aData["CreatedDate"];
                                          return returnData.Display;  // returnData.Display;
                                    }
                              },
                              {'mDataProp': 'TypeLong', sClass: "PaymentHistoryStandardField"},
                              {
                                    'mDataProp': 'Amount', sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var returnData = oObj.aData["Amount"];
                                          returnData = formatMoney(returnData);
                                          return returnData;
                                    }
                              },
                              {'mDataProp': 'Notes', sClass: "PaymentHistoryStandardField"},
                              {'mDataProp': 'UpdatedByUserName', sClass: "PaymentHistoryStandardField"},
                              {
                                    'mDataProp': null, sClass: "PaymentHistoryStandardField",
                                    'fnRender': function(oObj) {
                                          var parentTransactionId = oObj.aData["ParentTransactionId"];
                                          if((parentTransactionId == undefined) || (parentTransactionId == '')) {
                                                var paymentId = oObj.aData["Id"];
                                                var paymentAmount = oObj.aData["Amount"];
                                                var paymentType = oObj.aData["Type"];
                                                //                            var paymentCheckNumber = CheckPaymentValues(oObj.aData["CheckNumber"]);
                                                //                            var paymentCheckIdNumber = CheckPaymentValues(oObj.aData["CheckIDNumber"]);
                                                var paymentCardDigits = CheckPaymentValues(oObj.aData["CcLast4Digits"]);
                                                return "<a href='#' onclick='RemoveCCPayments(\"" + paymentId + "\",\"" + paymentAmount + "\",\"" + paymentType + "\",\"" + paymentCardDigits + "\");'>Charge Back</a>";
                                          }
                                          else {
                                                return "";
                                          }
                                    }
                              }
                        ],
                        'aaSorting': [[0, 'asc']],
                        'bAutoWidth': false,
                        'sPaginationType': 'full_numbers',
                        'oLanguage': {
                              "sLengthMenu": "",
                              "sInfoEmpty": "",
                              "sInfoFiltered": "",
                              "sInfo": ""
                        },
                        'bLengthChange': false,
                        'iDisplayLength': 20,
                        'sAjaxSource': '/SalesModule/Reports/Reports.asmx/GetOrderPaymentsCreditCard',
                        'sAjaxDataProp': 'ReportResults',
                        'bDeferRender': true,
                        'fnServerData': function(sSource, aoData, fnCallback, oSettings) {
                              aoData.push({name: 'OrderId', value: orderId});
                              $.ajax({
                                    'type': 'POST',
                                    'url': sSource,
                                    'data': GetSerializedJsonParams(aoData, ['OrderId']),
                                    'contentType': 'application/json; charset=utf-8',
                                    'dataType': 'json',
                                    'success': function(data, textStatus, xmlHttpRequest) {
                                          fnCallback(data.d);
                                    },
                                    'error': function(jqxhr, textStatus, errorThrown) {
                                          alert('Error loading report from server: ' + textStatus);
                                    }
                              });
                        }
                  });
      }

};

function RemoveCCPayments(paymentId, paymentAmount, paymentType, paymentCardDigits) {

      PaymentsMode = "override_payment";

      paymentAmount = parseStringToFloat(paymentAmount);

      $('#modalAddOrderPayment').modal({position: ["12%"]});
      $('#modalAddOrderPayment').draggable({handle: '.modal-drag'});
      $("#spnOrderPaymentTitle").text("Reverse Credit Card Payment");

      if(typeof Commonui !== 'undefined') {
            Commonui.RegisterModalMediaResponsive($('"#simplemodal-container:has(#modalAddOrderPayment)"').filter(':visible'), 'payment-modal-op-4');
      }
      if(typeof OrderPaymentSlice != 'undefined') {
            OrderPaymentSlice.SetModal();
      }
      // Assumes all credit card payment are offline
      paymentType = 'OfflineCc';

      $("#ddPaymentType").val(paymentType);
      getPaymentType();
      $("#txtPreviousTotalPaymentAmount").val(formatMoney(paymentAmount));
      $("#txtTotalPaymentAmount").prop("readonly", "true");
      $("#spnOrderPaymentAmountLabel").text("Difference: ");
      $("#spnOrderPaymentNotesLabel").text("Reason For Reversing: ");
      $("#spnOrderPaymentButtonLabel").text("Reverse Payment");

      SetMasterCreditCardInformationDivFromServer(paymentId);

      $("#pnlOrderPaymentOverride").show();

      //$("#txtNewTotalPaymentAmount").val(formatMoney(paymentAmount));
      $("#txtNewTotalPaymentAmount").val('0');
      //    $("#txtCheckNum").val(paymentCheckNumber);
      //    $("#txtCheckId").val(paymentCheckIdNumber);
      $("#txtOfflineCcLast4Digits").val(paymentCardDigits);

      $("#txtPaymentNotes").val("");

      $("#hfPaymentTransactionId").val(paymentId);
      $("#hfPaymentSubTypeId").val('9'); //CbPaymentSubTypeEnum 9 - ChargeBack

      $("#divTopPaymentEntries").hide();

      CalculateOrderPaymentDifference();

      ValidatePayment_Click = function() {return true;};

      _accountId = (typeof _accountId === 'undefined') ? $('#hfAccountId').val() : _accountId;
      if(_accountId > 0) {
            RefreshInStoreAvailableCredit(_accountId);
      }
}

function SetMasterCreditCardInformationDivFromServer(paymentId) {

      var valuesParams = '{"aSubPaymentId":' + paymentId + '}';

      $.ajax({
            type: 'POST',
            url: "/SalesModule/Orders/Order.asmx/GetCreditCardInformationForMasterPaymentBySubPaymentId",
            data: valuesParams,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function(msg) {

                  SetMasterCreditCardInformationDiv(msg);
                  //alert('succ' + msg);

            },
            error: function(msg) {
                  alert('error: ' + msg);
            }
      });

}

function SetMasterCreditCardInformationDiv(data) {
      $("#pnlMasterCreditCardInformation").hide();
      if(data.d.IsSuccess) {
            $("#pnlMasterCreditCardInformation").show();
            $("#pnlMasterCreditCardInformation").empty().append("<div><b>Last 4 Digits:<b/> " + data.d.MasterCreditCardInfo.Last4Digits + " for $" + data.d.MasterCreditCardInfo.AmountDisplay + "</div>");
            $("#pnlMasterCreditCardInformation").append("<div>Affected Invoices:</div>");
            $.each(data.d.SubCreditCardInfos, function(i, item) {
                  $("#pnlMasterCreditCardInformation").append("<div style='padding-left:4px;'>Invoice: " + item.InvoiceNumber + "&nbsp;&nbsp;&nbsp;  $" + item.AmountDisplay + "</div>");
            });
      }
}

function RefundPayment() {

}

function RefundSpecificPayment() {
      PaymentsMode = "override_payment";

      $('#modalAddOrderPayment').modal({positoin: ["12%"]});
      $('#modalAddOrderPayment').draggable({handle: '.modal-drag'});
      $("#spnOrderPaymentTitle").text("Refund Payment");
      $("#ddPaymentType").val('');
      if(typeof Commonui !== 'undefined') {
            Commonui.RegisterModalMediaResponsive($('"#simplemodal-container:has(#modalAddOrderPayment)"').filter(':visible'), 'payment-modal-op-5');
      }

      getPaymentType();
      if(typeof OrderPaymentSlice != 'undefined') {
            OrderPaymentSlice.SetModal();
      }
      $("#txtPreviousTotalPaymentAmount").val('0');
      $("#spnOrderPaymentAmountLabel").text("Refund Amount:");

      $("#spnOrderPaymentNotesLabel").text("Reason For Refunding: ");
      $("#spnOrderPaymentButtonLabel").text("Process Refund");
      $("#pnlOrderPaymentOverride").hide();
      $("#txtNewTotalPaymentAmount").val('0');
      $("#txtCheckNum").val('');
      $("#txtCheckId").val('');
      $("#txtOfflineCcLast4Digits").val('');

      $("#txtPaymentNotes").val("");

      $("#hfPaymentTransactionId").val('');
      $("#hfPaymentSubTypeId").val('3'); //CbPaymentSubTypeEnum 3 - Refund

      ValidatePayment_Click = function() {return true;};

      _accountId = (typeof _accountId === 'undefined') ? $('#hfAccountId').val() : _accountId;
      if(_accountId > 0) {
            RefreshInStoreAvailableCredit(_accountId);
      }
}

function CheckShowBadDebtOption() {
      if($("#hfIsSysAdmin").length && $("#hfIsSysAdmin").val().toLowerCase() == "true") {
            var blnShowBadDebtOption = false;
            var orderId = IntOrDefault($('#hfOrderId').val());
            $("option[value='BadDebt']").remove();

            if(orderId > 0) {
                  //single payment...
                  var orderStatus = $("#OrderStatusLabel").text().toLowerCase();
                  if(orderStatus == "") {
                        orderStatus = $("#lblOrderStatus").text().toLowerCase(); //for compatibility with new OrderViewHeader.aspx page...
                  }
                  if(orderStatus == "completed") {
                        blnShowBadDebtOption = true;
                  }
            }
            else {
                  //multiple payments...
                  var checkboxes = $('.clsCbSelect input:checkbox');

                  // in the case of multiple transactions all transactions in the list must be completed
                  var allTransactionsAreCompleted = true;
                  for(var x = 0; x < checkboxes.length; x++) {
                        if($(checkboxes[x]).is(":checked")) {
                              var checkboxId = $(checkboxes[x]).prop("id");
                              var orderId = IntOrDefault(checkboxId.replace("cbSelect_", ""));
                              var orderStatus = $('#tbOrderStatus_' + orderId).text().trim();
                              if(orderStatus.toLowerCase() == "completed") {
                                    allTransactionsAreCompleted &= true;
                              }
                              else {
                                    allTransactionsAreCompleted &= false;
                              }
                        }
                  }
                  blnShowBadDebtOption = allTransactionsAreCompleted;
            }

            if(blnShowBadDebtOption) {
                  $("#ddPaymentType").append($("<option />").val("BadDebt").text("Bad Debt"));
            }

            //Make sure In-Store Credit is still the last item on the dropdown...
            if($("option[value='CustomerCredit']").length > 0) {
                  $("option[value='CustomerCredit']").remove();
                  $("#ddPaymentType").append($("<option />").val("CustomerCredit").text("In-Store Credit"));
            }
      }

}

function op_htmlEscape(str) {
      return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}


function FormatPaymentAmount(amt) {
      var amtPay = $(amt).val();
      amtPay = GILT.RemoveDirhamCurrencySign(amtPay);
      amtPay = amtPay.toFixed(2);
      $(amt).val(amtPay);
}

var customPaymentDate = {
      initialize: function() {
            $('.btn-custom-payment-date').click(function(e) {
                  e.preventDefault();
                  var $obj = $(this);
                  var id = $obj.attr('id').replace('btnCustomDate_', '');
                  customPaymentDate.edit(id);
                  //if ($obj.hasClass('fa-edit')) {
                  //    customPaymentDate.edit(id)
                  //} else {
                  //    customPaymentDate.save(id)
                  //}
            });
            $('.datepicker').datetimepicker({
                  dateFormat: GILT.GetDateFormat(true),
                  timeFormat: "hh:mm TT",
                  //onSelect: function (dateText, inst) {
                  //    if (inst == null) return;
                  //    var id = inst.id.replace('txtCustomDate_', '');
                  //    customPaymentDate.save(id)
                  //},
                  onClose: function(dateText, inst) {
                        if(inst == null) return;
                        var id = inst.id.replace('txtCustomDate_', '');
                        customPaymentDate.save(dateText, id);
                  }
            });
      },
      edit: function(id) {
            $('#btnCustomDate_' + id).hide();
            //.removeClass('fa-edit')
            //.addClass('fa-save');
            $('#txtCustomDate_' + id)
                  .attr('disabled', false)
                  .removeClass('txt-custom-payment-date-readonly')
                  .show()
                  .focus();
      },
      save: function(date, id) {
            //var date = $('#txtCustomDate_' + id).val();
            PrivateWeb.SalesModule.Reports.Reports.SaveTransactionCustomPaymentDate(id, date, function(data) {
                  var res = $.parseJSON(data);
                  if(res.IsSuccess) {
                        $('#txtCustomDate_' + id).hide();
                        if(res.CustomPaymentDate === '') {
                              $('#btnCustomDate_' + id).text('custom').show();
                        } else {
                              $('#btnCustomDate_' + id).text(res.CustomPaymentDate).show();
                        }
                  }
                  $.jGrowl(res.Message, {position: 'nearItem'});
            }, function() {
                  alert('Error at SaveTransactionCustomPaymentDate.');
            }, function() {
                  alert('Timeout at SaveTransactionCustomPaymentDate.');
            });
            console.log('saved');
      }
};