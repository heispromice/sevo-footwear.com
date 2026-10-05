/** All prices are stored as whole Tanzanian shillings. */
export function formatPrice(amount: number, currency = "TZS"): string {
  return `${currency} ${amount.toLocaleString("en-US")}`;
}
