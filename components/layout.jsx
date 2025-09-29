import { Sidebar } from "./sidebar"

export function AppLayout({ children }) {
  return (
    <div className="flex flex-col h-screen bg-background p-x-4">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  )
}