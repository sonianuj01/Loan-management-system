import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '../../../models/userModel';
import { connect } from '../../../dbConfig/dbConfig';

connect();

export async function GET() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const roles = ['Admin', 'Sales', 'Sanction', 'Disbursement', 'Collection', 'Borrower'];
    
    for (const role of roles) {
      const name = role === 'Admin' ? 'Anuj Verma' : `${role} Executive`;
  
      await User.findOneAndUpdate(
        { email: `${role.toLowerCase()}@lms.com` },
        { 
          fullName: name, 
          email: `${role.toLowerCase()}@lms.com`, 
          password: hashedPassword, 
          role 
        },
        { upsert: true, new: true }
      );
    }
    
    return NextResponse.json({ message: 'Database seeded successfully with all roles.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}