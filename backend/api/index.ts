const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: ["https://swipe-invoice-management-frontend.vercel.app/", "http://localhost:3000"],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));

app.get("/", (req, res) => res.send("Swipe Backend"));
app.get('/connection-check', (req, res) => {
  res.json({ message: 'Hello, Server Connection Successfully established.' });
});

app.listen(4000, () => console.log("Server ready on port 4000."));

module.exports = app;
