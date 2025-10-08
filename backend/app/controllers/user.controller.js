const db = require("../models");
const User = db.users;
const Project = db.projects;

// Create and Save a new Book
exports.create = (req, res) => {
  // Validate request
  // if (!req.body.username) {
  //     res.status(400).send({ message: "title can not be empty!" });
  //     return;
  // }
  // Create a Book
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    project: req.body.project,
    role: req.body.role,
  });
  // Save Book in the database
  user
    .save(user)
    .then((data) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: `User ${req.body.username} added successfully`,
        })
      );
      console.log("1 document inserted");
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

//assign pm to project
exports.assignPM = (req, res) => {
  const project = req.body.projectid;
  const PMid = req.body.PMid;
  console.log(project);
  Project.findById(project)
    .then((data) => {
      console.log(data);
      if (!data)
        res.status(200).send(
          JSON.stringify({
            success: false,
            message: "No such Project exists",
          })
        );
      else {
        if (PMid === "") {
          User.findOneAndUpdate(
            { project: project, role: "PROJECTMANAGER" },
            { $set: { project: "" } }
          ).then((data) => {
            res.status(200).send(
              JSON.stringify({
                success: true,
                message: "project manager unassigned successfully",
                newPM: { project: project, username: "" },
              })
            );
          });
        } else {
          User.findById(PMid).then((data) => {
            if (!data || data.role != "PROJECTMANAGER" || data.project != "") {
              res.status(200).send(
                JSON.stringify({
                  success: false,
                  message: "Selected Project Manager not available",
                })
              );
            } else {
              User.findOneAndUpdate(
                { project: project, role: "PROJECTMANAGER" },
                { $set: { project: "" } }
              ).then((data) => {
                console.log(data);
                User.findByIdAndUpdate(PMid, {
                  $set: { project: project },
                }).then((data) => {
                  console.log(data);
                  res.status(200).send(
                    JSON.stringify({
                      success: true,
                      message: "project manager assigned successfully",
                      newPM: { project: project, username: data.username },
                    })
                  );
                });
              });
            }
          });
        }
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

// Retrieve all users from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = {};
  User.find(condition)
    .then((data) => {
      res.type("application/json");
      res.end(
        JSON.stringify({
          success: true,
          records: data,
          message: "records fetched succesfully",
        })
      );
    })
    .catch((err) => {
      res.writeHead(500, { "content-type": "application/json" });
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
  User.findById(id)
    .then((data) => {
      if (!data)
        res.status(200).send(
          JSON.stringify({
            success: false,
            message: "No such user exists",
          })
        );
      else {
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

//find project employes
exports.findProjectEmployees = (req, res) => {
  query = { role: "EMPLOYEE", project: req.params.id };
  User.find(query, { _id: 1, username: 1 })
    .then((data) => {
      if (!data.length) {
        res.status(200).send(
          JSON.stringify({
            success: false,
            employees: [],
            message: "No Employee available for selected project",
          })
        );
      } else {
        res.status(200).send(
          JSON.stringify({
            success: true,
            employees: data,
            message: "employees for selected project fetched",
          })
        );
      }
    })
    .catch((err) => {
      res.status(500).send(
        JSON.stringify({
          success: false,
          employees: [],
          message: err.message,
        })
      );
    });
};

//find assigned project manager
exports.findassignedPM = (req, res) => {
  const query = { project: { $ne: "" }, role: "PROJECTMANAGER" };
  User.find(query, { _id: 0, username: 1, project: 1 })
    .then((data) => {
      console.log(data);
      res.status(200).send(
        JSON.stringify({
          success: true,
          message: "fetched assigned project managers",
          assignedPMs: data,
        })
      );
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

//find unassigned project manager
exports.findUnassignedPM = (req, res) => {
  const query = { project: "", role: "PROJECTMANAGER" };
  User.find(query, { _id: 1, username: 1 })
    .then((data) => {
      if (!data.length) {
        res.status(200).send(
          JSON.stringify({
            success: true,
            empty: true,
            message: "No Project Manager is available",
            unassignedPMs: [],
          })
        );
      } else {
        res.status(200).send(
          JSON.stringify({
            success: true,
            message: "fetched available project managers successfully",
            unassignedPMs: data,
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
    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(200).send(
            JSON.stringify({
              success: false,
              message: `Cannot update!. Maybe User was not found`,
            })
          );
        } else {
          User.findById(id)
            .then((data) => {
              res.status(200).send(
                JSON.stringify({
                  success: true,
                  message: `User ${req.body.username} updated successfully`,
                  editedrecord: data,
                })
              );
            })
            .catch((err) => {
              res.status(500).send(
                JSON.stringify({
                  success: false,
                  message: `Update successfull, but unable to fetch record!\n${err.message}`,
                })
              );
            });
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
  }
};

// Delete a Book with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(200).send(
          JSON.stringify({
            success: false,
            message: `Couldn't delete selected User. Maybe User was not found!`,
          })
        );
      } else {
        res.status(200).send(
          JSON.stringify({
            success: true,
            message: `Deleted User ${data.username} successfully`,
            deletedid: data._id,
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
