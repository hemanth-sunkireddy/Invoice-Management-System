const { productsCollection } = require('../config/mongodb');

const updateProduct = async (product) => {
    try {
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