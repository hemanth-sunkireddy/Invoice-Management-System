require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_STRING;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db('Swipe_Automatic_invoice_Management');
const invoicesCollection = db.collection('invoices');
const productsCollection = db.collection('products');
const customersCollection = db.collection('customers');


async function connectToMongo() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

connectToMongo();

module.exports = { client, connectToMongo, invoicesCollection, customersCollection, productsCollection };
