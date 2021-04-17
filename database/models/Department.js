const mongoose = require("mongoose");
const { Schema } = mongoose;

const DepartmentSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: true,
  },
  staffs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Staff",
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
});
