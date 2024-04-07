const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Course = new Schema({
  course_id: {
    type: String,
  },

  name: {
    type: String,
  },
  level_of_study: {
    type: String,
  },
  program: {
    type: String,
  },
  modules: {
    type: [String],
    default: [],
  },

  semester: {
    type: String,
  },

  departments: {
    type: [String],
    default: [],
  },
  year_of_study: {
    type: String,
  },

  lecturers: {
    type: [String],
    default: [],
  },

  espb: {
    type: String,
  },

  lecture_session_time: {
    type: [String],
    default: [],
  },
  exercise_session_time: {
    type: [String],
    default: [],
  },

  literature: {
    type: [String],
    default: [],
  },

  link: {
    type: String,
  },
  video: {
    type: String,
  },
  description: {
    type: String,
  },
  note: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },

  status: {
    type: String,
  },
});

module.exports = mongoose.model("Course", Course, "courses6.0");