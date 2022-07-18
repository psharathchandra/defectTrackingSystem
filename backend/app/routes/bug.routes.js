module.exports = (app) => {
  const bugs = require("../controllers/bug.controller.js");

  var router = require("express").Router();

  // Retrieve all Books
  router.get("/", bugs.findAll);

  router.get("/:id", bugs.findOne);
  router.post("/", bugs.create);
  router.put("/:id", bugs.update);

  app.use("/api/bugs", router);
};
