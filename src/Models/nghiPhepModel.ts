import mongoose from "mongoose";
const { Schema } = mongoose;

const nghiPhepSchema = new Schema({
  username: String,
  ngay: String,
  gio: Number,
  lyDo: String,
});

export default mongoose.model("nghiPhep", nghiPhepSchema);
