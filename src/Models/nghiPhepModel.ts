import mongoose from "mongoose";
const { Schema } = mongoose;

const nghiPhepSchema = new Schema({
  username: String,
  ngayStart: String,
  ngayEnd: String,
  soNgay: Number,
  lyDo: String,
});

export default mongoose.model("nghiPhep", nghiPhepSchema);
