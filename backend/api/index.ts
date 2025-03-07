const express = require("express");
const cors = require("cors");

const app = express();

const invoices = [{
  serialNumber: 1,
    customerName: "John Doe",
    productName: "Laptop",
    quantity: 2,
    tax: 150,
    totalAmount: 2150,
    date: new Date("2024-03-07"),
}]

const corsOptions = {
  origin: ["https://swipe-invoice-management-frontend.vercel.app/", "http://localhost:3000"],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));

app.get("/", (req, res) => res.send("Swipe Backend"));
app.get('/invoices', (req, res) => {
  res.json(invoices);
});

app.listen(4000, () => console.log("Server ready on port 4000."));

module.exports = app;
