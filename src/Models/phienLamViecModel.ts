import mongoose from 'mongoose';
const { Schema } = mongoose;

const PhienLamViecSchema = new Schema({
  name:  {type: String , required: true},
  ngay: {type: Date, required: true},
  noiLam: {type: String, required: true},
  active: {type: Boolean , required: true},
  startTime: {type: Date , required: true},
  endTime: Date,
  tongThoiGian: Number,
  username:  {type: String, required: true},
});

export default mongoose.model("phienLamViec", PhienLamViecSchema);
