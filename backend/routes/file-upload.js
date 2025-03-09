const express = require('express');
const multer = require('multer');
const router = express.Router();
require('dotenv').config();

const { model } = require('../config/genAI');
const { extractInvoice } = require('../helpers/invoiceExtractor');
const { insertInvoice, updateProduct, updateCustomer } = require('../services/dbUpdate');
const { convertXlsxToCsv } = require('../helpers/xlsxConverter');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { fileName, fileType, fileSize } = req.body;
    const fileBuffer = req.file.buffer;
    console.log(fileType);
    let mimeType = fileType;
    let base64Data = '';

    if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const { base64Data: convertedBase64Data } = convertXlsxToCsv(fileBuffer);
      base64Data = convertedBase64Data;
      mimeType = 'text/csv';
    } else if (fileType === 'application/pdf' || fileType === 'image/jpeg') {
      base64Data = fileBuffer.toString('base64');
    }

    const result = await extractInvoice(model, base64Data, mimeType, base64Data);
    const {
      invoice_number = '',
      invoice_date = '',
      invoice_tax = '',
      total_amount = '',
      consignee_name,
      consignee_mobile_number,
      items = [],
    } = result;

    
    const invoiceData = {
      invoice_number,
      invoice_date,
      invoice_tax,
      total_amount,
      CGST: result.CGST ? Object.entries(result.CGST) : [],
      SGST: result.SGST ? Object.entries(result.SGST) : [],
      IGST: result.IGST ? Object.entries(result.IGST) : [],
    };

    const customerData = {
      customer_name: consignee_name,
      customer_phone: consignee_mobile_number,
      total_amount,
    };

    const productData = items.map(item => ({
      product_name: item.product_name,
      unit_price: item.unit_price,
      quantity: item.quantity,
      price_with_tax: item.price_with_tax,
      tax: item.tax,
    }));
    console.log(productData);
    console.log(customerData);
    console.log(invoiceData);

    const invoiceUpdateStatus = await insertInvoice(invoiceData);
    const customerStatus = await updateCustomer(customerData);
    const productUpdates = await Promise.all(
      productData.map(item => updateProduct(item))
    );
    console.log("Product Update Status: ", productUpdates);
    console.log("Customer Status: ", customerStatus);

    res.json({
      message: 'File upload and processing successful',
      invoiceData,
      customerData,
      productData
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
