import mongoose from 'mongoose';
const { Schema } = mongoose;

const nhanVienSchema = new Schema({
    name: String,
    doB: Date,
    salaryScale: Number,
    startDate: Date,
    department: String,
    annualLeave: Number,
    image: String,
    active: Boolean,
    username: String,
    phepNam: Number,
});

export default mongoose.model("nhanVien", nhanVienSchema);