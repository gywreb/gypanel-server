const asyncMiddleware = require("../middleware/asyncMiddleware");
const ConnectMongoDB = require("../database/dbConnect");
const { ErrorResponse } = require("../models/ErrorResponse");

exports.getFile = asyncMiddleware(async (req, res, next) => {
  const { filename } = req.params;
  const file = ConnectMongoDB.gfs.find({ filename }).toArray((err, files) => {
    if (!files || !files.length)
      return next(new ErrorResponse(404, "no file found"));
    ConnectMongoDB.gfs.openDownloadStreamByName(filename).pipe(res);
  });
});
