const express = require("express");
const cors = require("cors");
const connectDB = require("./configs/database");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// routes
app.use("/api/product", require("./routes/Product.router"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/knowledge", require("./routes/FishCareKnowledge.router"))
app.use("/api/cart", require("./routes/cart.route"));

app.get("/", (req, res) => {
  res.send("Aquatic_BackEnd is running 🚀");
});

module.exports = app;
