import { NextRequest, NextResponse } from 'next/server';
import Loan from '../../../../models/loanModel';
import { connect } from '../../../../dbConfig/dbConfig';

connect();

export async function GET() {
  try {
    // Fetch only sanctioned loans
    const loans = await Loan.find({ status: 'SANCTIONED' }).populate('borrowerId', 'fullName email');
    return NextResponse.json({ loans, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { loanId } = await request.json();
    
    const updatedLoan = await Loan.findByIdAndUpdate(
      loanId, 
      { status: 'DISBURSED' }, // Transition to active state
      { new: true }
    );

    return NextResponse.json({ message: 'Loan Disbursed', success: true, loan: updatedLoan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}