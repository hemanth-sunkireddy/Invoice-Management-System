const { productsCollection, customersCollection } = require('../config/mongodb');

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
    { $set: { phone_num: customer.customer_mobile_number, totalPurAmnt: customer.total_amount } },
    { upsert: true }
  );
  return result.matchedCount
    ? (result.modifiedCount ? 'updated' : 'unchanged')
    : 'inserted';
};

module.exports = {
  updateProduct,
  updateCustomer
};
