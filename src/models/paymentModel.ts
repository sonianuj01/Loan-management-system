import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  utrNumber: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default Payment;