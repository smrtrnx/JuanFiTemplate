var errorCodeMap = []; 
errorCodeMap['coins.wait.expired'] = 'Coin slot expired';
errorCodeMap['coin.not.inserted'] = 'Coin not inserted';
errorCodeMap['coinslot.cancelled'] = 'Coinslot was cancelled';
errorCodeMap['coinslot.busy'] = 'Coin slot is busy';
errorCodeMap['coin.slot.banned'] = 'You have been banned from using coin slot, due to multiple request for insert coin, please try again later!';
errorCodeMap['coin.slot.notavailable'] = 'Coin slot is not available as of the moment, Please try again later';
errorCodeMap['no.internet.detected'] = 'No internet connection as of the moment, Please try again later';
var totalCoinReceived = 0;

var insertcoinbg = new Audio('/dist/assets/mp3/insertcoinbg.mp3'); //uncomment this line if you are in the development mode
// var insertcoinbg = new Audio('assets/mp3/insertcoinbg.mp3'); //comment this line if you are in the development mode
insertcoinbg.loop = true;
var coinCount = new Audio('/dist/assets/mp3/coin-received.mp3'); //uncomment thisline if you are in the development mode
// var coinCount = new Audio('assets/mp3/coin-received.mp3'); //comment this line if you are in the development mode
var voucher = getStorageValue('activeVoucher');
var insertingCoin = false;

$(document).ready(function(){
  $( "#saveVoucherButton" ).prop('disabled', true);	
  $( "#cncl" ).prop('disabled', false);
  $('#coinToast').toast({delay: 1000, animation: true});
  $('#coinSlotError').toast({delay: 5000, animation: true});
  
  $('#insertCoinModal').on('hidden.bs.modal', function () {
		clearInterval(timer);
		timer = null;
		insertingCoin = false;
		insertcoinbg.pause();
		insertcoinbg.currentTime = 0.0;
		if(totalCoinReceived == 0){
			$.ajax({
			  type: "POST",
			  url: "http://"+vendorIpAddress+"/cancelTopUp",
			  data: "voucher="+voucher+"&mac="+mac,
			  success: function(data){
				$("#loaderDiv").attr("class","spinner hidden");
			  },error: function (jqXHR, exception) {
				$("#loaderDiv").attr("class","spinner hidden");
			  }
			});
		}
		
	});

	if(loginError != "" && ((voucher != null && voucher != ""))){
		
		removeStorageValue("activeVoucher");
		voucher = "";
		$.toast({
			title: 'Error',
			content: "Invalid voucher, please make sure voucher is valid",
			type: 'error',
			delay: 5000
		});
	}
  
  if(isMultiVendo){
	  for(var i=0;i<multiVendoAddresses.length;i++){
		  $("#vendoSelected").append($('<option>', {
			value: multiVendoAddresses[i].vendoIp,
			text: multiVendoAddresses[i].vendoName
		  }));
	  }
	  var selectedVendo = getStorageValue('selectedVendo');
	  if(selectedVendo != null){
		  vendorIpAddress = selectedVendo;
	  }
	  $("#vendoSelected").val(vendorIpAddress);
	  $("#vendoSelected").change(function(){
		vendorIpAddress = $("#vendoSelected").val();
		setStorageValue('selectedVendo', vendorIpAddress);
	  });
	  
	  $("#vendoSelected").trigger("change");

  }else{
	  $("#vendoSelectDiv").attr("style", "display: none");
  }
  
  if(!dataRateOption){
	 $("#dataInfoDiv").attr("style", "display: none");
	 $("#dataInfoDiv2").attr("style", "display: none");
  }
});
if(voucher == null){
	voucher = "";
}
if(voucher != ""){
	$('#voucherInput').val(voucher);
}

function promoBtnAction(){
	$('#promoRatesModal').modal('show');
	return false;
}

//this is to enable multi vendo setup, set to true when multi vendo is supported
var isMultiVendo = false;

//list here all node mcu address for multi vendo setup
var multiVendoAddresses = [
	{
		vendoName: "Vendo 1", //change accordingly to your vendo name
		vendoIp: "10.0.0.2" //change accordingly to your vendo name
	},
	{
		vendoName: "Vendo 2", //change accordingly to your vendo name
		vendoIp: "10.0.10.254" //change accordingly to your vendo name
	}
];

//0 means its login by username only, 1 = means if login by username + password
var loginOption = 0; //replace 1 if you want login voucher by username + password

