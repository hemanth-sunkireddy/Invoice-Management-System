const express = require('express');
const multer = require('multer');
const router = express.Router();
require('dotenv').config();

const { model } = require('../config/genAI');
const { extractInvoice } = require('../helpers/invoiceExtractor');
const { insertInvoice, updateProduct, updateCustomer } = require('../services/dbUpdate');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { fileName, fileType, fileSize } = req.body;
    const fileBuffer = req.file.buffer;
    const mimeType = fileType === 'application/pdf' ? 'application/pdf' : fileType;

    const result = await extractInvoice(model, fileBuffer, mimeType);
    const invoice_num = result.invoice_number || "";
    const invoice_date = result.invoice_date || "";
    const customer_name = result.customer_name || "";
    console.log("CUSTOMER NAME: ", result.customer_name);
  
    const products = result.items || [];
    const customer = result.customer_name ? {
      customer_name: result.customer_name,
      customer_gst: result.customer_gst,
      place_of_supply: result.place_of_supply
    } : {};

    const invoiceData = {
      invoice_num,
      invoice_date,
      customer_name,
    };

    await insertInvoice(invoiceData);

    const productUpdates = await Promise.all(products.map(updateProduct));
    const customerStatus = await updateCustomer(customer);
    console.log(productUpdates)
    console.log(customerStatus)
    res.json({
      message: 'File upload and processing successful',
      result,
      productUpdates,
      customerStatus
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
