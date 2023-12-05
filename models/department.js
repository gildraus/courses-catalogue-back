const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Department = new Schema({
  name: {
    type: String,
  },
});

module.exports = mongoose.model("Department", Department, "departments");
