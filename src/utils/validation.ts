export const validatePostcode = (postcode: string): boolean => {
  // UK postcode regex: allows any amount of whitespace between outward and inward parts.
  // Pattern: one or two letters, one or two digits, optional letter, then whitespace, then digit and two letters.
  const regex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s*[0-9][A-Z]{2}$/i;
  return regex.test(postcode.trim());
};
