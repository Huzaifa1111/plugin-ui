// mock-data.js
export const dashboardStats = {
  ordersSyncedToday: 47,
  totalOrdersSynced: 1284,
  failedSyncs: 3,
}

export const storeInfo = {
  name: "Awesome Electronics Store",
  domain: "awesome-electronics.myshopify.com",
  plan: "Shopify Plus",
  timezone: "America/New_York",
}

export const chartData = [
  { date: "2025-01-15", orders: 23 },
  { date: "2025-01-16", orders: 31 },
  { date: "2025-01-17", orders: 28 },
  { date: "2025-01-18", orders: 42 },
  { date: "2025-01-19", orders: 47 },
  { date: "2025-01-20", orders: 35 },
  { date: "2025-01-21", orders: 39 },
]

export const ordersData = [
  {
    id: "SH-1001",
    customer: "John Smith",
    status: "Completed",
    syncStatus: "Synced",
    productId: "PROD-1001",
    productName: "Wireless Headphones",
    orderDate: "2025-01-19 14:30",
    syncDate: "2025-01-19 15:00",
  },
  {
    id: "SH-1002",
    customer: "Sarah Johnson",
    status: "Processing",
    syncStatus: "Pending",
    productId: "PROD-1002",
    productName: "Smartphone Case",
    orderDate: "2025-01-19 13:45",
    syncDate: "N/A",
  },
  {
    id: "SH-1003",
    customer: "Mike Davis",
    status: "Completed",
    syncStatus: "Failed",
    productId: "PROD-1003",
    productName: "USB Charger",
    orderDate: "2025-01-19 12:20",
    syncDate: "N/A",
  },
  {
    id: "SH-1004",
    customer: "Emily Wilson",
    status: "Shipped",
    syncStatus: "Synced",
    productId: "PROD-1004",
    productName: "Bluetooth Speaker",
    orderDate: "2025-01-19 11:15",
    syncDate: "2025-01-19 11:30",
  },
  {
    id: "SH-1005",
    customer: "David Brown",
    status: "Completed",
    syncStatus: "Synced",
    productId: "PROD-1005",
    productName: "Laptop Stand",
    orderDate: "2025-01-19 10:30",
    syncDate: "2025-01-19 10:45",
  },
]

export async function fetchDashboardStats() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dashboardStats), 500)
  })
}

export async function fetchChartData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(chartData), 500)
  })
}

export async function fetchOrders() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(ordersData), 500)
  })
}

export async function fetchStoreInfo() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(storeInfo), 300)
  })
}

export async function syncOrders() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Syncing orders...")
      resolve({ success: true, message: "Orders synced successfully" })
    }, 1000)
  })
}