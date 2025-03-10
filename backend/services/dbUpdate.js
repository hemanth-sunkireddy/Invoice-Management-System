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


module.exports = {
  updateProduct
};
