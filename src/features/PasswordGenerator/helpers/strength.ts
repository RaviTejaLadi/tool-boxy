export function calculateStrength(password: string): number {
  let score = 0;
  if (password.length >= 12) score += 25;
  if (password.length >= 16) score += 25;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 10;
  return Math.min(score, 100);
}

export function getStrengthInfo(strength: number) {
  if (strength < 25) return { label: 'Weak', color: 'bg-red-500' };
  if (strength < 50) return { label: 'Fair', color: 'bg-orange-500' };
  if (strength < 75) return { label: 'Good', color: 'bg-yellow-500' };
  return { label: 'Strong', color: 'bg-green-500' };
}
