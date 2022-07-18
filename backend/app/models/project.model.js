module.exports = (mongoose) => {
  const Project = mongoose.model(
    "project",
    mongoose.Schema(
      {
        projecttitle: String,
        startdate: String,
        enddate: String,
      },
      { timestamps: true }
    )
  );
  return Project;
};
