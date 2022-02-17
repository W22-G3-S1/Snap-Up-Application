let mongoose = require('mongoose');

let productModel = mongoose.Schema({
	title: {type: String, required: true},
	description: {type: String, required: true},
	image: {type: String, required: true},
	price: {type: Number, required: true},
	type: {type: String, required: true},
},   
{
	collection: "products"
});

//const Product = mongoose.model('Product', productSchema);

module.exports = mongoose.model('Product', productModel);