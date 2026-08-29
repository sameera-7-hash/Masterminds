import { getAnalyticsSnapshot } from "@/mocks/analytics"

export async function getAnalyticsData() {
  // Replace this mock adapter with a fetch call to GET /metrics once the backend
  // exposes an analytics endpoint - components read through this function, not the
  // mock directly, so that swap won't touch Analytics.tsx.
  return Promise.resolve(getAnalyticsSnapshot())
}
