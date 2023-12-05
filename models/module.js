const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Module = new Schema({
  name: {
    type: String,
  },
  levelOfStudy: {
    type: String,
  },
  accreditation: {
    type: String,
  },
  studie: {
    type: String,
  },
});
module.exports = mongoose.model("Module", Module, "modules");
