import { AppLayout } from "@/components/layout"
import { SettingsForm } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="p-8">
        

        <div className="max-w-2xl">
          <SettingsForm />
        </div>
      </div>
    </AppLayout>
  )
}
