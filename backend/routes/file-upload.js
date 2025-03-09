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

    let mimeType = fileType;
    let base64Data = '';

    if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const { base64Data: convertedBase64Data } = convertXlsxToCsv(fileBuffer);
      base64Data = convertedBase64Data;
      mimeType = 'text/csv';
    } else if (fileType === 'application/pdf') {
      base64Data = fileBuffer.toString('base64');
      mimeType = 'application/pdf';
    }

    const result = await extractInvoice(model, base64Data, mimeType, base64Data);
    console.log(result);
    const {
      invoice_number = '',
      invoice_date = '',
      invoice_tax = '',
      total_amount = '',
      consignee_name,
      consignee_mobile_number,
      items = [],
    } = result;

    const customer = consignee_name
      ? {
        customer_name: consignee_name,
        customer_mobile_number: consignee_mobile_number,
        total_amount,
      }
      : {};

      const invoiceData = {
        invoice_number,
        invoice_date,
        invoice_tax,
        total_amount,
        // CGST: Object.fromEntries(result.CGST || []),
        // SGST: Object.fromEntries(result.SGST || []),
        // IGST: Object.fromEntries(result.IGST || []),
      };
    const invoiceUpdateStatus = await insertInvoice(invoiceData);
    const productUpdates = await Promise.all(items.map(updateProduct));
    const customerStatus = await updateCustomer(customer);
    console.log(invoiceUpdateStatus);
    console.log(customerStatus);
    res.json({
      message: 'File upload and processing successful',
      invoiceData,
      customerStatus,
      modelResponse: result,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
