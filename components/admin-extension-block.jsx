"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, Clock } from "lucide-react"

// Mock data for the admin extension
const mockOrderSyncData = {
  orderId: "SH-1001",
  syncStatus: "Synced", // 'Synced' | 'Pending' | 'Failed'
  syncedAt: "2025-01-19 16:30",
  nexiTransactionId: "NX-789456123",
}

export function AdminExtensionBlock() {
  const [syncData, setSyncData] = useState(mockOrderSyncData)
  const [resyncing, setResyncing] = useState(false)

  const handleResync = async () => {
    setResyncing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log(`Resyncing order: ${syncData.orderId}`)

      // Update sync data
      setSyncData((prev) => ({
        ...prev,
        syncStatus: "Synced",
        syncedAt: new Date()
          .toLocaleString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          .replace(",", ""),
      }))
    } catch (error) {
      console.error("Error resyncing order:", error)
    } finally {
      setResyncing(false)
    }
  }

  const getSyncStatusIcon = () => {
    switch (syncData.syncStatus) {
      case "Synced":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <RefreshCw className="h-4 w-4 text-red-600" />
    }
  }

  const getSyncStatusColor = () => {
    switch (syncData.syncStatus) {
      case "Synced":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-red-100 text-red-800"
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">N</span>
          </div>
          <span>Nexi Sync Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <div className="flex items-center space-x-2">
            {getSyncStatusIcon()}
            <Badge className={getSyncStatusColor()}>{syncData.syncStatus}</Badge>
          </div>
        </div>

        {syncData.syncStatus === "Synced" && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Synced At:</span>
              <span className="text-sm text-muted-foreground">{syncData.syncedAt}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Transaction ID:</span>
              <span className="text-sm font-mono text-muted-foreground">{syncData.nexiTransactionId}</span>
            </div>
          </>
        )}

        {syncData.syncStatus === "Pending" && (
          <div className="text-sm text-muted-foreground">
            Order is queued for synchronization with Nexi payment system.
          </div>
        )}

        {syncData.syncStatus === "Failed" && (
          <div className="text-sm text-red-600">
            Synchronization failed. Please check your API configuration or try again.
          </div>
        )}

        <Button
          onClick={handleResync}
          disabled={resyncing}
          variant="outline"
          className="w-full flex items-center space-x-2 bg-transparent"
        >
          <RefreshCw className={`h-4 w-4 ${resyncing ? "animate-spin" : ""}`} />
          <span>{resyncing ? "Resyncing..." : "Resync Now"}</span>
        </Button>
      </CardContent>
    </Card>
  )
}
