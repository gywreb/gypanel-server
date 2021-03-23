const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
  },
  description: String,
});

module.exports = mongoose.model("Category", CategorySchema, "categories");
