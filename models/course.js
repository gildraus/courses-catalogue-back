const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Course = new Schema({
  course_id: {
    type: String,
  },
  accreditation: {
    type: String,
  },

  name: {
    type: String,
  },
  semester: {
    type: String,
  },
  level_of_study: {
    type: String,
  },
  studies: {
    type: [String],
    default: [],
  },
  modules: {
    type: [String],
    default: [],
  },
  departments: {
    type: [String],
    default: [],
  },
  year_of_study: {
    type: [String],
    default: [],
  },

  lecturers: {
    type: [String],
    default: [],
  },

  espb: {
    type: String,
  },
  periodicity: {
    type: String,
  },

  type_of_exam: {
    type: String,
  },
  type_of_lecture: {
    type: String,
  },

  preconditions: {
    type: [String],
    default: [],
  },

  lecture_session_time: {
    type: [String],
    default: [],
  },
  exercise_session_time: {
    type: [String],
    default: [],
  },

  abstract: {
    type: String,
  },
  objective: {
    type: String,
  },
  content: {
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
  tags: {
    type: [String],
  },
  note: {
    type: String,
  },
  restrictions: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
  },
});

module.exports = mongoose.model("Course", Course, "courses3.0");
