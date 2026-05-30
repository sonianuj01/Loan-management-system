// SI = (P x R x T) / (365 x 100) [cite: 45]
export function calculateRepayment(principal: number, tenureDays: number) {
  const rate = 12; // 12% p.a. [cite: 43]
  const simpleInterest = (principal * rate * tenureDays) / (365 * 100); // [cite: 45]
  const totalRepayment = principal + simpleInterest; // [cite: 45]

  return {
    simpleInterest: parseFloat(simpleInterest.toFixed(2)),
    totalRepayment: parseFloat(totalRepayment.toFixed(2))
  };
}