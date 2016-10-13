app.controller('CatalogsCtrl', function($scope,$modal,$log, Product, ngProgress, toaster) {

$scope.product = new Product();

var refresh = function() {
  $scope.products = Product.query();
  $scope.product ="";
}
refresh();


  $scope.animationsEnabled = true;
  $scope.remove = function(product) {
  if(confirm("Are you sure to remove the product")){
    product.$delete(function(){
      refresh();
    });
    }
  };

  $scope.open = function (p,size) {

    var modalInstance = $modal.open({
      templateUrl: 'partials/catalogEdit.html',
      controller: 'productEditCtrl',
      size: size,
      resolve: {
        item: function () {
          return p;
        }
      }
    });

    modalInstance.result.then(function (selectedObject) {
      refresh();
      if(selectedObject.save == "insert"){
                $scope.products.push(selectedObject);
                // $scope.products = $filter('orderBy')($scope.products, '_id', 'reverse');
            }else if(selectedObject.save == "update"){
                p.year = selectedObject.name;
                p.month = selectedObject.month;
                p.demand = selectedObject.demand;
                p.forecast = selectedObject.forecast;

            }

    }, function () {

      $log.info('Modal dismissed at: ' + new Date());
    });
  };


})

app.controller('productEditCtrl', function ($scope,item,Product, $modalInstance) {
    $scope.product = angular.copy(item);
    $scope.buttonText = (item._id != null) ? 'Update File' : 'Upload';


    $scope.ok = function (product) {



            if(product._id != null){
              product.$update(function(){

                var x = angular.copy(product);
                x.save = 'update';
                $modalInstance.close(x);
              });

            }else{
              Product.save(product,function(product){
                var x = angular.copy(product);
                x.save = "insert";
                 $modalInstance.close(x);
              });

            }

    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  })
