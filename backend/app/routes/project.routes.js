module.exports = (app) => {
  const projects = require("../controllers/project.controller.js");

  var router = require("express").Router();

  // Create a new Book
  router.post("/", projects.create);

  // Retrieve all Books
  router.get("/", projects.findAll);

  // Retrieve a single Book with id
  router.get("/:id", projects.findOne);

  // Update a Book with id
  router.put("/:id", projects.update);

  // Delete a Book with id
  router.delete("/:id", projects.delete);

  app.use("/api/projects", router);
};
