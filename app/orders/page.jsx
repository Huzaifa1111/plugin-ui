"use client"

import { OrdersTable } from "@/components/orders-table"
import { AppLayout } from "@/components/layout"

export default function OrdersPage() {
  return (
    <AppLayout>
      <OrdersTable  />
    </AppLayout>
  )
}