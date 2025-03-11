const { productsCollection } = require('../config/mongodb');

const updateProduct = async (product) => {
    try {
        if (!product.product_name) {
            return 'Product name is missing. Skipping database update.';
        }
        await productsCollection.insertOne(product);
        return 'Successfully added a new product record.';
    } catch (error) {
        console.error('Error processing product:', error.message);
        throw new Error('Failed to process product');
    }
};

module.exports = {
    updateProduct
};