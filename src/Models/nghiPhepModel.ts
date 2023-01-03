import mongoose from 'mongoose';
const { Schema } = mongoose;

const nghiPhepSchema = new Schema({
    name: String,
    ngayDangKiPhep: Array,
    dangKiGioPhep: Number,
    soNgayPhepConLai: Number,
    lyDo: String,
});

export default mongoose.model("nghiPhep", nghiPhepSchema);
