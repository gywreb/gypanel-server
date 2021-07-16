const mongoose = require("mongoose");
const { Schema } = mongoose;

// staff manage by authenticated user
const StaffSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "first name is required"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "last name is required"],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "gender is required"],
    },
    avatar: String,
    address: String,
    birthday: String,
    company: String,
    contactEmail: {
      type: String,
      required: [true, "email is required"],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Invalid email!"],
      unique: true,
    },
    phone: {
      type: String,
      match: [
        /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
        "Invalid phone number",
      ],
    },
    invoices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Invoice",
      },
    ],
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { id: false, toJSON: { virtuals: true }, timestamps: true }
);

module.exports = mongoose.model("Staff", StaffSchema, "staffs");