var dataRateOption = false; //replace true if you enable data rates
//put here the default selected address
var vendorIpAddress = "10.0.0.2";
var timer = null;

function insertBtnAction(){
	$("#progressDiv").attr('style','width: 100%')
	$( "#saveVoucherButton" ).prop('disabled', true);
	$( "#cncl" ).prop('disabled', false);
	$("#loaderDiv").attr("class","spinner");
	totalCoinReceived = 0;
	
	var totalCoinReceivedSaved = getStorageValue("totalCoinReceived");
	if(totalCoinReceivedSaved != null){
		totalCoinReceived = totalCoinReceivedSaved;
	}
	
	$('#totalCoin').html("0");
	$('#totalTime').html(secondsToDhms(parseInt(0)));
	callTopupAPI(0);
	return false;
}

$('#promoRatesModal').on('shown.bs.modal', function (e) {
  $.ajax({
	  type: "GET",
	  url: "http://"+vendorIpAddress+"/getRates?date="+(new Date().getTime()),
	  crossOrigin: true,
	  contentType: 'text/plain',
	  success: function(data){
		var rows = data.split("|");
		var rates = "";
		
		for(r in rows){
			var columns = rows[r].split("#");
			rates = rates + "<tr>";
			rates = rates + "<td>";
			rates = rates + columns[0];
			rates = rates + "</td>";
			rates = rates + "<td>";
			rates = rates + secondsToDhms(parseInt(columns[3])*60);
			rates = rates + "</td>";
			rates = rates + "</tr>";
		}
		
		$("#ratesBody").html(rates);
	  }
	});
})

function callTopupAPI(retryCount){
	
	var type = $( "#saveVoucherButton" ).attr('data-save-type');
	if(type != "extend" && totalCoinReceived == 0){
		var storedVoucher = getStorageValue('activeVoucher');
		if(storedVoucher != null){
			voucher = "";
			$("#voucherInput").val('');
			removeStorageValue("activeVoucher");
		}
		
	}
	
	$.ajax({
	  type: "POST",
	  url: "http://"+vendorIpAddress+"/topUp",
	  data: "voucher="+voucher+"&mac="+mac,
	  success: function(data){
		$("#loaderDiv").attr("class","spinner hidden");
		if(data.status == "true"){
			voucher = data.voucher;
			$('#insertCoinModal').modal('show');
			insertingCoin = true;
			$('#codeGenerated').html(voucher);
			$('#codeGeneratedBlock').attr('style', 'display: none');
			if(timer == null){
				timer = setInterval(checkCoin, 1000);
			}
			if(isMultiVendo){
				$("#insertCoinModalTitle").html("Please insert the coin on "+$("#vendoSelected option:selected").text());
			}
			insertcoinbg.play();
		}else{
			notifyCoinSlotError(data.errorCode);
			clearInterval(timer);
			timer = null;
		}
	  },error: function (jqXHR, exception) {
		  setTimeout(function() {
			if(retryCount < 2){
				callTopupAPI(retryCount+1);
			}else{
				$("#loaderDiv").attr("class","spinner hidden");
				notifyCoinSlotError("coin.slot.notavailable");
			}
		  }, 1000 );
	  }
	});
}

function saveVoucherBtnAction(){
	$("#loaderDiv").attr("class","spinner");
	setStorageValue('activeVoucher', voucher);
	removeStorageValue("totalCoinReceived");
	$('#voucherInput').val(voucher);
	clearInterval(timer);
	timer = null;
	insertcoinbg.pause();
	insertcoinbg.currentTime = 0.0;
	$.ajax({
	  type: "POST",
	  url: "http://"+vendorIpAddress+"/useVoucher",
	  data: "voucher="+voucher,
	  success: function(data){
		totalCoinReceived = 0;
		$("#loaderDiv").attr("class","spinner hidden");
		if(data.status == "true"){
			
			setStorageValue(voucher+"tempValidity", data.validity);
			
			$.toast({
			  title: 'Success',
			  content: 'Thank you for the purchase!, will do auto login shortly',
			  type: 'success',
			  delay: 3000
			});
			
			var type = $( "#saveVoucherButton" ).attr('data-save-type');

			if(type == "extend"){
				setStorageValue('reLogin', '1');
				document.logout.submit();
			}else{
				setTimeout(function (){
					doLogin();
				}, 3000);
			}
			
		}else{
			notifyCoinSlotError(data.errorCode);
		}
	  },error: function (jqXHR, exception) {
		 $("#loaderDiv").attr("class","spinner hidden");
		 if(totalCoinReceived > 0){
		    $.toast({
			  title: 'Warning',
			  content: 'Connect/Login failed, however coin has been process, please manually connect using this voucher: '+voucher,
			  type: 'info',
			  delay: 8000
			});
		 }
	  }
	});
	
}

