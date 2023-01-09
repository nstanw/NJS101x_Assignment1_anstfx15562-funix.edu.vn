import mongoose from "mongoose";
const { Schema } = mongoose;

const QuanLySchema = new Schema({
  id: String,
  nguoiQuanLy: Array,
  role: String,
});

export default mongoose.model("quanLy", QuanLySchema);
