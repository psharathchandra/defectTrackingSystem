const { ObjectId } = require("mongodb");
module.exports = (mongoose) => {
  const Bug = mongoose.model(
    "bug",
    mongoose.Schema(
      {
        bugsummary: String,
        bugdescription: String,
        bugassignedto: { type: ObjectId },
        bugproject: { type: ObjectId },
        bugstatus: String,
        bugseverity: String,
        bugtype: String,
      },
      { timestamps: true }
    )
  );
  return Bug;
};
