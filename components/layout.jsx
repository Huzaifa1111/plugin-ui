import { Sidebar } from "./sidebar"

export function AppLayout({ children }) {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}