const mongoose = require("mongoose");

class ConnectMongoDB {
  constructor() {
    this.gfs = null;
  }
  static getConnection() {
    if (mongoose.connection.readyState) {
      mongoose
        .connect(process.env.MONGODB_URI, {
          useCreateIndex: true,
          useFindAndModify: false,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => console.log(`DB is connected!`.green))
        .catch((err) => console.log(`${err}`.red));
      const conn = mongoose.connection;
      conn.once("open", () => {
        this.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
          bucketName: process.env.MONGODB_BUCKET,
        });
      });
    }
  }
}

module.exports = ConnectMongoDB;
