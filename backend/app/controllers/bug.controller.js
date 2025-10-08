const db = require("../models");
const Bug = db.bugs;
const Project = db.projects;
const User = db.users;

exports.create = (req, res) => {
  // Validate request
  // if (!req.body.username) {
  //     res.status(400).send({ message: "title can not be empty!" });
  //     return;
  // }
  // Create a Book
  const bug = new Bug({
    bugsummary: req.body.bugsummary,
    bugdescription: req.body.bugdescription,
    bugassignedto: req.body.bugassignedto,
    bugstatus: req.body.bugstatus,
    bugproject: req.body.bugproject,
    bugseverity: req.body.bugseverity,
    bugtype: req.body.bugtype,
  });

  // Save Book in the database

  bug
    .save(bug)
    .then((data) => {
      console.log("1 document inserted");
      let record = {
        ...data._doc,
        assigneedetails: "Unassigned",
        projectdetails: "No Project",
      };
      Project.findById(data.bugproject).then((pdata) => {
        if (pdata) {
          record.projectdetails = pdata.projecttitle;
        }
        User.findById(data.bugassignedto).then((udata) => {
          if (udata) {
            record.assigneedetails = udata.username;
          }
          console.log(record);
          res.writeHead(200, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
              message: `bug added successfully`,
              addedbug: record,
            })
          );
        });
      });
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

// exports.findAll = (req, res) => {
//   var condition = {};
//   Report.find(condition)
//     .then((data) => {
//       if (!data.length) {
//         res.type("application/json");
//         res.end(
//           JSON.stringify({
//             success: true,
//             empty: true,
//             records: [],
//             message: "No Reports Available",
//           })
//         );
//       } else {
//         res.type("application/json");
//         res.end(
//           JSON.stringify({
//             success: true,
//             records: data,
//             message: "Reports fetched succesfully",
//           })
//         );
//       }
//     })
//     .catch((err) => {
//       res.writeHead(200, { "content-type": "application/json" });
//       res.end(
//         JSON.stringify({
//           success: false,
//           records: [],
//           message: err.message,
//         })
//       );
//     });
// };
exports.findAll = (req, res) => {
  Bug.aggregate([
    {
      $lookup: {
        from: "users", // collection name in db
        localField: "bugassignedto",
        foreignField: "_id",
        as: "assigneedetails",
      },
    },
    {
      $lookup: {
        from: "projects", // collection name in db
        localField: "bugproject",
        foreignField: "_id",
        as: "projectdetails",
      },
    },
  ]).exec(function (err, data) {
    if (!err) {
      if (!data.length) {
        res.type("application/json");
        res.end(
          JSON.stringify({
            success: true,
            empty: true,
            records: [],
            message: "No bugs Available",
          })
        );
      } else {
        data = data.map((record) => {
          let ad = "unassigned";
          let pd = "No Project";
          if (record.assigneedetails.length) {
            ad = record.assigneedetails[0].username;
          }
          if (record.projectdetails.length) {
            pd = record.projectdetails[0].projecttitle;
          }

          var bug = {
            _id: record._id,
            bugsummary: record.bugsummary,
            bugdescription: record.bugdescription,
            bugstatus: record.bugstatus,
            bugtype: record.bugtype,
            bugseverity: record.bugseverity,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            assigneedetails: ad,
            projectdetails: pd,
            bugproject: record.bugproject,
            bugassignedto: record.bugassignedto,
          };
          return bug;
        });

        res.type("application/json");
        res.end(
          JSON.stringify({
            success: true,
            records: data,
            message: "bugs fetched succesfully",
          })
        );
      }
    } else {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          records: [],
          message: err.message,
        })
      );
    }
  });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Bug.findById(id)
    .then((data) => {
      if (!data) {
        res.status(200).send(
          JSON.stringify({
            success: false,
            message: "No such Bug exists",
          })
        );
      } else {
        res.status(200).send(
          JSON.stringify({
            success: true,
            record: data,
            message: "Bug fetched to make edit",
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

exports.update = (req, res) => {
  const id = req.params.id;
  if (!req.body) {
    return res.status(200).send(
      JSON.stringify({
        success: false,
        message: "data to update cannot be empty",
      })
    );
  } else {
    Bug.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
      returnOriginal: false,
    })
      .then((data) => {
        if (!data) {
          res.status(200).send(
            JSON.stringify({
              success: false,
              message: `Cannot update! Maybe bug details was not found`,
            })
          );
        } else {
          let record = {
            ...data._doc,
            assigneedetails: "Unassigned",
            projectdetails: "No Project",
          };
          Project.findById(data.bugproject).then((pdata) => {
            if (pdata) {
              record.projectdetails = pdata.projecttitle;
            }
            User.findById(data.bugassignedto).then((udata) => {
              if (udata) {
                record.assigneedetails = udata.username;
              }

              res.writeHead(200, { "content-type": "application/json" });
              res.end(
                JSON.stringify({
                  success: true,
                  message: `bug updated successfully`,
                  editedbug: record,
                })
              );
            });
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
