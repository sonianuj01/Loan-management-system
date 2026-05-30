import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../../models/userModel';
import { connect } from '../../../../dbConfig/dbConfig';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 400 });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    }

    // Create token payload
    const tokenData = {
      id: user._id,
      fullName: user.fullName,
      role: user.role, // Important for RBAC
      email: user.email
    };

    // Create JWT token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
      role: user.role
    });

    // Set token in HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true, 
      path: '/'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}