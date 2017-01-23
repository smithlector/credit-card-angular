(function(window, document, undefined) {
	'use strict';
	angular.module('myApp', ['ular.greyGoose'])
	.controller('CreditCardController', ['$scope', function($scope){
		$scope.value = [];
	}]);
})(window, document);