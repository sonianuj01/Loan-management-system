import { NextRequest, NextResponse } from 'next/server';
import Loan from '../../../../models/loanModel';
import Payment from '../../../../models/paymentModel';
import { connect } from '../../../../dbConfig/dbConfig';

connect();

export async function GET() {
  try {
    // Fetch active (DISBURSED) loans
    const loans = await Loan.find({ status: 'DISBURSED' }).populate('borrowerId', 'fullName email');
    return NextResponse.json({ loans, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { loanId, utrNumber, amount } = await request.json();

    // 1. Check if UTR is unique
    const existingPayment = await Payment.findOne({ utrNumber });
    if (existingPayment) {
      return NextResponse.json({ error: 'UTR Number already exists' }, { status: 400 });
    }

    // 2. Fetch Loan to validate amount
    const loan = await Loan.findById(loanId);
    if (!loan) return NextResponse.json({ error: 'Loan not found' }, { status: 404 });

    const outstandingBalance = loan.totalRepayment - loan.amountPaid;
    if (amount > outstandingBalance) {
      return NextResponse.json({ error: `Payment exceeds outstanding balance of ₹${outstandingBalance}` }, { status: 400 });
    }

    // 3. Record Payment
    const payment = new Payment({ loanId, utrNumber, amount });
    await payment.save();

    // 4. Update Loan tracking and check for Auto-Close
    loan.amountPaid += amount;
    
    // Using simple epsilon comparison for floating point math safety
    if (Math.abs(loan.totalRepayment - loan.amountPaid) < 0.01) {
      loan.status = 'CLOSED';
    }
    
    await loan.save();

    return NextResponse.json({ message: 'Payment recorded successfully', success: true, loan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}