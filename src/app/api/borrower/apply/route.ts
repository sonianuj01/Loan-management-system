import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Loan from '../../../../models/loanModel';
import { connect } from '../../../../dbConfig/dbConfig';
import { calculateRepayment } from '../../../../helpers/calculateInterest';

connect();

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user from cookie
    const token = request.cookies.get('token')?.value || '';
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const userId = decodedToken.id;

    const reqBody = await request.json();
    const { principalAmount, tenureDays } = reqBody;

    // 2. Validate Constraints
    if (principalAmount < 50000 || principalAmount > 500000) {
      return NextResponse.json({ error: 'Amount must be between 50K and 5L' }, { status: 400 });
    }
    if (tenureDays < 30 || tenureDays > 365) {
      return NextResponse.json({ error: 'Tenure must be between 30 and 365 days' }, { status: 400 });
    }

    // 3. Recalculate on Server for safety
    const { simpleInterest, totalRepayment } = calculateRepayment(principalAmount, tenureDays);

    // 4. Create Loan Record
    const newLoan = new Loan({
      borrowerId: userId,
      principalAmount,
      tenureDays,
      interestRate: 12,
      totalInterest: simpleInterest,
      totalRepayment,
      status: 'APPLIED' //
    });

    await newLoan.save();

    return NextResponse.json({ 
      message: 'Loan application submitted successfully', 
      success: true,
      loanId: newLoan._id
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}