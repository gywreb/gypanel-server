const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// user for app authenticate
const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "fullname is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Invalid email!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "password must be at least 8 characters"],
      trim: true,
    },
    phone: String,
    company: String,
    avatar: String,
    address: String,
    birthday: String,
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "role is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    invoices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Invoice",
      },
    ],
  },
  { id: false, toJSON: { virtuals: true }, timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) next();
  try {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.statics.generateJwt = function (payload) {
  // generate jwt and return a token when loged in
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", UserSchema, "users");
