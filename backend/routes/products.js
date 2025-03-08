const products = [{
    serialNumber: 1,
      productName: "Laptop",
      quantity: 2,
      unitPrice: 2,
      tax: 150,
      priceWithTax: 2150,
      discount: 10,
  }]

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send(products);
});

module.exports = router;



  