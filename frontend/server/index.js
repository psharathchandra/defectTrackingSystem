var express = require("express");
var cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
var app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var mongourl = "mongodb://localhost:27017/DefectTrackingSystem";

app.get("/users", function (req, res) {
  MongoClient.connect(mongourl, function (err, db) {
    if (err) throw err;
    var dbo = db.db("DefectTrackingSystem");
    dbo
      .collection("users")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.type("application/json");
        res.send(result);
        db.close();
      });
  });
});

app.get("/users/:id", function (req, res) {
  MongoClient.connect(mongourl, function (err, db) {
    if (err) throw err;
    var dbo = db.db("DefectTrackingSystem");
    query = { _id: ObjectID(req.params.id) };
    dbo.collection("users").findOne(query, function (err, result) {
      if (err) throw err;
      res.type("application/json");
      res.send(result);
      db.close();
    });
  });
});

app.post("/users", function (req, res) {
  MongoClient.connect(mongourl, function (err, db) {
    if (err) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: err.message,
        })
      );
    } else {
      var dbo = db.db("DefectTrackingSystem");
      dbo.collection("users").insertOne(req.body, function (err, result) {
        if (err) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: err.message,
            })
          );
        } else {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
              message: `User ${req.body.username} added successfully`,
            })
          );
          console.log("1 document inserted");
          db.close();
        }
      });
    }
  });
});

app.put("/users/:id", function (req, res) {
  var _id = ObjectID(req.params.id);
  var newdata = req.body;

  MongoClient.connect(mongourl, function (err, db) {
    if (err) throw err;
    var dbo = db.db("DefectTrackingSystem");
    var query = { _id: _id };

    var newvalues = { $set: { ...newdata } };
    dbo.collection("users").updateOne(query, newvalues, function (err, result) {
      if (err) throw err;
      dbo.collection("users").findOne(query, function (err, result) {
        if (err) throw err;

        res.writeHead(200, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            success: true,
            message: `User ${result.username} Edited successfully`,
            editedrecord: result,
          })
        );
        db.close();
      });
      console.log(result);
    });
  });
});

app.delete("/users/:id", function (req, res) {
  var _id = ObjectID(req.params.id);

  MongoClient.connect(mongourl, function (err, db) {
    if (err) throw err;
    var dbo = db.db("DefectTrackingSystem");
    var query = { _id: _id };

    dbo.collection("users").deleteOne(query, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: `deleted successfully`,
          deletedid: req.params.id,
        })
      );
      db.close();
    });
  });
});

var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("app listening at http://%s:%s", host, port);
});
