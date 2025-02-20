const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  profilePicture: String
});

module.exports = mongoose.model("Employee", EmployeeSchema);
