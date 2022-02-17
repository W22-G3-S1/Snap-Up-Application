let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

var products = require('../../products.json')

// enable jwt
let jwt = require('jsonwebtoken');
let DB = require('../config/db');

// define the User Model Instance
let userModel = require('../models/user');
let User = userModel.User; // allas
//define product model instance
let Product = require('../models/product');

module.exports.displayHomePage = (req, res, next) => {
    res.render('index', {title: 'Home', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayAboutPage = (req, res, next) => {
    res.render('index', {title: 'About', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayProjectsPage = (req, res, next) => {
    res.render('index', {title: 'Projects', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayServicesPage = (req, res, next) => {
    res.render('index', {title: 'Services', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayContactPage = (req, res, next) => {
    res.render('index', {title: 'Contact', displayName: req.user ? req.user.displayName : ''});
} 

module.exports.displayMenPage = (req, res, next) => {
    Product.find((err, productList) => {
        if(err) 
        {
            return console.error(err);
        }
        else
        {
            res.render('index', 
            {title: 'Men', 
            ProductList: productList,
            displayName: req.user ? req.user.displayName: ''});
        }
    });
}

module.exports.displayWomenPage = (req, res, next) => {
    Product.find((err, productList) => {
        if(err) 
        {
            return console.error(err);
        }
        else
        {
            res.render('index', 
            {title: 'Women', 
            ProductList: productList,
            displayName: req.user ? req.user.displayName: ''});
        }
    });
}

module.exports.displayKidsPage = (req, res, next) => {
    Product.find((err, productList) => {
        if(err) 
        {
            return console.error(err);
        }
        else
        {
            res.render('index', 
            {title: 'Kids', 
            ProductList: productList,
            displayName: req.user ? req.user.displayName: ''});
        }
    });
}

module.exports.displayOffersPage = (req, res, next) => {
    res.render('index', {title: 'Offers', displayName: req.user ? req.user.displayName : ''});
    
}
module.exports.displaySale40Page = (req, res, next) => {
    res.render('index', {title: 'Sale40', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displaySale50Page = (req, res, next) => {
    res.render('index', {title: 'Sale50', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displaySale60Page = (req, res, next) => {
    res.render('index', {title: 'Sale60', displayName: req.user ? req.user.displayName : ''});
}    

module.exports.displayBagPage = (req, res, next) => {
    res.render('index',{title: 'Bag', displayName: req.user ? req.user.displayName : ''});
} 

module.exports.displayProfilePage = (req, res, next) => {
    
    res.render('index', {errorMessages: req.flash('profileMessageError'), successMessages: req.flash('profileMessageSuccess'), title: 'Profile', username: req.user.username, email: req.user.email,
    displayName: req.user? req.user.displayName : ''});   
};

module.exports.processProfilePage = (req, res, next) => {
    let userName = req.body.username; 
    User.find({ username: userName }, (err, result) => {
        if (err) {
            console.error(err);
        } else {
            let userToUpdate = result[0];
            userToUpdate.displayName = req.body.displayName;
            userToUpdate.email = req.body.email;

            User.updateOne({ _id: userToUpdate._id }, userToUpdate, (err) => {
                if (err) {
                    console.log(err);
                    req.flash('profileMessageError', 'There was an error updating the profile.');
                    return res.redirect('/profile');
                } else {
                    req.flash('profileMessageSuccess', 'Profile updated successfully.');
                    return res.redirect('/profile');
                }
            });
        }
    });
};


module.exports.displayLoginPage = (req, res, next) => {
    // check if the user is already logged in
    if(!req.user)
    {
        res.render('auth/login',
        {
            title: "Login",
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName: ''
        })
    }
    else 
    {
        return res.redirect('/');
    }
}

module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local',
    (err, user, info) => {
        // if server err
        if(err)
        {
            return next(err);
        }
        // is there a user login error
        if(!user)
        {
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }
        req.login(user, (err)=> {
            //server error?
            if(err)
            {
                return next(err);
            }

            const payload = 
            {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }

            const authToken = jwt.sign(payload, DB.Secret, {
               expiresIn: 604800 // 1 week 
            });
            return res.redirect('/');
        });
    })(req, res, next);
}

module.exports.displayResisterPage = (req, res, next) => {
    // check if the user is not already logged in
    if(!req.user)
    {
        res.render('auth/register',
        {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    }
    else 
    {
        return res.redirect('/');
    }
}

module.exports.processRegisterPage = (req, res, next) => {
    // instanciate a user onject
    let newUser = new User({
        username: req.body.username,
        // password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName
    });
    User.register(newUser, req.body.password, (err) => {
        if(err)
        {
            console.log("error: Inserting New User");
            if(err.name == "UserExistsError")
            {
                req.flash(
                    'registerMessage',
                    'Registration Error: User Already Exists!'
                );
                console.log('Error: User Already Exists!');
            }
            return res.render('auth/register', {
                title: 'Register',
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ''
            });
        }
        else
        {
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/')

            });
        }
    });
}

module.exports.performLogout = (req, res, next) => {
    req.logout();
    req.session.destroy(function(){ 
        req.session;
    });
    res.redirect('/');
}
