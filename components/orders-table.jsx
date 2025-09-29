// orders-table.jsx
"use client"

import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Calendar, Send } from "lucide-react"
// import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"

export function OrdersTable({ shop, accessToken }) {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [dateFilter, setDateFilter] = useState("")
  const [selectedOrders, setSelectedOrders] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const pageSize = 10

  useEffect(() => {
    if (shop) {
      const storedToken = localStorage.getItem('shopifyAccessToken')
      if (storedToken) {
        fetchOrders()
      } else {
        setError('No access token available. Please authenticate.')
        setLoading(false)
      }
    }
  }, [shop, accessToken])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('shopifyAccessToken')
      if (!token) throw new Error('No access token found in localStorage')

      const response = await fetch(`https://naxi-shopify-app.vercel.app/api/orders?shop=${shop}&accessToken=${token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error(`Failed to fetch orders: ${response.statusText}`)

      const data = await response.json()
      const transformedOrders = data.map(order => ({
        id: order.order_number ? `#${order.order_number}` : order.id.toString(),
        productId: order.line_items?.[0]?.sku || 'N/A',
        productName: order.line_items?.[0]?.name || 'N/A',
        customer: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || 'Guest',
        orderDate: new Date(order.created_at).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        syncDate: order.syncDate || 'N/A',
      }))

      setOrders(transformedOrders)
      setFilteredOrders(transformedOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to fetch orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendToNaxi = async () => {
    const selectedOrderIds = Array.from(selectedOrders)
    if (selectedOrderIds.length === 0) return

    try {
      setLoading(true)

      const selectedOrderData = orders.filter(order => selectedOrderIds.includes(order.id))

      const response = await fetch('https://naxi-shopify-app.vercel.app/api/forward-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: selectedOrderData, source: 'shopify' }),
      })

      if (!response.ok) throw new Error(`Failed to send orders: ${response.statusText}`)

      const result = await response.json()
      console.log('Orders sent to Naxi:', result)
      alert(`Successfully sent ${selectedOrderIds.length} orders to Naxi!`)
      setSelectedOrders(new Set())
    } catch (error) {
      console.error('Error sending orders to Naxi:', error)
      alert('Failed to send orders to Naxi. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDateFilter = (value) => {
    setDateFilter(value)
    filterOrders(value)
  }

  const filterOrders = (date) => {
    let filtered = orders
    if (date) filtered = filtered.filter(order => order.orderDate.includes(date))
    const newSelected = new Set(Array.from(selectedOrders).filter(id => filtered.some(order => order.id === id)))
    setSelectedOrders(newSelected)
    setFilteredOrders(filtered)
    setCurrentPage(1)
  }

  const handleCheckboxChange = (orderId) => {
    const newSelected = new Set(selectedOrders)
    if (newSelected.has(orderId)) newSelected.delete(orderId)
    else newSelected.add(orderId)
    setSelectedOrders(newSelected)
  }

  const handleSelectAll = (checked) => {
    if (checked) setSelectedOrders(new Set(filteredOrders.map(order => order.id)))
    else setSelectedOrders(new Set())
  }

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1
  const currentOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const isAllSelected = filteredOrders.length > 0 && filteredOrders.every(order => selectedOrders.has(order.id))

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading orders...</div>
  if (error) return (
    <div className="text-center py-8 text-muted-foreground">
      {error}
      <Button variant="outline" onClick={fetchOrders} className="ml-4 gap-2">
        <Calendar className="h-4 w-4" /> Retry
      </Button>
    </div>
  )

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Input
            type="date"
            placeholder="Filter by date"
            value={dateFilter}
            onChange={(e) => handleDateFilter(e.target.value)}
            className="w-48"
          />
        </div>
        <div>
          {selectedOrders.size > 0 && (
            <Button onClick={handleSendToNaxi} className="bg-primary text-white hover:bg-accent hover:text-accent-foreground gap-2">
              <Send className="h-4 w-4" /> Send Orders to Naxi
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <Table className="min-w-full border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 p-2">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded"
                />
              </TableHead>
              <TableHead className="p-2">Shopify Order ID</TableHead>
              <TableHead className="p-2">Customer</TableHead>
              <TableHead className="p-2">Product ID</TableHead>
              <TableHead className="p-2">Product Name</TableHead>
              <TableHead className="p-2">Order Date</TableHead>
              <TableHead className="p-2">Sync Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.id} className="border-t">
                <TableCell className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedOrders.has(order.id)}
                    onChange={() => handleCheckboxChange(order.id)}
                    className="rounded"
                  />
                </TableCell>
                <TableCell className="p-2">{order.id}</TableCell>
                <TableCell className="p-2">{order.customer}</TableCell>
                <TableCell className="p-2">{order.productId}</TableCell>
                <TableCell className="p-2">{order.productName}</TableCell>
                <TableCell className="p-2">{order.orderDate}</TableCell>
                <TableCell className="p-2">{order.syncDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredOrders.length > 0 && (
        <Pagination className="mt-4">
          <PaginationContent className="flex items-center space-x-1">
            <PaginationItem>
              <PaginationLink
                className={cn(
                  "px-3 py-1 rounded-md text-sm",
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                )}
                onClick={() => currentPage !== 1 && setCurrentPage(1)}
                aria-disabled={currentPage === 1}
              >
                &lt;&lt;
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                className={cn(
                  "px-3 py-1 rounded-md text-sm",
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                )}
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                aria-disabled={currentPage === 1}
              >
                &lt;
              </PaginationLink>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  className={cn(
                    "px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                    page === currentPage ? "bg-primary text-white" : "hover:bg-gray-200"
                  )}
                  onClick={() => setCurrentPage(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationLink
                className={cn(
                  "px-3 py-1 rounded-md text-sm",
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                )}
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                aria-disabled={currentPage === totalPages}
              >
                &gt;
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                className={cn(
                  "px-3 py-1 rounded-md text-sm",
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                )}
                onClick={() => currentPage !== totalPages && setCurrentPage(totalPages)}
                aria-disabled={currentPage === totalPages}
              >
                &gt;&gt;
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      {filteredOrders.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">No orders found matching the current filters.</div>
      )}
    </div>
  )
}