function checkCoin(){
	$.ajax({
	  type: "POST",
	  url: "http://"+vendorIpAddress+"/checkCoin",
	  data: "voucher="+voucher,
	  success: function(data){
		
		if(data.status == "true"){
			totalCoinReceived = parseInt(data.totalCoin);
			$('#totalCoin').html(data.totalCoin);	
			$('#totalTime').html(secondsToDhms(parseInt(data.timeAdded)));
			$('#codeGeneratedBlock').attr('style', 'display: block');
			$('#totalData').html(data.data);
			
			setStorageValue('activeVoucher', voucher);
			setStorageValue('totalCoinReceived', totalCoinReceived);
			setStorageValue(voucher+"tempValidity", data.validity);
			
			$('#voucherInput').val(voucher);
			notifyCoinSuccess(data.newCoin);
		}else{
			if(data.errorCode == "coin.not.inserted"){
				setStorageValue(voucher+"tempValidity", data.validity);
				
				var remainTime = parseInt(parseInt(data.remainTime)/1000);
				var waitTime = parseFloat(data.waitTime);
				var percent = parseInt(((remainTime*1000) / waitTime) * 100);
				totalCoinReceived = parseInt(data.totalCoin);
				if(totalCoinReceived > 0 ){
					$( "#saveVoucherButton" ).prop('disabled', false);
					$( "#cncl" ).prop('disabled', true);
				}
				if(remainTime == 0){
					$('#insertCoinModal').modal('hide');
					insertcoinbg.pause();
					insertcoinbg.currentTime = 0.0;
					if(totalCoinReceived > 0){
						$.toast({
						  title: 'Success',
						  content: 'Coin slot expired!, but was able to succesfully process the coin '+totalCoinReceived +", will do auto login shortly",
						  type: 'info',
						  delay: 5000
						});
						
						var type = $( "#saveVoucherButton" ).attr('data-save-type');
						setTimeout(function (){

							if(type == "extend"){
								setStorageValue('reLogin', '1');
								document.logout.submit();
							}else{
								doLogin();
							}
						}, 3000);
					}else{
						notifyCoinSlotError('coins.wait.expired');
					}
				}else{
					totalCoinReceived = parseInt(data.totalCoin);
					if(totalCoinReceived > 0 ){
						$( "#saveVoucherButton" ).prop('disabled', false);
						$( "#cncl" ).prop('disabled', true);
						$('#codeGeneratedBlock').attr('style', 'display: block');
					}
					$('#totalCoin').html(data.totalCoin);
					$('#totalData').html(data.data);
					$('#totalTime').html(secondsToDhms(parseInt(data.timeAdded)));
					//$( "#remainingTime" ).html(remainTime);
					$("#progressDiv").attr('style','width: '+percent+'%')
				}
				
			}else if(data.errorCode == "coinslot.busy"){
				//when manually cleared the button
				insertcoinbg.pause();
				insertcoinbg.currentTime = 0.0;
				notifyCoinSlotError("coinslot.cancelled");
				clearInterval(timer);
				$('#insertCoinModal').modal('hide');
			}else{
				notifyCoinSlotError(data.errorCode);
				clearInterval(timer);
			}
		}
	  },error: function (jqXHR, exception) {
			console.log('error!!!');
	  }
	});
}

function notifyCoinSlotError(errorCode){
	$.toast({
	  title: 'Error',
	  content: errorCodeMap[errorCode],
	  type: 'error',
	  delay: 5000
	});
}

function notifyCoinSuccess(coin){
	$.toast({
	  title: 'Coin inserted',
	  content: coin+' peso(s) was inserted',
	  type: 'success',
	  delay: 2000
	});
	coinCount.play();
}

