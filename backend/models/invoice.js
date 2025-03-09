const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  consignee_name: {
    type: String,
    required: false,
  },
  consignee_mobile_number: {
    type: String,
    required: false,
  },
  consignee_address: {
    type: String,
    required: false,
  },
  customer_name: {
    type: String,
    required: false,
  },
  customer_mobile_number: {
    type: String,
    required: false,
  },
  customer_total_purchase_amount: {
    type: Number,
    required: false,
  },
  invoice_number: {
    type: String,
    required: false,
    unique: true,
  },
  invoice_date: {
    type: Date,
    required: false,
  },
  total_amount: {
    type: Number,
    required: false,
  },
  CGST: {
    type: Object,
    of: Number,
    default: {},
  },
  SGST: {
    type: Object,
    of: Number,
    default: {},
  },
  IGST: {
    type: Object,
    of: Number,
    default: {},
  },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
