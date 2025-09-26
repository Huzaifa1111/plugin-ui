import { AppLayout } from "@/components/layout"
import { SettingsForm } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Configure your Nexi integration and synchronization preferences</p>
        </div>

        <div className="max-w-2xl">
          <SettingsForm />
        </div>
      </div>
    </AppLayout>
  )
}
