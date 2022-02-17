let express = require('express');
let router = express.Router();

let wishListController = require('../controllers/wishlist');

/* GET Wishlist page. */
router.get('/', wishListController.displayWishlistPage);

// GET add to wishlist
router.get('/add/:id', wishListController.addToWishlistPage);

// GET remove from wishlist
router.get('/remove/:id', wishListController.removeFromWishlistPage);

module.exports = router;