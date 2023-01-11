import mongoose from 'mongoose';
const { Schema } = mongoose;

const PhienLamViecSchema = new Schema({
  ngay: String,
  name: String,
  noiLam: String,
  active: Boolean,
  batDau: Date,
  ketThuc: Date,
  username:{type: String},
  thoiGianLam: Number
});

export default mongoose.model("phienLamViec", PhienLamViecSchema);
