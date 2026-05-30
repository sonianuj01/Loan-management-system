import { NextRequest, NextResponse } from 'next/server';
import User from '../../../../models/userModel';
import Loan from '../../../../models/loanModel';
import { connect } from '../../../../dbConfig/dbConfig';

connect();

export async function GET() {
  try {
    // Fetch all APPLIED loans and populate borrower details
    const loans = await Loan.find({ status: 'APPLIED' }).populate('borrowerId', 'fullName email pan');
    return NextResponse.json({ loans, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { loanId, status, rejectionReason } = await request.json();
    
    // Enforce status transitions[cite: 1]
    if (!['SANCTIONED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status transition' }, { status: 400 });
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      loanId, 
      { status, rejectionReason: rejectionReason || null },
      { new: true }
    );

    return NextResponse.json({ message: `Loan ${status}`, success: true, loan: updatedLoan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}