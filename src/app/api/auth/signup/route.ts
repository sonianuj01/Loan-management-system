import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '../../../../models/userModel';
import { connect } from '../../../../dbConfig/dbConfig';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { fullName, email, password, role } = reqBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // 

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'Borrower'
    });

    await newUser.save();
    return NextResponse.json({ message: 'User created successfully', success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}