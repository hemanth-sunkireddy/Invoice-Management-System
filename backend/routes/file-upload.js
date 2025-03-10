const express = require('express');
const multer = require('multer');
const router = express.Router();
require('dotenv').config();

const { model } = require('../config/genAI');
const { extractInvoice } = require('../helpers/invoiceExtractor');
const { updateProduct, updateCustomer } = require('../services/dbUpdate');
const { insertOrUpdateInvoice } = require('../services/invoiceDB-update');
const { insertOrUpdateCustomer } = require('../services/customer-update');
const { convertXlsxToCsv } = require('../helpers/xlsxConverter');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { fileType } = req.body;
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
    const productData = [];
    const customerData = [];
    const invoiceData = [];

    if (mimeType === 'application/pdf' || mimeType === 'image/jpeg') {
      const {
        invoice_number = '',
        invoice_date = '',
        invoice_tax = '',
        total_amount = '',
        consignee_name,
        consignee_mobile_number,
        CGST,
        SGST,
        IGST,
        items = [],
      } = result;

      const invoiceEntry = {
        invoice_number,
        invoice_date,
        invoice_tax,
        total_amount,
        CGST: Object.entries(CGST),
        SGST: Object.entries(SGST),
        IGST: Object.entries(IGST),
      };

      const customerDataEntry = {
        customer_name: consignee_name,
        customer_phone: consignee_mobile_number,
        invoice_number,
        invoice_date,
        total_amount,
      };


      const mongodb_response = await insertOrUpdateInvoice(invoiceEntry);
      invoiceEntry.updateStatus = mongodb_response;
      invoiceData.push(invoiceEntry);
      const customerStatus = await insertOrUpdateCustomer(customerDataEntry);
      const productUpdates = await Promise.all(
        items.map(item =>
          updateProduct({
            product_name: item.product_name,
            unit_price: item.unit_price,
            quantity: item.quantity,
            price_with_tax: item.price_with_tax,
            tax: item.tax,
          })
        )
      );

      productData.push(...items);
      customerData.push(customerDataEntry);
    } else {
      const invoices = result.invoices || [];

      for (let invoice of invoices) {
        const {
          invoice_number,
          invoice_date,
          invoice_tax,
          total_amount,
          CGST,
          SGST,
          IGST,
          items,
          customer_name,
          customer_mobile_number,
        } = invoice;


        const invoiceEntry = {
          invoice_number,
          invoice_date,
          invoice_tax,
          total_amount,
          CGST: CGST ? Object.entries(CGST) : [],
          SGST: SGST ? Object.entries(SGST) : [],
          IGST: IGST ? Object.entries(IGST) : [],
        };
        const customerDataEntry = {
          customer_name,
          customer_mobile_number,
          total_amount,
        };

        const mongodb_response = await insertOrUpdateInvoice(invoiceEntry); 
        invoiceEntry.updateStatus = mongodb_response;
        console.log(mongodb_response);
        invoiceData.push(invoiceEntry);
       
        await updateCustomer(customerDataEntry);

        for (let item of items) {
          productData.push({
            product_name: item.product_name,
            unit_price: item.unit_price,
            quantity: item.quantity,
            price_with_tax: item.price_with_tax,
            tax: item.tax,
          });

          await updateProduct({
            product_name: item.product_name,
            unit_price: item.unit_price,
            quantity: item.quantity,
            price_with_tax: item.price_with_tax,
            tax: item.tax,
          });
        }

        customerData.push(customerDataEntry);
      }
    }

    res.json({
      message: 'File upload and processing successful',
      productData,
      customerData,
      invoiceData,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
