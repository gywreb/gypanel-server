const Product = require("../database/models/Product");
const Staff = require("../database/models/Staff");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { SuccessResponse } = require("../models/SuccessResponse");

exports.getTotalAnalytic = asyncMiddleware(async (req, res, next) => {});
