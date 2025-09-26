
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Calendar, Send } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

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
    // Store accessToken in localStorage if provided
    if (accessToken) {
      localStorage.setItem('shopifyAccessToken', accessToken)
    }
    // Fetch orders if shop is provided and token exists (from prop or localStorage)
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
      if (!token) {
        throw new Error('No access token found in localStorage')
      }

      const response = await fetch(`https://naxi-shopify-app.vercel.app/api/orders?shop=${shop}&accessToken=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`)
      }

      const data = await response.json()
      // Transform data if needed to match table structure
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
        syncDate: order.syncDate || 'N/A', // Adjust based on your sync logic
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orders: selectedOrderData,
          source: 'shopify'
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to send orders: ${response.statusText}`)
      }

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
    if (date) {
      filtered = filtered.filter((order) => order.orderDate.includes(date))
    }
    const newSelected = new Set(
      Array.from(selectedOrders).filter(id => filtered.some(order => order.id === id))
    )
    setSelectedOrders(newSelected)
    setFilteredOrders(filtered)
    setCurrentPage(1)
  }

  const handleCheckboxChange = (orderId) => {
    const newSelected = new Set(selectedOrders)
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId)
    } else {
      newSelected.add(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = new Set(filteredOrders.map(order => order.id))
      setSelectedOrders(allIds)
    } else {
      setSelectedOrders(new Set())
    }
  }

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1
  const currentOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const isAllSelected = filteredOrders.length > 0 && 
    filteredOrders.every(order => selectedOrders.has(order.id))

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading orders...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {error}
        <Button variant="outline" onClick={fetchOrders} className="ml-4 gap-2">
          <Calendar className="h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            placeholder="Filter by date"
            value={dateFilter}
            onChange={(e) => handleDateFilter(e.target.value)}
            className="w-48"
          />
        </div>
        <Button variant="outline" onClick={fetchOrders} className="gap-2">
          <Calendar className="h-4 w-4" />
          Refresh Orders
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.size > 0 && (
        <div className="flex justify-between items-center p-4 bg-muted rounded-md">
          <div className="text-sm text-muted-foreground">
            {selectedOrders.size} order(s) selected
          </div>
          <Button onClick={handleSendToNaxi} className="gap-2">
            <Send className="h-4 w-4" />
            Send Orders to Naxi
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded"
                />
              </TableHead>
              <TableHead>Shopify Order ID</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Sync Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedOrders.has(order.id)}
                    onChange={() => handleCheckboxChange(order.id)}
                    className="rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.productId}</TableCell>
                <TableCell>{order.productName}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.syncDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink 
                onClick={() => setCurrentPage(1)} 
                isActive={currentPage === 1}
                disabled={currentPage === 1}
              >
                First
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink 
                onClick={() => setCurrentPage(totalPages)} 
                isActive={currentPage === totalPages}
                disabled={currentPage === totalPages}
              >
                Last
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
