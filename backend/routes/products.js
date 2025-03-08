const express = require('express');
const router = express.Router();
const { client } = require('../config/mongodb');

router.get('/', async (req, res, next) => {
  try {
    const database = client.db('Swipe_Automatic_invoice_Management');
    const productsCollection = database.collection('products');
    const products = await productsCollection.find({}).toArray();
    console.log(products);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
