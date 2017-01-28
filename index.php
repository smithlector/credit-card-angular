<!DOCTYPE html>
<html ng-app="myApp">
	<head>
		<title>Slider - AngularJs</title>
		<link rel="stylesheet" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"/>
		<link rel="stylesheet" href="css/bootstrap.min.css"/>
		<link rel="stylesheet" href="css/credit-card-angular.css"/>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
	</head>
	<body >
		<div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2" ng-controller="CreditCardController as ccCtrl">
			<form name="timeSlotForm" id="timeSlotForm" action="#" novalidate ng-submit="timeSlotForm.$valid">
				<!-- <credit-card-input template-url=""></credit-card-input> -->
				<input type="text" ng-model="value.ccNumber" class="cc-number {{value.ccNumber | ccType}}" placeholder="Card Number" minlength="2" cc-number required/>
				
				<input ng-model="value.date" class="cc-expirydate" placeholder="MM/YY" cc-date required/>
				<input ng-model="value.cvv" class="cc-cvv" placeholder="CVV" cc-cvv required/>
				
				<button type="submit">submit</button>
			</form>
		</div>
		
		<script type="text/javascript" src="script/mask.js"></script>
		<script type="text/javascript" src="script/credit-card-angular.js"></script>
		<script type="text/javascript" src="script/script.js"></script>
	</body>
</html>