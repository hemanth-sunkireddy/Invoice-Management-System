const invoices = [{
    serialNumber: 1,
      customerName: "John Doe",
      productName: "Laptop",
      quantity: 2,
      tax: 150,
      totalAmount: 2150,
      date: new Date("2024-03-07"),
  }]

var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.send(invoices);
});

module.exports = router;



  