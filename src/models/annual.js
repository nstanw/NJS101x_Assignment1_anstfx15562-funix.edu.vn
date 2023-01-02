const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Annual = new Schema(
  {

    startDay:  { type: Date, default: Date.now },
    timeStart:  { type: String, },
    endDay:   { type: Date, default: Date.now },
    timeEnd:  { type: String, },
    lyDo:  String,
    // annualLeave:  Number,
  }
);

module.exports = mongoose.model("annual", Annual);
