const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Session = new Schema({
  course_id: {
    type: String,
  },
  name: {
    type: String,
  },
  program: {
    type: String,
  },
  module: {
    type: String,
  },
  lecture_session_time: {
    type: String,
  },
  exercise_session_time: {
    type: String,
  },
});

module.exports = mongoose.model("Session", Session, "sessions");
