const express = require("express");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const morgan = require("morgan");

let PORT = process.env.PORT || 3000;
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news_scraper";

//Init Express
const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

let db = mongoose.connection;
db.on("error", error => {
  console.log("Connection error ${error}");
});
require("./controllers/index.js")(app);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
