import { NextRequest, NextResponse } from 'next/server';
import { runBRECheck } from '../../../../helpers/breEngine';

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { age, monthlySalary, employmentMode, pan } = reqBody;

    // Run the server-side rule engine
    const breResult = runBRECheck(age, monthlySalary, employmentMode, pan);

    if (!breResult.passed) {
      // Return 200 but indicate failure so the UI can display exact rejection conditions
      return NextResponse.json({ passed: false, errors: breResult.errors });
    }

    return NextResponse.json({ passed: true, message: 'Eligibility checks passed.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}