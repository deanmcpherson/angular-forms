var app = angular.module('myApp', []);
var form = {};

app.directive('formItem', function ($compile) {
  
	var templates = {
		chromeStart:'',
		chromeEnd:'',
		text: function(content){return '<label for="{{content.name}}">{{content.label}}</label><input type="text" name="{{content.name}}" ng-model="content.value" />'; },
		select: function(content){return '<label for="{{content.name}}">{{content.label}}</label><select name="{{content.name}}" ng-model="content.value" ng-options="i.v as i.k for i in content.values"/>'; },
		subform: function(content){ var base = '<subform name="{{content.name}}"><form-item ng-repeat="item in content.fields" content="item"></form-item></subform>';
			if(content.repeat != undefined) {
				var result = '';
				for ( var x = 0; x < content.repeat; x++){
					result += base;
				}
				return result;
			} else {
				return base;
			}
		}
	}

    var getTemplate = function(content) {
		var tmp = '';
		if (templates.chromeStart != undefined){ tmp += templates.chromeStart; }
		tmp += templates[content.type](content);
		if (templates.chromeEnd != undefined){ tmp += templates.chromeEnd; }
        return tmp;
    }

    var linker = function(scope, element, attrs) {
		var html = '';
		console.log(scope.content);
	
			html += getTemplate(scope.content	);
		
		element.html(html).show();
		$compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        rep1ace: true,
		transclude: true,
        link: linker,
		controller: function($scope){
		},
        scope: {
            content:'=',
        }
    };
});

function FormCtrl($scope, $http) {
    "use strict";
    $scope.url = 'content.json';
    $scope.update = function() {
        $http.get($scope.url).then(function(result){
		form.currentForm = $scope;
		$scope.data = result.data;
        });
    }
	$scope.serialize = function(){
		console.log($scope);
	}
    $scope.update();
}

