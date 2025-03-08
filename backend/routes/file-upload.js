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
    const invoice_tax = result.invoice_tax || "";
    const total_amount = result.total_amount || "";
    console.log("INVOICE NUM: ", invoice_num);
    console.log("INVOICE TAX: ", invoice_tax);
    console.log("TOTAL AMOUNT: ", total_amount);
    console.log("INVOICE DATE: ", invoice_date);
  
    const products = result.items || [];
    const customer = result.consignee_name ? {
      customer_name: result.consignee_name,
      customer_mobile_number: result.consignee_mobile_number,
      total_amount: total_amount
    } : {};
    console.log(customer)
    const invoiceData = {
      invoice_num,
      invoice_date,
      invoice_tax,
      total_amount,
    };

    const invoiceUpdateStatus = await insertInvoice(invoiceData);
    console.log("INVOICE DB UPDATE STATUS: ", invoiceUpdateStatus);

    const productUpdates = await Promise.all(products.map(updateProduct));
    const customerStatus = await updateCustomer(customer);
    console.log(productUpdates)
    console.log(customerStatus)
    res.json({
      message: 'File upload and processing successful',
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
