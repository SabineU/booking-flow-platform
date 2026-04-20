export const calculateTotalPrice = (
  basePrice: number,
  wasteType: string,
  _plasterboardOption?: string // underscore prefix marks as intentionally unused
): number => {
  let total = basePrice;
  if (wasteType === 'heavy') total += 30;
  if (wasteType === 'plasterboard') total += 20;
  return total;
};
