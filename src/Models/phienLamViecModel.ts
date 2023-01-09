import mongoose from 'mongoose';
const { Schema } = mongoose;

const PhienLamViecSchema = new Schema({
  name: String,
  gmail: {type: String, unique: true},
  noiLam: String,
  active: Boolean,
  batDau: Date,
  ketThuc: Date,
  thoiGianLam: Number,
  idNhanVien: String,
});

export default mongoose.model("phienLamViec", PhienLamViecSchema);
