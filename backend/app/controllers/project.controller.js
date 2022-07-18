const db = require("../models");
const Project = db.projects;

// Create and Save a new Book
exports.create = (req, res) => {
  // Validate request
  // if (!req.body.username) {
  //     res.status(400).send({ message: "title can not be empty!" });
  //     return;
  // }
  // Create a Book
  const project = new Project({
    projecttitle: req.body.projecttitle,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
  });
  // Save Book in the database
  project
    .save(project)
    .then((data) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: `Project ${req.body.projecttitle} added successfully`,
          addedrecord: data,
        })
      );
      console.log("1 document inserted");
    })
    .catch((err) => {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: err.message,
        })
      );
    });
};

// Retrieve all Books from the database.
exports.findAll = (req, res) => {
  var condition = {};
  Project.find(condition)
    .then((data) => {
      if (!data.length) {
        res.type("application/json");
        res.end(
          JSON.stringify({
            success: true,
            empty: true,
            records: [],
            message: "No Projects Available",
          })
        );
      } else {
        res.type("application/json");
        res.end(
          JSON.stringify({
            success: true,
            records: data,
            message: "projects fetched succesfully",
          })
        );
      }
    })
    .catch((err) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          records: [],
          message: err.message,
        })
      );
    });
};

// Find a single Book with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Project.findById(id)
    .then((data) => {
      if (!data) {
        res.status(200).send(
          JSON.stringify({
            success: false,
            message: "No such Project exists",
          })
        );
      } else {
        res.status(200).send(
          JSON.stringify({
            success: true,
            record: data,
            message: "user fetched to make edit",
          })
        );
      }
    })
    .catch((err) => {
      res.status(500).send(
        JSON.stringify({
          success: false,
          message: err.message,
        })
      );
    });
};

// Update a Book by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(200).send(
      JSON.stringify({
        success: false,
        message: "data to update cannot be empty",
      })
    );
  } else {
    const id = req.params.id;
    Project.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(200).send(
            JSON.stringify({
              success: false,
              message: `Cannot update!. Maybe Project was not found`,
            })
          );
        } else {
          Project.findById(id)
            .then((data) => {
              res.status(200).send(
                JSON.stringify({
                  success: true,
                  message: `Project ${req.body.projecttitle} updated successfully`,
                  editedrecord: data,
                })
              );
            })
            .catch((err) => {
              res.status(500).send(
                JSON.stringify({
                  success: false,
                  message: `Update successfull, but unable to fetch updated Project!`,
                })
              );
            });
        }
      })
      .catch((err) => {
        res.status(200).send(
          JSON.stringify({
            success: false,
            message: `Unable to update to database`,
          })
        );
      });
  }
};

// Delete a Book with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Project.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(200).send(
          JSON.stringify({
            success: false,
            message: `Couldn't delete selected Project. Maybe Project was not found!`,
          })
        );
      } else {
        res.status(200).send(
          JSON.stringify({
            success: true,
            message: `Deleted Project ${data.projecttitle} successfully`,
            deletedid: data._id,
          })
        );
      }
    })
    .catch((err) => {
      res.status(200).send(
        JSON.stringify({
          success: false,
          message: err.message,
        })
      );
    });
};
