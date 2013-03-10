var app = angular.module('myApp', []);
var form = {};

app.directive('formItem', function ($compile) {
  
	var templates = {
		chromeStart:'',
		chromeEnd:'',
		text: function(content){return '<label for="{{content.name}}">{{content.label}}</label><input type="text" name="{{content.name}}" ng-model="content.value" />'; },
		select: function(content){return '<label for="{{content.name}}">{{content.label}}</label><select name="{{content.name}}" ng-model="content.value" ng-options="i.v as i.k for i in content.values"/>'; },
		subform: function(content){ var base = '<subform name="{{content.name}}" style="padding:5px; border: 1px solid red; display:block;"><h1>{{content.name}}</h1><form-item ng-repeat="item in content.fields" content="item"></form-item><button ng-click="addNewSubform( $event, content.name )">Add Another</button></subform>';
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
	
			html += getTemplate(scope.content);
		
		element.html(html).show();
		$compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        rep1ace: true,
		transclude: true,
        link: linker,
		controller: function($scope){
			$scope.
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
		$scope.original = result.data;
        });
    }
	$scope.serialize = function(event){
		console.log(event);
	}
	$scope.addNewSubform = function(name, defaults){
		var scope = this;
		function findOriginalSubform (name, data){
			for (var x in data){
			if ( data[x]['name'] == name )
				{
					return data[x];
				}
				else if (data[x]['type'] == 'subform')
				{
					return findOriginalSubform(name,data[x]['fields']);
				}
			}
		}
		var sub = findOriginalSubform(name, scope.original);
		function addToEnd (name, data, sub){
			var i = data.length; //or 10
			while(i--)
			{
				if ( data[i]['name'] == name ) {
					data.splice(i+1,0,sub);
					return data;
				} 
				else if ( data[i]['type'] == 'subform' ) {
					var t = addToEnd (name, data[i]['fields'], sub);
					if (t){return t;}
				}
			}
		}
		scope.data = addToEnd(name, scope.data, sub);
		console.log(scope.data);
		$scope.$apply();
	}
    $scope.update();
}

