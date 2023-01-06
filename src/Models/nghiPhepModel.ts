import mongoose from "mongoose";
const { Schema } = mongoose;

const nghiPhepSchema = new Schema({
  name: String,
  gmail: { type: String, unique: true },
  ngayDangKiPhep: Array,
  soPhepDangKi: Number,
  soNgayPhepConLai: { type: Number, min: [0, "less than zero"] },
  lyDo: String,
});

export default mongoose.model("nghiPhep", nghiPhepSchema);
