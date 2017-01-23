(function(window, document, undefined) {
	'use strict';
	angular.module('ular.greyGoose.ccard', [])
	.provider('$ccard', function () {
		var defaults = this.defaults = {
			numberLen: 16,
			dateLen: 5,
			cvvLen: 3,
			numbers: /[^0-9]+/g
		};
		this.$get = ['$window', '$rootScope', 'ccTypeFilter', 'ccLengthFilter', function($window, $rootScope, ccTypeFilter, ccLengthFilter){
			function CCardFactory(config){
				var $ccard = {};
				var options = $ccard.$options = angular.extend({}, defaults, config);
				var scope = $ccard.$scope = options.scope;
				scope.$addClass = '';
				$ccard.init = function(){
					options.element.bind('keyup', scope.$numberKeyup);
					console.log(options);
				};
				scope.$numberKeyup = function(e){
					var key = e.charCode ? e.charCode : e.keyCode;
					if ((key >= 48 && key <= 57) || key === 9 || key === 46){
						var regexp = /[0-9]\\s/g;
						if (!(regexp.test(this.value))) {
							e.preventDefault();
						}
					}
					scope.$numberLength = ccLengthFilter(ccTypeFilter(this.value.substring(0, 4)));
					scope.$addClass = ccTypeFilter(this.value.substring(0, 4));
					if(scope.$numberLength == 16){
						this.value = scope.maskSixteen(this.value);
						options.element.attr('maxlength', scope.$numberLength);
					}else if(scope.$numberLength == 15){
						this.value = scope.maskFifteen(this.value);
						options.element.attr('maxlength', scope.$numberLength);
					}else{
						this.value = scope.maskFourteen(this.value);
						options.element.attr('maxlength', scope.$numberLength);
					}
				};
				scope.maskSixteen = function(val){
					//return val;
					var patern = /\s/g;
					if(val.length > 4 && val.length < 6){
						val = val.splice(4, 0, ' ');
						val = val.replace(patern, ' ');
					}else if(val.length > 9 && val.length < 12){
						val = val.splice(9, 0, ' ');
						val = val.replace(patern, ' ');
					}else if(val.length > 14){
						val = val.splice(14, 0, ' ');
						val = val.replace(patern, ' ');
					}
					return val;
				}
				scope.maskFifteen = function(val){
					return val;
				}
				scope.maskFourteen = function(val){
					return val;
				}
				scope.maskExpiryDate = function(val){
					return val;
				}
				String.prototype.splice = function(idx, rem, str) {
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
	}).filter('ccType', [function(){
		return function (ccnumber) {
		  if (!ccnumber) { return ''; }
		  var len = ccnumber.length;
		  var cardType, valid;
		  ccnumber = ccnumber.toString().replace(/\s+/g, '');

		  if(/^(34)|^(37)/.test(ccnumber)) {
			cardType = "american-express";
		  }
		  if(/^(62)|^(88)/.test(ccnumber)) {
			cardType = "china-unionpay";/*China UnionPay*/
		  }
		  if(/^30[0-5]/.test(ccnumber)) {
			cardType = "diners-club-carte-blanche";
		  }
		  if(/^(2014)|^(2149)/.test(ccnumber)) {
			cardType = "diners-club-enroute";/*Diners Club enRoute*/
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
			cardType = "visa"
		  }
		  if (/^(4026)|^(417500)|^(4405)|^(4508)|^(4844)|^(4913)|^(4917)/.test(ccnumber)) {
			cardType = "visa-electron"
		  }
		  //return ccnumber + " is a(n) " + cardType + " and it's " + valid;
		  return cardType;
		};
	}]).filter('ccLength', ['ccTypeFilter', function(ccTypeFilter){
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
	}]).directive('ccNumber', ['$sce', '$ccard', function($sce, $ccard){
		return {
			restrict : 'A',
			scope: true,
			link: function(scope, element, attr, transclusion) {
				$ccard({scope, element, attr});
			}
		};
	}]);
	angular.module('ular.greyGoose', [ 'ular.greyGoose.ccard' ]);
})(window, document);