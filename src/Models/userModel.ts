import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: "string", required: true },
  passsword: { type: "string", required: true },
  role: String,
});

export default mongoose.model("user", userSchema);
