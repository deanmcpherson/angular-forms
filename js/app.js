var app = angular.module('myApp', []);
var form = {};

app.directive('formItem', function ($compile) {
  
	var templates = {
		chromeStart:'',
		chromeEnd:'',
		text: function(content){return '<label for="{{content.name}}">{{content.label}}</label>l'; }
	}

    var getTemplate = function(content) {
		var tmp = '';
		if (templates.chromeStart != undefined){ tmp += templates.chromeStart; }
		tmp += templates[content.type](content);
		if (templates.chromeEnd != undefined){ tmp += templates.chromeEnd; }
        return tmp;
    }

    var linker = function(scope, element, attrs) {
		var html = 'sad';
		console.log(form);
		/*for( var form in form ){	
		
		return;
			html += getTemplate(scope.form[item]);
		}*/
		element.html(html).show();
		$compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        rep1ace: true,
		transclude: true,
        link: linker,
		controller: function($scope){
		form.currentForm = $scope.form;
		},
        scope: {
            form:'=ngModel',
        }
    };
});

function FormCtrl($scope, $http) {
    "use strict";

    $scope.url = 'content.json';

    $scope.fetchData = function() {
        $http.get($scope.url).then(function(result){
		form.currentForm = result.data;
		$scope.formSchema = result.data;
		/*var newData = {};
		for ( var x in result.data ) {
			newData[result.data[x]['name']] = result.data[x]['value'];
		}
		$scope.data = newData;*/
        });
    }
	$scope.serialize = function(){
		console.log($scope);
	}
    $scope.fetchData();
}

