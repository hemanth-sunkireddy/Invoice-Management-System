const express = require('express');
const router = express.Router();
const { client } = require('../config/mongodb');

router.get('/', async (req, res, next) => {
  try {
    const database = client.db('Swipe_Automatic_invoice_Management');
    const invoicesCollection = database.collection('invoices');
    const invoices = await invoicesCollection.find({}).toArray();
    console.log(invoices);
    res.json(invoices);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
