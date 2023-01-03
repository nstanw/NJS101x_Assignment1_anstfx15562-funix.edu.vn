import mongoose from 'mongoose';
const { Schema } = mongoose;

const PhienLamViecSchema = new Schema({
  idNhanVien: String,
  noiLam: String,
  active: Boolean,
  batDau: Date,
  thoiGianLam: Number,
  ketThuc: Date,
});

export default mongoose.model("phienLamViec", PhienLamViecSchema);
