const mongoose = require("mongoose");

class ConnectMongoDB {
  static getConnection() {
    mongoose
      .connect(process.env.MONGODB_URI, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log(`DB is connected!`.green))
      .catch((err) => console.log(`${err}`.red));
  }
}

module.exports = ConnectMongoDB;
