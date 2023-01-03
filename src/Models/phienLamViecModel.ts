import mongoose from 'mongoose';
const { Schema } = mongoose;

const PhienLamViecSchema = new Schema({
  name: String,
  noiLam: String,
  active: Boolean,
  batDau: Date,
  ketThuc: Date,
  thoiGianLam: Number,
});

export default mongoose.model("phienLamViec", PhienLamViecSchema);
