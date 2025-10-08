module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new Book
  router.post("/", users.create);

  //assign Project Manger to project
  router.post("/assignPM", users.assignPM);

  // Retrieve all Books
  router.get("/", users.findAll);

  //Retrive assigned Project Managers
  router.get("/get-assignedPM", users.findassignedPM);

  //Retrive unassigned Project Managers
  router.get("/get-unassignedPM", users.findUnassignedPM);

  router.get("/projectemployees/:id", users.findProjectEmployees);

  // Retrieve a single Book with id
  router.get("/:id", users.findOne);

  // Update a Book with id
  router.put("/:id", users.update);

  // Delete a Book with id
  router.delete("/:id", users.delete);

  app.use("/api/users", router);
};
