const { client } = require('../config/mongodb');

const db = client.db('Swipe_Automatic_invoice_Management');
const invoicesCollection = db.collection('invoices');
const productsCollection = db.collection('products');
const customersCollection = db.collection('customers');

const insertInvoice = async (fileData) => {
  await invoicesCollection.insertOne(fileData);
};

const updateProduct = async (product) => {
  const result = await productsCollection.updateOne(
    { product_name: product.product_name },
    { $set: { item_price: product.item_price, gst: product.gst, taxable_value: product.taxable_value } },
    { upsert: true }
  );
  return result.matchedCount
    ? (result.modifiedCount ? 'updated' : 'unchanged')
    : 'inserted';
};

const updateCustomer = async (customer) => {
  const result = await customersCollection.updateOne(
    { customer_name: customer.customer_name || "undefined" },
    { $set: { phone_num: customer.consignee_mobile_number, totalPurAmnt: customer.total_amount } },
    { upsert: true }
  );
  return result.matchedCount
    ? (result.modifiedCount ? 'updated' : 'unchanged')
    : 'inserted';
};

module.exports = {
  insertInvoice,
  updateProduct,
  updateCustomer
};
