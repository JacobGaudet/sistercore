export const DELIVERY_ZIPS = new Set(["78641", "78645", "78613", "78642", "78628", "78717"]); // update to your area

export function isZipDeliverable(zip?: string) {
  return !!zip && DELIVERY_ZIPS.has(zip);
}

export function deliveryFeeCents(zip?: string) {
  return isZipDeliverable(zip) ? 500 : 0;
}
