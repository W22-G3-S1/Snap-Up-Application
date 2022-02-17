let express = require('express');
let router = express.Router();

let cartController = require('../controllers/cart');

router.get("/add/:id", cartController.addToCart);
router.get("/remove/:id", cartController.removeFromCart);
router.get("/positive-update/:id", cartController.positiveUpdateCart);
router.get("/negative-update/:id", cartController.negativeUpdateCart);
router.get("/", cartController.displayCart);

module.exports = router;
