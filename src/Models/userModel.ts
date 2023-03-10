import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {type: 'string', required: true},
  password: {type: 'string', required: true},
  role: {type: 'string', required: true},
  name: {type: 'string', required: true},
});

export default mongoose.model("user", userSchema);
