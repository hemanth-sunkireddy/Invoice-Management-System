const { customersCollection } = require('../config/mongodb');

const insertOrUpdateCustomer = async (customer) => {
    try {
        await customersCollection.insertOne(customer);
        return 'Successfully added a new customer record.';
    } catch (error) {
        console.error('Error processing customer:', error.message);
        throw new Error('Failed to process customer');
    }
};

module.exports = {
    insertOrUpdateCustomer
};