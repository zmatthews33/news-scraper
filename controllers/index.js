const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../models");
const cheerio = require("cheerio");

router.get("/", (req, res) => {
  db.Article.find({})
    .then(dbArticle => res.render("index", dbArticle))
    .catch(err => res.json(err));
  res.render("index");
});

router.get("/scrape", (req, res) => {
  axios.get("https://www.npr.org/sections/music-news/").then(response => {
    // res.send(response.data);
    const $ = cheerio.load(response.data);
    const results = [];

    $("article.item").each(function(i, element) {
      const result = {};
      result.iteminfo = $(this).find(".item-info");
      //        .attr("href");
      //      result.title = $(this)
      //        .find(".title a")
      //        .text();
      result.imagewrap = $(this)
        .find(".imagewrap")
        .text();
      //      result.content = $(this)
      //        .find(".content")
      //        .text()
      //        .trim();
      results.push(result);
    });

    res.json(results);
  });
});

router.post("/articles", (req, res) => {
  db.Article.create(req.body)
    .then(dbArticle => {
      res.json(dbArticle);
    })
    .catch(err => {
      console.log(err);
    });
});

router.delete("/articles/:id", (req, res) => {
  db.Article.deleteOne({ _id: req.params.id }, (err, complete) =>
    res.send("complete")
  );
});

module.exports = router;
