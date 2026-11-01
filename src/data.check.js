// Sanity checks for src/data.js. Run with: node src/data.check.js
import assert from 'node:assert/strict'
import { getMonthSpending } from './data.js'

const sumOf = (list) => Math.round(list.reduce((t, p) => t + p.amount, 0) * 100) / 100

// Mid-month (the Figma's Oct 15): only Oct 1–15 purchases, total matches them.
const oct15 = getMonthSpending(new Date(2026, 9, 15))
assert(oct15.purchases.length > 0)
assert(oct15.purchases.every((p) => p.date.getMonth() === 9 && p.date.getDate() <= 15))
assert.equal(oct15.total, sumOf(oct15.purchases))

// First of the month: only today's purchases count.
const nov1 = getMonthSpending(new Date(2026, 10, 1))
assert(nov1.purchases.every((p) => p.date.getMonth() === 10 && p.date.getDate() === 1))
assert.equal(nov1.purchases.length, 2)

// Year boundary: in January, "last month" is December of the previous year.
const jan5 = getMonthSpending(new Date(2027, 0, 5))
assert(jan5.lastMonthTotal > 0)

// 31st after a 30-day month: all of last month counts.
const oct31 = getMonthSpending(new Date(2026, 9, 31))
assert.equal(oct31.purchases.length, 34) // daysAgo 0–30; days 0, 1 and 3 have two each
assert(oct31.changePct !== null)

console.log('data checks passed')
