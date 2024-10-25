export function convertToInternational(number: string): string {

  const cleanedNumber = number.replace(/\D/g, '');
  if (cleanedNumber.startsWith('0')) {
    return '+972' + cleanedNumber.substring(1);
  }
  return number;
}

export function maskCardNumber(cardNumber: string): string {
  return '•••• ' + cardNumber.slice(-4);
}