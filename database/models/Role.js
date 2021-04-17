const mongoose = require("mongoose");
const { Schema } = mongoose;

const methodsEnum = ["GET", "POST", "PUT", "PATCH", "DELETE", "ALL"];

const RoleSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: true,
  },
  permissions: {
    type: ["string"],
    // check empty array
    validate: (v) => v == null || v.length > 0,
  },
  methods: {
    type: ["string"],
    enum: methodsEnum,
    required: [true, "at least 1 method is required"],
    validate: (v) => v == null || v.length > 0,
  },
  users: [
    {
      type: String,
      ref: "User",
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Role", RoleSchema, "roles");
