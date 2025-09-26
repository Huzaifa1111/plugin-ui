import { AdminExtensionBlock } from "@/components/admin-extension-block"

export default function AdminExtensionPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopify Admin UI Extension Mock</h1>
          <p className="text-gray-600 mt-2">
            This represents how the Nexi Sync block would appear in a Shopify order details page
          </p>
        </div>

        {/* Mock Shopify Order Context */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order #SH-1001</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-medium text-gray-900">Customer</h3>
              <p className="text-gray-600">John Smith</p>
              <p className="text-gray-600">john.smith@example.com</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Order Details</h3>
              <p className="text-gray-600">Total: $129.99</p>
              <p className="text-gray-600">Status: Completed</p>
            </div>
          </div>

          {/* This is where the Admin UI Extension would be embedded */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-900 mb-4">Payment Integration</h3>
            <AdminExtensionBlock />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">About Admin UI Extensions</h3>
          <p className="text-blue-800 text-sm">
            In a real Shopify app, this component would be embedded directly into the Shopify Admin order details page
            using Shopify's Admin UI Extensions framework. The extension would have access to the order context and
            could display real-time sync status for each order.
          </p>
        </div>
      </div>
    </div>
  )
}
