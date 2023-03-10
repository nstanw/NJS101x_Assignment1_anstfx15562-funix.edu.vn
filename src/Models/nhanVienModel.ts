import mongoose from 'mongoose';
const { Schema } = mongoose;

const nhanVienSchema = new Schema({
    username:  {type: String , required: true},
    name: {type: String , required: true},
    doB:   {type: Date , required: true},
    startDate:   {type: Date , required: true},
    department:   {type: String , required: true},
    image: String,
});

export default mongoose.model("nhanVien", nhanVienSchema);