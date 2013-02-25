var app = angular.module('myApp', []);

app.directive('formItem', function ($compile) {
  
	var templates = {
		chromeStart:'',
		chromeEnd:'',
		text: '<label for="{{content.name}}">{{content.label}}</label><input type="text" name="{{content.name}}" ng-init="applyModels()"/>'
	}

    var getTemplate = function(type) {
		var tmp = '';
		if (templates.chromeStart != undefined){ tmp += templates.chromeStart; }
		tmp += templates[type];
		if (templates.chromeEnd != undefined){ tmp += templates.chromeEnd; }
        return tmp;
    }

    var linker = function(scope, element, attrs) {
        element.html(getTemplate(scope.content.type)).show();
        $compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        rep1ace: true,
        link: linker,
        scope: {
            content:'='
        }
    };
});

function FormCtrl($scope, $http) {
    "use strict";

    $scope.url = 'content.json';

    $scope.fetchData = function() {
        $http.get($scope.url).then(function(result){
            $scope.formSchema = result.data;
        });
    }
	$scope.serialize = function(){
	$scope.applyModels();
		console.log($scope);
	}
	$scope.applyModels = function(){
		
		console.log('Apply!');
	}
    $scope.fetchData();
}

