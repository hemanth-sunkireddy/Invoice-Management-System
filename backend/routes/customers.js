const customers = [{
    serialNumber: 1,
      customerName: "Hemanth",
      phoneNumber: 984902299,
      totPurchAmnt: 1000,
  }]

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send(customers);
});

module.exports = router;



  