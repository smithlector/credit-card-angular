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
				scope.$numberLength = options.numberLen
				scope.$value = '';
				scope.$maskingWrapper = '9999 9999 9999 9999';
				//console.log('asdasd asdasd');
				//console.log(options.element);
				/* var elemNumb = {}, elemDate = {}, elemCvv = {};
				elemNumb.elem = angular.element(document.querySelector('[cc-number]'));
				elemNumb.elem.bind('keyup', function(e){
					this.value = this.value.replace(options.numbers, '');
					console.log(ccTypeFilter(this.value));
					console.log(ccLengthFilter(ccTypeFilter(this.value)));
					scope.$numberLength = ccLengthFilter(ccTypeFilter(this.value));
				}); */
				
				var elemNumb = findElement('[cc-number]');
				$ccard.init = function(){
					elemNumb.bind('keyup', scope.$numberKeyup);
					//console.log(options.attr);
					//container.bind('mouseleave', scope.$onMouseLeave);
				};
				scope.$numberKeyup = function(e){
					var numb = this.value.replace(options.numbers, '');
					console.log(ccTypeFilter(numb));
					scope.$numberLength = ccLengthFilter(ccTypeFilter(numb));
					if(scope.$numberLength == 16){
						scope.$maskingWrapper = '9999 9999 9999 9999';
					}else if(scope.$numberLength == 15){
						scope.$maskingWrapper = '9999 9999999 9999';
					}
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
			cardType = "American Express";
		  }
		  if(/^(62)|^(88)/.test(ccnumber)) {
			cardType = "China UnionPay";
		  }
		  if(/^30[0-5]/.test(ccnumber)) {
			cardType = "Diners Club Carte Blanche";
		  }
		  if(/^(2014)|^(2149)/.test(ccnumber)) {
			cardType = "Diners Club enRoute";
		  }
		  if(/^36/.test(ccnumber)) {
			cardType = "Diners Club International";
		  }
		  if(/^(6011)|^(622(1(2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9([01][0-9]|2[0-5])))|^(64[4-9])|^65/.test(ccnumber)){
			cardType = "Discover Card";
		  }
		  if(/^35(2[89]|[3-8][0-9])/.test(ccnumber)) {
			cardType = "JCB";
		  }
		  if(/^(6304)|^(6706)|^(6771)|^(6709)/.test(ccnumber)) {
			cardType = "Laser";
		  }
		  if(/^(5018)|^(5020)|^(5038)|^(5893)|^(6304)|^(6759)|^(6761)|^(6762)|^(6763)|^(0604)/.test(ccnumber)) {
			cardType = "Maestro";
		  }
		  if(/^5[1-5]/.test(ccnumber)) {
			cardType = "MasterCard";
		  }
		  if (/^4/.test(ccnumber)) {
			cardType = "Visa"
		  }
		  if (/^(4026)|^(417500)|^(4405)|^(4508)|^(4844)|^(4913)|^(4917)/.test(ccnumber)) {
			cardType = "Visa Electron"
		  }
		  //return ccnumber + " is a(n) " + cardType + " and it's " + valid;
		  return cardType;
		};
	}]).filter('ccLength', ['ccTypeFilter', function(ccTypeFilter){
		return function (cctype){
			var maxLength = 0;
			switch(cctype){
				case 'JCB' :
					maxLength = 14;
					break;
				case 'American Express' :
					maxLength = 15;
					break;
				default:
					maxLength = 16;
					break;
			}
			return maxLength;
		};
	}]).directive('creditCardInput', ['$sce', '$ccard', function($sce, $ccard){
		return {
			restrict : 'EA',
			templateUrl : 'template/template.html',
			scope: true,
			link: function(scope, element, attr, transclusion) {
				$ccard({scope, element, attr});
			}
		};
	}]);
	angular.module('ular.greyGoose', [ 'ular.greyGoose.ccard' ]);
})(window, document);