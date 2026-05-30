import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  principalAmount: { type: Number, required: true, min: 50000, max: 500000 }, // 50K - 5L [cite: 43]
  tenureDays: { type: Number, required: true, min: 30, max: 365 }, // 30 - 365 days [cite: 43]
  interestRate: { type: Number, default: 12 }, // Fixed 12% p.a. [cite: 43]
  totalInterest: { type: Number, required: true },
  totalRepayment: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['APPLIED', 'SANCTIONED', 'DISBURSED', 'CLOSED', 'REJECTED'], // [cite: 21, 25, 26, 27]
    default: 'APPLIED' 
  },
  rejectionReason: { type: String },
  salarySlipUrl: { type: String }
}, { timestamps: true });

const Loan = mongoose.models.Loan || mongoose.model('Loan', loanSchema);
export default Loan;