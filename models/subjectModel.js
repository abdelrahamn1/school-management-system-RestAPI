const mongoose = require("mongoose");

const subjectSchemna = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Subject must required!"],
  },
  code: {
    type: String,
    required: [true, "Subject code required!"],
  },
  description: {
    type: String,
  },
});

const Subject = mongoose.model("Subject", subjectSchemna);
module.exports = Subject;
