var app = angular.module('myApp', ["forma"]);
var form = {},
settings = {};
settings.geo = {};

settings.geo.refresh = function(ref){
	var g = this;
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(geo){
		g.center = {lat:geo.coords.latitude, lng: geo.coords.longitude};
		if (ref != undefined){ ref = g.center; }
		});
	}
};

settings.geo.refresh();
settings.geo.center = {lat:0, lng:0};
settings.geo.zoom = 15;

function FormCtrl($scope, $http) {
    "use strict";

    angular.extend($scope, {
		center: {
			lat: 0, // initial map center latitude
			lng: 0, // initial map center longitude
		},
		markers: [], // an array of markers,
		zoom: 8, // the zoom level
	});

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
							data[x]['collapsed'] = true;
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

	 var serializeForm = function(data) {
		return data.map(function(item){
			if (item.type === 'subform') {
				return {k: item.name, v: serializeForm(item.fields)};
			}
			else
			{
				return {k: item.name, v: item.value};
			}
		});
	}

	$scope.submitUrl = '/test';
	$scope.submit = function() {
		var data = JSON.stringify(serializeForm($scope.data));
		$http.post($scope.submitUrl, data).then(function(){
			alert('result!');
		}); 
	}

	window.scope = $scope;
    $scope.update();
}

