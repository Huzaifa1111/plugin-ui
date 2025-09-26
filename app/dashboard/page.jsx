"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout"
import { DashboardCard } from "@/components/dashboard-card"
import { OrdersChart } from "@/components/orders-chart"
import { Button } from "@/components/ui/button"
import { fetchDashboardStats, fetchChartData, syncOrders, fetchStoreInfo } from "@/lib/mock-data"
import { TrendingUp, Package, AlertTriangle, RefreshCw, Store } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState([])
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsData, chartDataResult, storeData] = await Promise.all([
        fetchDashboardStats(),
        fetchChartData(),
        fetchStoreInfo(),
      ])
      setStats(statsData)
      setChartData(chartDataResult)
      setStore(storeData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSyncOrders = async () => {
    setSyncing(true)
    try {
      const result = await syncOrders()
      console.log(result.message)
      await loadData()
    } catch (error) {
      console.error("Error syncing orders:", error)
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-6"></div>
            <div className="grid gap-6 md:grid-cols-3 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Store className="h-4 w-4" />
            <span className="text-sm font-medium">{store?.name || "Loading store..."}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleSyncOrders} disabled={syncing} className="flex items-center space-x-2">
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Syncing..." : "Sync Orders Now"}</span>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <DashboardCard
            title="Orders Synced Today"
            value={stats?.ordersSyncedToday || 0}
            icon={TrendingUp}
            trend="+12% from yesterday"
          />
          <DashboardCard
            title="Total Orders Synced"
            value={stats?.totalOrdersSynced || 0}
            icon={Package}
            trend="+5% from last week"
          />
          <DashboardCard
            title="Failed Syncs"
            value={stats?.failedSyncs || 0}
            icon={AlertTriangle}
            trend="2 resolved today"
          />
        </div>

        <OrdersChart data={chartData} />
      </div>
    </AppLayout>
  )
}
