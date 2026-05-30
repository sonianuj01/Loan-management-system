export function runBRECheck(age: number, salary: number, employment: string, pan: string) {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const errors: string[] = [];

  if (age < 23 || age > 50) errors.push("Age must be between 23 and 50."); // [cite: 34]
  if (salary < 25000) errors.push("Monthly salary must be at least 25,000."); // [cite: 34]
  if (employment === 'Unemployed') errors.push("Applicant cannot be Unemployed."); // [cite: 37]
  if (!panRegex.test(pan)) errors.push("Invalid PAN card format."); // [cite: 37]

  return {
    passed: errors.length === 0,
    errors
  };
}