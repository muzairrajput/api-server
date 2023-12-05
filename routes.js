const router = require('express').Router();
var merchant = require('./merchantController');
var message = require('./messageController');
var customer = require('./customerController');
var chatroom = require('./chatRoomController');
var order = require('./orderController');
var product = require('./productController');
var shoppingcart = require('./cartController');
var orderitem = require('./orderItemController');
var orderproducts = require('./orderProductsController');
var s3 = require('./s3');

router.use('/merchant', merchant);
router.use('/message', message);
router.use('/customer', customer);
router.use('/chatroom', chatroom);
router.use('/order', order);
router.use('/product', product);
router.use('/shoppingcart', shoppingcart);
router.use('/orderitem', orderitem);
router.use('/orderproducts', orderproducts);
router.use('/s3', s3);

module.exports  = router;