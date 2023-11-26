const router = require('express').Router();
var merchant = require('./merchantController');
var message = require('./messageController');
var customer = require('./customerController');
var chatroom = require('./chatRoomController');
var order = require('./orderController');
var product = require('./productController');

router.use('/merchant', merchant);
router.use('/message', message);
router.use('/customer', customer);
router.use('/chatroom', chatroom);
router.use('/order', order);
router.use('/product', product);

module.exports  = router;