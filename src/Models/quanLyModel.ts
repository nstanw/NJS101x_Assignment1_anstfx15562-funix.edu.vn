import mongoose from 'mongoose';
const { Schema } = mongoose;

const quanLySchema = new Schema({
  id: {type: 'string'},
  name: {type: 'string'},
  phuTrach: String
});

export default mongoose.model("quanLy", quanLySchema);
