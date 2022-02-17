let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let Cart = require('../models/cart');
let Product = require('../models/product');

// define the User Model Instance
let userModel = require('../models/user');
let User = userModel.User; // allas

module.exports.displayWishlistPage = (req, res, next) => {
    User.findById(req.user._id, {wishlist:1}, (err, userWishlist) => {
        if(err) 
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            Product.find().where('_id').in(userWishlist.wishlist).exec((err, records) => {
                res.render('index', {title: 'Wishlist', Records: records, displayName: req.user ? req.user.displayName : ''});
            });
        }
    });
}

module.exports.addToWishlistPage = (req, res, next) => {
    let productId = req.params.id;
    
    User.updateOne(
        { _id: req.user._id }, 
        { $addToSet: { wishlist: productId } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        });
        res.redirect('back');
}

module.exports.removeFromWishlistPage = (req, res, next) => {
    let productId = req.params.id;
    
    User.updateOne(
        { _id: req.user._id }, 
        { $pull: { wishlist: productId } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        });
        res.redirect('back');
}