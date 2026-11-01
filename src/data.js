// Sample purchases as [daysAgo, merchant, category, amount].
// 0 is today
const PURCHASES = [
  [0, 'Whole Foods Market', 'Groceries', 48.62],
  [0, 'Sweetgreen', 'Food & drink', 18.4],
  [1, 'Amazon', 'Shopping', 12.99],
  [1, 'Shell', 'Transport', 65.73],
  [2, 'Blue Bottle Coffee', 'Food & drink', 6.25],
  [3, 'Spotify Premium', 'Subscription', 6.99],
  [3, "Trader Joe's", 'Groceries', 37.18],
  [4, 'Uber', 'Transport', 14.6],
  [5, 'Chipotle', 'Food & drink', 12.85],
  [6, 'Target', 'Shopping', 29.47],
  [7, 'Blue Bottle Coffee', 'Food & drink', 5.75],
  [8, 'DoorDash', 'Food & drink', 27.3],
  [9, 'Netflix', 'Subscription', 15.49],
  [10, 'Whole Foods Market', 'Groceries', 52.04],
  [11, 'Uber', 'Transport', 9.8],
  [12, 'Sweetgreen', 'Food & drink', 16.95],
  [13, 'Amazon', 'Shopping', 23.5],
  [14, 'iCloud+', 'Subscription', 2.99],
  [15, 'Shell', 'Transport', 48.1],
  [16, "Trader Joe's", 'Groceries', 41.66],
  [17, 'Chipotle', 'Food & drink', 11.75],
  [18, 'Blue Bottle Coffee', 'Food & drink', 6.25],
  [19, 'Target', 'Shopping', 18.32],
  [20, 'Adobe Lightroom', 'Subscription', 9.99],
  [21, 'Whole Foods Market', 'Groceries', 44.31],
  [22, 'DoorDash', 'Food & drink', 31.8],
  [23, 'Uber', 'Transport', 12.4],
  [24, 'Amazon', 'Shopping', 34.99],
  [25, 'Sweetgreen', 'Food & drink', 15.6],
  [26, "Trader Joe's", 'Groceries', 35.12],
  [27, 'Shell', 'Transport', 47.25],
  [28, 'Chipotle', 'Food & drink', 12.85],
  [29, 'Blue Bottle Coffee', 'Food & drink', 5.75],
  [30, 'Target', 'Shopping', 26.8],
  [31, 'Whole Foods Market', 'Groceries', 39.88],
  [32, 'Uber', 'Transport', 11.2],
  [33, 'Spotify Premium', 'Subscription', 6.99],
  [34, 'DoorDash', 'Food & drink', 24.15],
  [35, 'Amazon', 'Shopping', 15.49],
  [36, "Trader Joe's", 'Groceries', 33.4],
  [37, 'Sweetgreen', 'Food & drink', 14.75],
  [38, 'Shell', 'Transport', 44.6],
  [39, 'Netflix', 'Subscription', 15.49],
  [40, 'Blue Bottle Coffee', 'Food & drink', 5.75],
  [41, 'Whole Foods Market', 'Groceries', 41.27],
  [42, 'Chipotle', 'Food & drink', 11.75],
  [43, 'Target', 'Shopping', 21.36],
  [44, 'iCloud+', 'Subscription', 2.99],
  [45, 'Uber', 'Transport', 10.9],
  [46, "Trader Joe's", 'Groceries', 30.85],
  [47, 'DoorDash', 'Food & drink', 22.4],
  [48, 'Amazon', 'Shopping', 18.99],
  [49, 'Shell', 'Transport', 42.3],
  [50, 'Adobe Lightroom', 'Subscription', 9.99],
  [51, 'Sweetgreen', 'Food & drink', 14.25],
  [52, 'Whole Foods Market', 'Groceries', 37.92],
  [53, 'Blue Bottle Coffee', 'Food & drink', 5.25],
  [54, 'Uber', 'Transport', 9.6],
  [55, 'Chipotle', 'Food & drink', 11.4],
  [56, 'Target', 'Shopping', 19.75],
  [57, "Trader Joe's", 'Groceries', 29.7],
  [58, 'Amazon', 'Shopping', 14.2],
  [59, 'Shell', 'Transport', 40.15],
  [60, 'DoorDash', 'Food & drink', 21.9],
  [61, 'Whole Foods Market', 'Groceries', 35.6],
]

export function getPurchases(now = new Date()) {
  return PURCHASES.map(([daysAgo, merchant, category, amount], id) => ({
    id,
    merchant,
    category,
    amount,
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo),
  }))
}

const sum = (purchases) =>
  Math.round(purchases.reduce((total, p) => total + p.amount, 0) * 100) / 100

const inMonth = (date, month) =>
  date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth()

// This month so far, compared with the same days of last month ex: Nov 1–3 vs Oct 1–3
export function getMonthSpending(now = new Date()) {
  const purchases = getPurchases(now)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const thisMonth = purchases.filter((p) => inMonth(p.date, now))
  const total = sum(thisMonth)
  const lastMonthTotal = sum(
    purchases.filter((p) => inMonth(p.date, lastMonth) && p.date.getDate() <= now.getDate()),
  )
  const changePct = lastMonthTotal
    ? Math.round(((total - lastMonthTotal) / lastMonthTotal) * 100)
    : null

  return { purchases: thisMonth, total, lastMonthTotal, changePct }
}
