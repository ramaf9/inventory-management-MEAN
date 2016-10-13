// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var penjualanSchema = new mongoose.Schema({
    year: String,
    month: String,
    demand: Number,
    forecast: Number
})

var productSchema = new mongoose.Schema({
    name:String,
    photo:String,
    penjualan:[penjualanSchema]

});



// Return model
module.exports = restful.model('Products', productSchema);
