import { getDashboardSnapshot } from "@/mocks/dashboard"

export async function getDashboardData() {
  // Replace this mock adapter with fetch calls to /metrics, /alerts, and /transactions.
  return Promise.resolve(getDashboardSnapshot())
}