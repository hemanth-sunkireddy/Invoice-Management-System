const express = require("express");
const cors = require("cors");
const app = express();

// Routes Import
const invoicesRouter = require('../routes/invoices.js');
const fileUploadRouter = require('../routes/file-upload.js');
const productsRouter = require('../routes/products.js');
const customersRouter = require('../routes/customers.js');

// Mongo Connection
const { checkMongoConnection } = require("../config/mongodb.js");

// CORS options
const corsOptions = {
  origin: ["https://swipe-invoice-management-frontend.vercel.app", "http://localhost:3000"],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check — useful for checking if backend is running
app.get("/", (req, res) => {
  res.status(200).send("Swipe Backend: Server is running.");
});

// Apply MongoDB connection check to all routes
app.use(checkMongoConnection);


// Routes
app.use('/invoices', invoicesRouter);
app.use('/file-upload', fileUploadRouter);
app.use('/products', productsRouter);
app.use('/customers', customersRouter);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;
