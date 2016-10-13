app.controller('ProductsCtrl', function($scope, ProductPenjualan, ngProgress, toaster,$routeParams) {

$scope.product = new ProductPenjualan($routeParams.id);

var refresh = function() {
  var data = {};
  $scope.products = ProductPenjualan.query({produk:$routeParams.id});
  $scope.product ="";


}
refresh();

$scope.add = function(product) {

  ProductPenjualan.save({produk: $routeParams.id },product,function(product){
    refresh();
});
};

$scope.update = function(product) {
  product.$update({produk: $routeParams.id },function(){
    refresh();
  });
};

$scope.remove = function(product) {
if(confirm("Are you sure to remove the product")){
  product.$delete({produk: $routeParams.id },function(){
    refresh();
  });
  }
};

$scope.edit = function(id) {
  $scope.product = ProductPenjualan.get({produk:$routeParams.id, id: id });
  console.log($scope.product);


};

$scope.deselect = function() {
  $scope.product = "";
}

$scope.forecast = function(product){
    var count = $scope.products.length;
    var p = $scope.products;
    var counter = 0;
    var index = 0;
    var demands = [];
    var forecasts = [];
    var forecast = 0;
    var hasil=0;
    var mad=0;
    var mape=0;


    $.each(p, function (key, data) {
      forecasts.push(parseInt(data['demand']));
        forecast = forecast + parseInt(data['demand']);
        if (data['_id'] == product._id) {
            hasil=forecast/3;
            index=counter;
        }
        
        counter++;
    })

    if (index < 2) {
        hasil = forecasts[index];
        alert("Data kurang dari 3, memasukkan nilai default forecasting = demand");
    }else{
        mad = Math.floor(Math.abs(forecasts[index]-hasil));
        mape = Math.floor(mad/forecasts[index]);
        alert("MAD/MAPE : "+mad+" / "+mape+"%");
    }
    $scope.product = {
        "_id":product._id,
        "year":product.year,
        "month":product.month,
        "demand":product.demand,
        "forecast":hasil
    }


}

})
