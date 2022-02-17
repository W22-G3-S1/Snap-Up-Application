let express = require('express');
let router = express.Router();

let indexController = require('../controllers/index');

/* GET home page. */
router.get('/', indexController.displayHomePage);

/* GET home page. */
router.get('/home', indexController.displayHomePage);

/* GET About page. */
router.get('/about', indexController.displayAboutPage);

/* GET projects page. */
router.get('/projects', indexController.displayProjectsPage);

/* GET Servises page. */
router.get('/services', indexController.displayServicesPage);

/* GET Contact page. */
router.get('/contact', indexController.displayContactPage);

/* GET Men page. */
router.get('/men', indexController.displayMenPage);

/* GET Women page. */
router.get('/women', indexController.displayWomenPage);

/* GET Kids page. */
router.get('/kids', indexController.displayKidsPage);

/* GET Offers page. */
router.get('/offers', indexController.displayOffersPage);
/* GET Sale40 page. */
router.get('/sale40', indexController.displaySale40Page);

/* GET Sale50 page. */
router.get('/sale50', indexController.displaySale50Page);

/* GET Sale60 page. */
router.get('/sale60', indexController.displaySale60Page);

/* GET Profile page. */
router.get('/profile', indexController.displayProfilePage);

/* POST Profile page. */
router.post('/profile', indexController.processProfilePage);

/* Get Route for displaying the Login page */
router.get('/login', indexController.displayLoginPage);

/* POST Route for processing the Login page */
router.post('/login', indexController.processLoginPage);

/* Get Route for displaying the Register page */
router.get('/register', indexController.displayResisterPage);

/* POST Route for processing the Register page */
router.post('/register', indexController.processRegisterPage);

/* Get Route for Logout */
router.get('/logout', indexController.performLogout);

module.exports = router;
