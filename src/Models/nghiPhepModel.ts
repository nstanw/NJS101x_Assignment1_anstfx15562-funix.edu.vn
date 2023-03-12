import mongoose from "mongoose";
const { Schema } = mongoose;

const nghiPhepSchema = new Schema({
  username: String,
  ngayDangKy: Date,
  soNgay: Number,
  lyDo: String,
});

export default mongoose.model("nghiPhep", nghiPhepSchema);
