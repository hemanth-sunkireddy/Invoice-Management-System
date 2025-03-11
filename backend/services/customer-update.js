const { customersCollection } = require('../config/mongodb');

const insertOrUpdateCustomer = async (customer) => {
    try {
        if (!customer.customer_name) {
            return 'Customer name is missing. Skipping database update.';
        }
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