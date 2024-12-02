const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  image: String,
  title: {
    type: String,
    required: [true, "Event Title is required!"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Event Description is required!"],
  },
  date: Date,
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
