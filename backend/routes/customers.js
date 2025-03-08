const express = require('express');
const router = express.Router();
const { client } = require('../config/mongodb');

router.get('/', async (req, res, next) => {
  try {
    const database = client.db('Swipe_Automatic_invoice_Management');
    const customersCollection = database.collection('customers');
    const customers = await customersCollection.find({}).toArray();
    res.json(customers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
