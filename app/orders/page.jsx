"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout"
import { OrdersTable } from "@/components/orders-table"
import { fetchOrders } from "@/lib/mock-data"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const ordersData = await fetchOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-6"></div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-10 bg-muted rounded w-48"></div>
                <div className="h-10 bg-muted rounded w-48"></div>
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor your Shopify order synchronization</p>
        </div>

        <OrdersTable orders={orders} />
      </div>
    </AppLayout>
  )
}
