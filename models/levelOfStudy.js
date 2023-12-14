const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let LevelOfStudySchema = new Schema({
  levelOfStudyName: {
    type: String,
    required: true,
  },
  programs: [
    {
      programName: {
        type: String,
        required: true,
      },
      modules: [
        {
          module: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

const LevelOfStudyModel = mongoose.model("LevelOfStudy", LevelOfStudySchema, "levelOfStudy");

module.exports = LevelOfStudyModel;
