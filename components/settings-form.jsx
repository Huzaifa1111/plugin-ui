"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Save, Key } from "lucide-react"

export function SettingsForm() {
  const [settings, setSettings] = useState({
    nexiApiKey: "",
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Settings saved:", settings)
      // Show success message in real app
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleApiKeyChange = (value) => {
    setSettings((prev) => ({ ...prev, nexiApiKey: value }))
  }

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle>API Configuration</CardTitle>
          </div>
          <CardDescription>Configure your Nexi API credentials to enable order synchronization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Nexi API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Nexi API key"
              value={settings.nexiApiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Your API key is encrypted and stored securely. You can find this in your Nexi dashboard.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving || !settings.nexiApiKey.trim()}
          className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground"
        >
          <Save className={`h-4 w-4 ${saving ? "animate-pulse" : ""}`} />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </Button>
      </div>
    </div>
  )
}