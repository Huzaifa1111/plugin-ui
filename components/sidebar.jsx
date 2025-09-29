"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ShoppingCart, Settings } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <header className="bg-background  p-4 flex items-center justify-between">
      <div>
    <h1 className="text-2xl font-bold text-foreground">
      {pathname === "/orders" ? "Orders" : "Settings"}
    </h1>
    <p className="text-sm text-muted-foreground">
      {pathname === "/orders"
        ? "Manage and monitor your Shopify order synchronization"
        : "Configure your Nexi integration and synchronization preferences"}
    </p>
  </div>
      <div className="flex items-center space-x-4">
        <Link
          href="/orders"
          className={cn(
            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === "/orders"
              ? "bg-primary text-primary-foreground"
              : "text-foreground  "
          )}
        >
          <ShoppingCart size={20} className="mr-2" />
          Orders
        </Link>
        <Link
          href="/settings"
          className={cn(
            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === "/settings"
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Settings size={20} className="mr-2" />
          Settings
        </Link>
        <span className="text-xs text-muted-foreground">Nexi Sync v1.0.0</span>
      </div>
    </header>
  )
}