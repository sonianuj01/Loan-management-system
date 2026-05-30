import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connect } from '../../../../dbConfig/dbConfig';
import User from '../../../../models/userModel';

// Ensure the database is connected
connect();

export async function GET(request: NextRequest) {
  try {
    // 1. Extract the token from the HTTP-only cookie
    const token = request.cookies.get('token')?.value || '';
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthenticated' 
      }, { status: 401 });
    }

    // 2. Verify and decode the JWT
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    
    // 3. Find the user in the database (exclude the password)
    const user = await User.findById(decodedToken.id).select('-password');
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }

    // 4. Return the user information
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role // Admin, Sales, Sanction, Disbursement, Collection, or Borrower
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: 'Authentication check failed', 
      error: error.message 
    }, { status: 500 });
  }
}