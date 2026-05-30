import { NextResponse } from 'next/server';
import User from '../../../../models/userModel';
import Loan from '../../../../models/loanModel';
import { connect } from '../../../../dbConfig/dbConfig';

connect();

export async function GET() {
  try {
    // Find all borrowers
    const allBorrowers = await User.find({ role: 'Borrower' }).select('-password');
    
    // Find users who already have a loan application
    const borrowersWithLoans = await Loan.distinct('borrowerId');
    
    // Filter users who registered but haven't applied
    const leads = allBorrowers.filter(
      user => !borrowersWithLoans.map(id => id.toString()).includes(user._id.toString())
    );

    return NextResponse.json({ leads, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}