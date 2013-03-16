var app = angular.module('myApp', ["google-maps"]);
var form = {};

app.directive('formItem', function ($compile) {
  
	var templates = {
		chromeStart:'',
		chromeEnd:'',
		text: function(content){return '<label for="{{content.name}}">{{content.label}}</label><input type="text" name="{{content.name}}" ng-model="content.value" />'; },
		select: function(content){return '<label for="{{content.name}}">{{content.label}}</label><select name="{{content.name}}" ng-model="content.value" ng-options="i.v as i.k for i in content.values"/>'; },
		subform: function(content){ 
			var base = '<div type="subform" name="{{content.name}}" ng-hide="content.hidden" style="padding:5px; border: 1px solid red; display:block;">\
			<h1>{{content.name}}</h1>\
			<form-item ng-repeat="item in content.fields" content="item"></form-item>\
			<button ng-click="addField(content)">Add</button>\
			<button ng-click="removeField(content)">Remove</button></div>\
			<button ng-show="content.hidden" ng-click="showField(content)">Add {{content.label}}</button>';
			return base;
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
		html += getTemplate(scope.content);	
		element.html(html).show();
		$compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        rep1ace: true,
		transclude: true,
        link: linker,
		controller: function($scope) {

				$scope.showField = function(content){
					content.hidden = false;
				}
				$scope.hideField = function(content){
					content.hidden = true;
				}

				$scope.removeField = function(content){
					var hashKey = content.$$hashKey,
					name = content.name,
					data = form.currentForm.data;

					function findAndRemove(name, hashKey, data) {
						var count = 0, 
						hide = false;
						angular.forEach(data, function(v, x){
							if (data[x]['name'] == name){
								count++;
							}
						});

						if (count == 1){
							hide = true;
						}

						angular.forEach (data, function(val, x) {
							if (data[x]['$$hashKey'] == hashKey) {
								if (hide) {
									data[x]['hidden'] = true;
								} else
								{
									data.splice(x, 1);
								}
							}
							else if (data[x]['type'] == 'subform') {
								findAndRemove(name, hashKey, data[x]['fields']);
							}
						});
					}
					findAndRemove(name, hashKey, data);
				}

				$scope.addField = function(content, defaults) {
					var name = content.name,
					hashKey = content.$$hashKey,
					scope = form.currentForm,
					original = scope.original;

					function findOriginalSubform (name, data) {
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

					function addToEnd (hashKey, data, sub) {
						var i = data.length;
						while(i--)
						{
							if ( data[i]['$$hashKey'] == hashKey ) {
								var sub = jQuery.extend(true,{},sub);
								sub.hashKey = undefined;
								sub.hidden = false;
								data.splice(i+1,0,sub);
							} 
							else if ( data[i]['type'] == 'subform' ) {
								addToEnd (hashKey, data[i]['fields'], sub);			
							}
						}
					}
					addToEnd(hashKey, scope.data, sub);
				}
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

    	var _compile = function(data, is_sub){
    		var x = 0;
    		for (x; x < data.length; x++){
				if (data[x]['type'] == 'subform'){
					var initial = data[x]['initial'];

					_compile(data[x]['fields']);
					if (initial != undefined){
						if (initial > 1){
							var count = initial--,
							i = 1;
							for (i; i<count; i++){
								var replace = jQuery.extend(true,{},data[x]);
								data.splice(x+1, 0, replace);
							}
						}
					} else {
						if (!is_sub){
							data[x]['hidden'] = true;
						}
					}		
					return data;
				}
    		}
    	}

        $http.get($scope.url).then( function(result) {
	        var data = _compile(result.data);
			$scope.original = jQuery.extend(true, [], data);
			form.currentForm = $scope;
			$scope.data = data;
        });
    }
	$scope.add = function(){

	}

    $scope.update();
}

