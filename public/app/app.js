var app = angular.module('myApp', ['ngRoute','ngResource', 'ngProgress', 'ngAnimate', 'toaster','ui.bootstrap']);
app.config(function ($httpProvider,$routeProvider) {
  $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'partials/catalog.html',
                controller  : 'CatalogsCtrl'
            })

            // route for the about page
            .when('/:id/penjualan', {
                templateUrl : 'partials/penjualan.html',
                controller  : 'ProductsCtrl'
            });
  $httpProvider.interceptors.push('myHttpInterceptor');



});

// Handle http server errors
app.factory('myHttpInterceptor', function ($q,toaster) {
    return {
        responseError: function (response) {
          console.log(response);
          if(response.data){
            if(response.data.message)
            toaster.error("Error: ", response.data.message);
            else
            toaster.error("Error: ", response.data);
          }
          return $q.reject(response);
        }
    };
});

// Showing loading indicator on top while data is requested from database
app.directive('loading',   ['$http', 'ngProgress', function ($http, ngProgress)
{
    return {
        restrict: 'A',
        link: function (scope, elm, attrs)
        {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v)
            {
                if(v){
                    ngProgress.start();
                }else{
                    ngProgress.complete();
                }
            });
        }
    };
}]);


app.directive('onlyNumbers', function() {
    return function(scope, element, attrs) {
        var keyCode = [8,9,13,37,39,46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110,190];
        element.bind("keydown", function(event) {
            if($.inArray(event.which,keyCode) == -1) {
                scope.$apply(function(){
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }

        });
    };
});
app.directive('monthDrop',function(){
    var currentYear = new Date();

   	function getMonth(offset){

        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";

        return month;
    }
    return {
        link: function(scope,element,attrs){

            scope.months = getMonth(attrs.range);
            scope.selected = scope.months[0];
        },
        template: '<select  class="form-control" ng-model="product.month" required="" placeholder="Month selected" ng-model="selected" ng-options="m for m in months"></select>'
    }
});

app.directive('yearDrop',function(){

    function getYears(range){

        var currentYear = new Date().getFullYear();
        var listYears = new Array();
        for (var i = 0; i < range; i++) {
            listYears.push(String(currentYear + i));
        }


        return listYears;
    }
    return {
        link: function(scope,element,attrs){

            scope.years = getYears(attrs.range);
            scope.selected = scope.years[0];

        },
        template: '<select  class="form-control" ng-model="product.year" required="" placeholder="Years selected" ng-model="selected" ng-options="y for y in years"></select>'
    }
});

app.directive('focus', function() {
    return function(scope, element) {
        element[0].focus();
    }
});

// Create a resource factory to access products table from database
app.factory('Product', function($resource) {
  return $resource('/api/products/:id', { id: '@_id' }, {
    update: { // We need to define this method manually as it is not provided with ng-resource
      method: 'PUT'
    }
  });
});

app.factory('ProductPenjualan', function($resource) {


    return $resource('/api/products/penjualan/:produk/:id', { id: '@_id', produk:'@penjualan._id' }, {
    update: { // We need to define this method manually as it is not provided with ng-resource
      method: 'PUT'
    }
  });
});