function secondsToDhms(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600*24));
	var h = Math.floor(seconds % (3600*24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);

	var dDisplay = d > 0 ? d + (d == 1 ? " Day " : " Days ") : "0 Day ";
	var hDisplay = h > 0 ? h + (h == 1 ? " Hour " : " Hours ") : "0 Hour ";
	var mDisplay = m > 0 ? m + (m == 1 ? " Min " : " Mins ") : "0 Min ";
	var sDisplay = s > 0 ? s + (s == 1 ? " Sec" : " Secs") : "0 Sec ";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

function setStorageValue(key, value){
	if(localStorage != null){
		localStorage.setItem(key, value);
	}else{
		setCookie(key,value,364);
	}
}

function removeStorageValue(key){
	if(localStorage != null){
		localStorage.removeItem(key);
	}else{
		eraseCookie(key);
	}
}

function getStorageValue(key){
	if(localStorage!= null){
		return localStorage.getItem(key);
	}else{
		return getCookie(key);
	}
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

//TOAST

(function(a) {
    function f(b) {
        if (!a("#toast-container").length) {
            var d = "top-right top-left top-center bottom-right bottom-left bottom-center".split(" ").indexOf(a.toastDefaults.position) > -1 ? a.toastDefaults.position : "top-right";
            a("body").prepend('<div id="toast-container" class="toast-container" aria-live="polite" aria-atomic="true"></div>');
            a("#toast-container").addClass(d)
        }
        d = a("#toast-container");
        var c = "",
            e = c = "",
            g = b.id || "toast-" + l,
            t = b.type,
            u = b.title,
            m = b.subtitle,
            n = b.content,
            h = b.img,
            p = b.delay ? 'data-delay="' +
            b.delay + '"' : 'data-autohide="false"',
            q = "",
            r = a.toastDefaults.dismissible,
            v = a.toastDefaults.style.toast,
            k = !1;
        "undefined" !== typeof b.dismissible && (r = b.dismissible);
        switch (t) {
            case "info":
                e = a.toastDefaults.style.info || "bg-info";
                c = a.toastDefaults.style.info || "text-white";
                break;
            case "success":
                e = a.toastDefaults.style.success || "bg-success";
                c = a.toastDefaults.style.info || "text-white";
                break;
            case "warning":
                e = a.toastDefaults.style.warning || "bg-warning";
                c = a.toastDefaults.style.warning || "text-white";
                break;
            case "error":
                e =
                    a.toastDefaults.style.error || "bg-danger", c = a.toastDefaults.style.error || "text-white"
        }
        a.toastDefaults.pauseDelayOnHover && b.delay && (p = 'data-autohide="false"', q = 'data-hide-after="' + (Math.floor(Date.now() / 1E3) + b.delay / 1E3) + '"');
        c = '<div id="' + g + '" class="toast ' + v + '" role="alert" aria-live="assertive" aria-atomic="true" ' + p + " " + q + '><div class="toast-header ' + (e + " " + c + '">');
        h && (c += '<img src="' + h.src + '" class="mr-2 ' + (h["class"] || "") + '" alt="' + (h.alt || "Image") + '">');
        c += '<strong class="mx-auto">' + u + "</strong>";
        m && (c += '<small class="text-white">' + m + "</small>");
        r && (c += '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>');
        c += "</div>";
        n && (c += '<div class="toast-body">\n                        ' + n + "\n                    </div>");
        c += "</div>";
        a.toastDefaults.stackable || d.find(".toast").each(function() {
            a(this).remove()
        });
        d.append(c);
        d.find(".toast:last").toast("show");
        a.toastDefaults.pauseDelayOnHover && (setTimeout(function() {
            k || a("#" + g).toast("hide")
        }, b.delay), a("body").on("mouseover", "#" + g, function() {
            k = !0
        }), a(document).on("mouseleave", "#" + g, function() {
            var w = Math.floor(Date.now() / 1E3),
                x = parseInt(a(this).data("hideAfter"));
            k = !1;
            w >= x && a(this).toast("hide")
        }));
        l++
    }
    a.toastDefaults = {
        position: "top-right",
        dismissible: !0,
        stackable: !0,
        pauseDelayOnHover: !0,
        style: {
            toast: "",
            info: "",
            success: "",
            warning: "",
            error: ""
        }
    };
    a("body").on("hidden.bs.toast", ".toast", function() {
        a(this).remove()
    });
    var l = 1;
    a.snack = function(b, d, c) {
        return f({
            type: b,
            title: d,
            delay: c
        })
    };
    a.toast = function(b) {
        return f(b)
    }
})(jQuery);
