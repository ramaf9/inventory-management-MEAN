// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var productSchema = new mongoose.Schema({
    year: String,
    month: String,
    demand: Number,
    forecast: Number
});

// Return model
module.exports = restful.model('Penjualan', productSchema);
