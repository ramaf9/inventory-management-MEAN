// Dependencies
var express = require('express');
var app = express();
var router = express.Router();

//Product
var Product = require('../models/products');
// Product.methods(['get', 'put', 'post', 'delete']);
// Product.register(router, '/products');
// Return router

// var ProductsPenjualan = require('../models/products-penjualan');
// Product.methods(['get', 'put', 'post', 'delete']);
// Product.register(router, '/products/penjualan/:id');
Product.methods(['put','delete']);
Product.register(router,'/products');

router.route('/products')
    //GET all products
    .get(function(req, res, next) {
        //retrieve all products from Monogo
        Product.find({}, function (err, product) {
              if (err) {
                  return console.error(err);
              } else {
                  res.json(product);

              }
        });
    })
    //POST a new product
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;

        //call the create function for our database
        Product.create({
            name : name,

        }, function (err, product) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //product has been created
                  console.log('POST creating new product: ' + product);
                  res.json(product);


              }
        })
    })

    // //PUT a new product
    // .put(function(req,res){
    //
    //     var name = req.body.name;
    //     var photo = req.body.photo;
    //
    //     Product.findById(req.params.id,function(err,product){
    //
    //     product.update({
    //         name:name,
    //         photo:photo
    //     },function (err,productId){
    //         if (err) {
    //              res.send("There was a problem adding the information to the database.");
    //         }
    //         else {
    //             res.json(product);
    //         }
    //     })
    //     })
    // })
    //DELETE a new product
    // .delete(function(req,res){
    //     Product.findById(req.params.id,function(err,product){
    //         if (err) {
	//             return console.error(err);
	//         } else {
	//             //remove it from Mongo
	//             product.remove(function (err, product) {
	//                 if (err) {
	//                     return console.error(err);
	//                 } else {
    //                     res.json({message : 'deleted',
    //                         item : product
    //
    //                         });
	//                 }
	//             });
	//         }
    //     })
    // })
    ;


    router.route('/products/penjualan/:id')
        //GET all products
        .get(function(req, res, next) {
            //retrieve all products from Monogo
            Product.findById(req.params.id, function (err, product) {
                  if (err) {
                      res.json({"message":"gagal"});
                  } else {
                      res.json(product.penjualan);

                  }
            });
        })


        //POST a new product
        .post(function(req,res){

            var penjualan = {
                            year: req.body.year,
                            month: req.body.month,
                            demand: req.body.demand,
                            forecast: req.body.forecast
                            }

        Product.findByIdAndUpdate(req.params.id,
                                    {$push: {'penjualan': penjualan}},
                                    {safe: true, upsert: true, new : true},
                                    function(err, model) {
                                        if (err) {
                                            res.json(err);
                                        }
                                        else{
                                            res.json(model);
                                        }
                                    }
                                );

        });
        //PUT a new product
        router.put('/products/penjualan/:id/:idpenjualan',function(req,res){

            var penjualan = {
                            year: req.body.year,
                            month: req.body.month,
                            demand: req.body.demand,
                            forecast: req.body.forecast
                            }

        Product.update({'_id':req.params.id,
                        'penjualan._id':req.params.idpenjualan},
                                    {'$set': {'penjualan.$.year': penjualan.year,
                                              'penjualan.$.month': penjualan.month,
                                              'penjualan.$.demand': penjualan.demand,
                                              'penjualan.$.forecast': penjualan.forecast

                                          }},
                                    function(err, model) {
                                        if (err) {
                                            res.json(err);
                                        }
                                        else{
                                            res.json(model);
                                        }
                                    }
                                );

        });

        router.get('/products/penjualan/:id/:idpenjualan',function(req,res){
            Product.find({'penjualan._id':req.params.idpenjualan},{_id: 0, 'penjualan.$': 1},
                                        function(err, model) {
                                            if (err) {
                                                res.json(err);
                                            }
                                            else{
                                                res.json(model[0].penjualan[0]);
                                            }
                                        }
                                    );

        });
        router.delete('/products/penjualan/:id/:idpenjualan', function(req, res) {
            Product.findByIdAndUpdate(req.params.id,
                                        {$pull: {"penjualan": {"_id":req.params.idpenjualan}}},
                                        function(err, model) {
                                            if (err) {
                                                res.json(err);
                                            }
                                            else{
                                                res.json(model);
                                            }
                                        }
                                    );

        });
        // //DELETE a new product
        // .delete(function(req,res){
        //     Product.findById(req.params.id,function(err,product){
        //         if (err) {
    	//             return console.error(err);
    	//         } else {
    	//             //remove it from Mongo
    	//             product.remove(function (err, product) {
    	//                 if (err) {
    	//                     return console.error(err);
    	//                 } else {
        //                     res.json({message : 'deleted',
        //                         item : product
        //
        //                         });
    	//                 }
    	//             });
    	//         }
        //     })
        // });






module.exports = router;
