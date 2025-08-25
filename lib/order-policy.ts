// lib/order-policy.ts
export const CAPACITY_PER_DAY = Number(process.env.CAPACITY_PER_DAY || 12);
export const MAX_DAYS_AHEAD = Number(process.env.MAX_DAYS_AHEAD || 30);

export function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
export function endOfDay(d: Date) { const x = new Date(d); x.setHours(23,59,59,999); return x; }
