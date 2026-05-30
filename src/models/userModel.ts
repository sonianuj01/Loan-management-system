import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will be hashed 
  role: { 
    type: String, 
    enum: ['Admin', 'Sales', 'Sanction', 'Disbursement', 'Collection', 'Borrower'], // [cite: 72]
    default: 'Borrower' 
  },
  pan: { type: String },
  dob: { type: Date },
  employmentMode: { type: String, enum: ['Salaried', 'Self-Employed', 'Unemployed'] }, // [cite: 32]
  monthlySalary: { type: Number }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;