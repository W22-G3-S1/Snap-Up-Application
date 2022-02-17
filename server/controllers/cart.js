let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let Cart = require('../models/cart');
let allProducts = require('../../allproducts.json');
let Product = require('../models/product');

module.exports.displayCart = (req, res, next) => {
	res.render('index', {title: 'Cart', displayName: req.user ? req.user.displayName : ''});
}

module.exports.addToCart = (req, res, next) => {
	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart: {});

	Product.findById(productId, function(err, product) {
        if(err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('back');
    });
}

module.exports.removeFromCart = (req, res, next) => {
	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart: {});

	cart.removeItem(productId);
    req.session.cart = cart;
	res.redirect('/cart');
}

module.exports.positiveUpdateCart = (req, res, next) => {
	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart: {});

	cart.addByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart');
}

module.exports.negativeUpdateCart = (req, res, next) => {
	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart: {});

	cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart');
}