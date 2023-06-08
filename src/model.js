const mongoose = require("mongoose");

// Define the schema
const ticketSchema = new mongoose.Schema({
  board: {
    type: String,
    required: true,
  },
  pipeline: {
    type: String,
    required: true,
  },
  stage: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  assignee: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

// Create the model
const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
