import mongoose from 'mongoose';
const { Schema } = mongoose;

const quanLySchema = new Schema({
  username: {type: 'string', required: true},
  name: {type: 'string', required: true},
});

export default mongoose.model("quanLy", quanLySchema);
