const { invoicesCollection, productsCollection, customersCollection } = require('../config/mongodb');

const insertInvoice = async (fileData) => {
  try {
    const result = await invoicesCollection.insertOne(fileData);
    console.log('Invoice saved successfully with ID:', result.insertedId);
  } catch (error) {
    console.error('Error saving invoice:', error.message);
    throw new Error('Failed to insert invoice');
  }
};

const updateProduct = async (product) => {
  const result = await productsCollection.updateOne(
    { product_name: product.product_name },
    { 
      $set: { 
        item_price: product.unit_price, 
        gst: product.tax, 
        taxable_value: product.price_with_tax 
      } 
    },
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
