const express = require("express");
const cors = require("cors");
const connectDB = require("./configs/database");
require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/upload", require("./routes/upload.router"));

// routes
app.use("/api/product", require("./routes/Product.router"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/knowledge", require("./routes/FishCareKnowledge.router"))
app.use("/api/cart", require("./routes/cart.route"));
app.use("/api/users", require("./routes/user.routes"))
app.use("/api/orders", require("./routes/order.router"))
app.use("/api/shop", require("./routes/shop.route"))
app.use("/api/contact", require("./routes/contact.route"))
app.use("/api/comment", require("./routes/comment.route"))
app.use("/api/recommend", require("./routes/recommend.routes"));

app.use("/api/livestream", require("./routes/livestream.routes"));


app.get("/", (req, res) => {
  res.send("Aquatic_BackEnd is running ");
});

module.exports = app;
