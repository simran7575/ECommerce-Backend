const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
var cors = require("cors");

app.use(cors());

//regular middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

//morgan middleware
app.use(morgan("tiny"));
app.set("view engine", "ejs");

//app.use(express.static("public"));

const user = require("./routes/user");
const product = require("./routes/product");
const category = require("./routes/category");
const { isTokenValid } = require("./middlewares/user");

app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", category);

app.get("/api/v1/resetpassword", isTokenValid, (req, res) => {
  console.log(req.user)
  res.render("resetpassword", {
    user: req.user,
  });
});
app.get("/api/v1/invalidtoken", (req, res) => {
  res.render("tokeninvalid");
});

module.exports = app;
