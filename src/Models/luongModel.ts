import mongoose from "mongoose";
const { Schema } = mongoose;

const luongThangSchema = new Schema({
  username: { type: String, required: true },
  salaryScale: { type: Number, required: true },
  overTime: { type: Number, required: true },
  lamThieu: { type: Number, required: true },
  tongThoiGian: { type: Number, required: true },
  phepDangKi: { type: Number, required: true },
  thang: { type: Number, required: true, unique: true },
  luong: { type: Number, required: true },
});

export default mongoose.model("luongThang", luongThangSchema);
