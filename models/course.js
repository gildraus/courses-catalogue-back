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
  programs: {
    type: [String],
    default: [],
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
  thumbnail_url: {
    type: String,
  },
});

module.exports = mongoose.model("Course", Course, "courses11.0");
