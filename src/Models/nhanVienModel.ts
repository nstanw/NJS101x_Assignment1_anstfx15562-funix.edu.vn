import mongoose from "mongoose";
const { Schema } = mongoose;

const nhanVienSchema = new Schema({
  name: String,
  gmail: { type: String, unique: true },
  doB: Date,
  salaryScale: Number,
  startDate: Date,
  department: String,
  annualLeave: Number,
  image: String,
  nguoiPhuTrach: String,
  role: String,
  username: String, 
    active: Boolean
});

export default mongoose.model("nhanVien", nhanVienSchema);
