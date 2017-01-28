(function (window, document, undefined) {
	'use strict';
	angular.module('ular.greyGoose.addMask', []).provider('$addMask', function () {
		var defaults = this.defaults = {
			numberLen: 16,
			dateLen: 5,
			cvvLen: 3,
			numbers: /[^0-9]+/g
		};
		this.$get = ['$window', '$rootScope', 'ccTypeFilter', 'ccLengthFilter', function ($window, $rootScope, ccTypeFilter, ccLengthFilter){
			function CCardFactory(config){
				var $ccard = {};
				var options = $ccard.$options = config;
				console.log(options);
				var scope = $ccard.$scope = options.scope;
				scope.year = new Date().getFullYear().toString().substr(2,2);
				scope.month = new Date().getMonth() + 1;
				//scope.ctrlDown = false;
				$ccard.init = function (){
					if('ccNumber' in options.attr){
						options.element.bind('keyup', scope.$ccNumberKeyup);
						options.element.bind('paste', scope.$ccNumberPaste);
					}
					if('ccDate' in options.attr){
						options.element.attr('maxlength', '5');
						options.element.bind('keypress', scope.maskExpiryDate);
						options.element.bind('keyup', scope.$validDate);
					}
					if('ccCvv' in options.attr){
						options.element.attr('minlength', '3');
						options.element.attr('maxlength', '4');
					}
					options.element.bind('keypress', scope.$isNumber);
					//angular.element(document).bind('keydown', scope.ctrlKeyDown);
					//angular.element(document).bind('keyup', scope.ctrlKeyUp);
				};
				/* scope.ctrlKeyDown = function(e){
					var ctrlKey = 17, cmdKey = 91;
					if(e.keyCode == ctrlKey || e.keyCode == cmdKey){
						scope.ctrlDown = true;
					}
				};
				scope.ctrlKeyUp = function(e){
					var ctrlKey = 17, cmdKey = 91;
					if(e.keyCode == ctrlKey || e.keyCode == cmdKey){
						scope.ctrlDown = false;
					}
				}; */
				scope.$ccNumberKeyup = function (e){
					scope.$numberLength = ccLengthFilter(ccTypeFilter(this.value.substring(0, 4)));
					if(scope.$numberLength == 16){
						this.value = scope.maskSixteen(this.value);
						options.element.attr('maxlength', (scope.$numberLength + 3));
					}else if(scope.$numberLength == 15){
						this.value = scope.maskFifteen(this.value);
						options.element.attr('maxlength', (scope.$numberLength + 2));
					}else{
						this.value = scope.maskFourteen(this.value);
						options.element.attr('maxlength', (scope.$numberLength + 2));
					}
				};
				scope.$ccNumberPaste = function(event){
					event.stopPropagation();
					event.preventDefault();
					var pastedData = event.clipboardData.getData('Text');
					console.log(pastedData);
					/* options.element.unbind('keyup', scope.$ccNumberKeyup);
					console.log(this.value);
					var numberLength = ccLengthFilter(ccTypeFilter(this.value.substring(0, 4)));
					var val = this.value.replace(' ', '');
					if(numberLength == 16){
						val = val.splice(4, 0, ' ');
						val = val.splice(9, 0, ' ');
						val = val.splice(14, 0, ' ');
					}else if(numberLength == 15){
						val = val.splice(4, 0, ' ');
						val = val.splice(11, 0, ' ');
					}else{
						val = val.splice(4, 0, ' ');
						val = val.splice(11, 0, ' ');
					}
					this.value = val;
					options.element.bind('keyup', scope.$ccNumberKeyup); */
				};
				scope.maskSixteen = function (val){
					if(val.length > 4 && val.length < 9){
						if(val.charAt(4) !== ' '){
							val = val.splice(4, 0, ' ');
						}
					}else if(val.length > 9 && val.length < 14){
						if(val.charAt(9) !== ' '){
							val = val.splice(9, 0, ' ');
						}
					}else if(val.length > 14 && val.length < 19){
						if(val.charAt(14) !== ' '){
							val = val.splice(14, 0, ' ');
						}
					}
					return val;
				};
				scope.maskFifteen = function (val){
					if(val.length > 4 && val.length < 11){
						if(val.charAt(4) !== ' '){
							val = val.splice(4, 0, ' ');
						}
					}else if(val.length > 11 && val.length < 17){
						if(val.charAt(11) !== ' '){
							val = val.splice(11, 0, ' ');
						}
					}
					return val;
				};
				scope.maskFourteen = function (val){
					if(val.length > 4 && val.length < 11){
						if(val.charAt(4) !== ' '){
							val = val.splice(4, 0, ' ');
						}
					}else if(val.length > 11 && val.length < 16){
						if(val.charAt(11) !== ' '){
							val = val.splice(11, 0, ' ');
						}
					}
					return val;
				};
				scope.maskExpiryDate = function (event){
					if(this.value.length == 2 && event.which != 8){
						this.value = this.value.splice(2, 0, '/');
					}
					return this.value;
				};
				scope.$isNumber = function (event){
					event = (event) ? event : window.event;
					var charCode = (event.which) ? event.which : event.keyCode;
					if (charCode > 31 && (charCode < 48 || charCode > 57)) {
						event.preventDefault();
					}
					return true;
				};
				scope.$validDate = function (event){
					if(this.value.length == 5){
						var getMY = this.value.split('/');
						if(getMY[1] < scope.year){
							this.value = getMY[0]+'/';
						}else if(getMY[1] == scope.year && getMY[0] < scope.month){
							this.value = '';
						}
					}
					if((this.value.length == 2) && (this.value > 12 || this.value < 1)){
						this.value = '';
					}
					if((this.value.length == 1) && (this.value > 1)){
						this.value = '';
					}
				};
				String.prototype.splice = function (idx, rem, str) {
					return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
				};
				$ccard.init();
				return $ccard;
			}
			function findElement(query, element) {
				return angular.element((element || document).querySelector(query));
			}
			return CCardFactory;
		}];
	}).filter('ccType', [function (){
		return function (ccnumber) {
			if(!ccnumber){
				return '';
			}
			var cardType;
			ccnumber = ccnumber.toString().replace(/\s+/g, '');

			if(/^(34)|^(37)/.test(ccnumber)) {
				cardType = "american-express";
			}
			if(/^(62)|^(88)/.test(ccnumber)) {
				cardType = "china-unionpay";
			}
			if(/^30[0-5]/.test(ccnumber)) {
				cardType = "diners-club-carte-blanche";
			}
			if(/^(2014)|^(2149)/.test(ccnumber)) {
				cardType = "diners-club-enroute";
			}
			if(/^36/.test(ccnumber)) {
				cardType = "diners-club-international";
			}
			if(/^(6011)|^(622(1(2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9([01][0-9]|2[0-5])))|^(64[4-9])|^65/.test(ccnumber)){
				cardType = "discover-card";
			}
			if(/^35(2[89]|[3-8][0-9])/.test(ccnumber)) {
				cardType = "jcb";
			}
			if(/^(6304)|^(6706)|^(6771)|^(6709)/.test(ccnumber)) {
				cardType = "laser";
			}
			if(/^(5018)|^(5020)|^(5038)|^(5893)|^(6304)|^(6759)|^(6761)|^(6762)|^(6763)|^(0604)/.test(ccnumber)) {
				cardType = "maestro";
			}
			if(/^5[1-5]/.test(ccnumber)) {
				cardType = "mastercard";
			}
			if (/^4/.test(ccnumber)) {
				cardType = "visa";
			}
			if (/^(4026)|^(417500)|^(4405)|^(4508)|^(4844)|^(4913)|^(4917)/.test(ccnumber)) {
				cardType = "visa-electron";
			}
			return cardType;
		};
	}]).filter('ccLength', ['ccTypeFilter', function (ccTypeFilter){
		return function (cctype){
			var maxLength = 0;
			switch(cctype){
				case 'american-express' :
					maxLength = 15;
					break;
				default:
					maxLength = 16;
					break;
			}
			return maxLength;
		};
	}]).directive('ccNumber', ['$addMask', function ($addMask){
		return {
			restrict : 'A',
			scope: true,
			link: function (scope, element, attr) {
				$addMask({'scope':scope, 'element':element, 'attr':attr});
			}
		};
	}]).directive('ccDate', ['$addMask', function ($addMask){
		return {
			restrict : 'A',
			scope: true,
			link: function (scope, element, attr) {
				$addMask({'scope':scope, 'element':element, 'attr':attr});
			}
		};
	}]).directive('ccCvv', ['$addMask', function ($addMask){
		return {
			restrict : 'A',
			scope: true,
			link: function (scope, element, attr) {
				$addMask({'scope':scope, 'element':element, 'attr':attr});
			}
		};
	}]);
	angular.module('ular.greyGoose', [ 'ular.greyGoose.addMask' ]);
})(window, document);