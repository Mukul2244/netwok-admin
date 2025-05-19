"use client"

import { useState,useEffect } from "react"
import { Bell, CreditCard, Globe, Mail, Save, Shield } from "lucide-react"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { PlatformSettings } from "@/interfaces/PlatformSettings"

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState({
    marketing: true,
    social: false,
    security: true,
    updates: true,
  })

  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const[loading,setLoading]=useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true)
        const response = await api.get("/su/settings/")
        if (response.data.results && response.data.results.length > 0) {
          setSettings(response.data.results[0])
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchSettings()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-950 dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your platform settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5 sm:w-[600px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure general platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue={settings?.platform_name || ""} />

              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-url">Platform URL</Label>
                <div className="flex items-center">
                  <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input">https://</span>
                  <Input id="platform-url" defaultValue={settings?.platform_url.replace("https://", "") || ""} />

                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
<Input id="support-email" type="email" defaultValue={settings?.support_email || ""} />

              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Default Timezone</Label>
                <Select defaultValue={settings?.default_timezone}>

                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                    <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 ">
                <Label htmlFor="date-format">Date Format</Label>
                <Select  defaultValue={settings?.date_format} >
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
            <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
  <Save className="mr-2 h-4 w-4" />
  Save Changes
</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registration & Onboarding</CardTitle>
              <CardDescription>Configure user registration and onboarding settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="open-registration">Open Registration</Label>
                  <Switch id="open-registration" checked={settings?.open_registration} />

                </div>
                <p className="text-sm text-muted-foreground">Allow new venues to register for accounts</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-verification">Email Verification</Label>
<Switch id="email-verification" checked={settings?.email_verification} />

                </div>
                <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-approve">Auto-Approve Venues</Label>
<Switch id="auto-approve" checked={settings?.auto_approve_venues} />

                </div>
                <p className="text-sm text-muted-foreground">Automatically approve new venue registrations</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-plan">Default Subscription Plan</Label>
                <Select defaultValue={settings?.default_subscription_plan}>
                  <SelectTrigger id="default-plan">
                    <SelectValue placeholder="Select default plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trial-days">Default Trial Period (Days)</Label>
                <Input id="trial-days" type="number" min="0" defaultValue={settings?.default_trial_period_days} />
              </div>
            </CardContent>
            <CardFooter>
            <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
  <Save className="mr-2 h-4 w-4" />
  Save Changes
</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize your platform&apos;s branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {settings && (
  <>
    <div className="space-y-2">
      <Label>Logo</Label>
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-muted overflow-hidden">
          <img
            src={settings.logo}
            alt="Platform Logo"
            className="h-full w-full object-contain"
          />
        </div>
        <Button variant="outline">Upload New Logo</Button>
      </div>
    </div>

    <div className="space-y-2">
      <Label>Favicon</Label>
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-md border flex items-center justify-center bg-muted overflow-hidden">
          <img
            src={settings.favicon}
            alt="Favicon"
            className="h-full w-full object-contain"
          />
        </div>
        <Button variant="outline">Upload New Favicon</Button>
      </div>
    </div>
  </>
)}

              <Separator className="my-4" />
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-primary" />
                  <Input id="primary-color" defaultValue={settings?.primary_color}/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-secondary" />
                  <Input id="secondary-color" defaultValue={settings?.secondary_color} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
            <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
  <Save className="mr-2 h-4 w-4" />
  Save Changes
</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Configure theme and appearance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Theme</Label>
                <RadioGroup defaultValue={settings?.default_theme}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system">System</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="allow-theme-toggle">Allow Users to Change Theme</Label>
                  <Switch id="allow-theme-toggle" defaultChecked />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select defaultValue={settings?.font_family}>
                  <SelectTrigger id="font-family">
                    <SelectValue  placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="opensans">Open Sans</SelectItem>
                    <SelectItem value="lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="border-radius">Border Radius</Label>
                <Select defaultValue={settings?.border_radius}>
                  <SelectTrigger id="border-radius">
                    <SelectValue placeholder="Select border radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
            <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
  <Save className="mr-2 h-4 w-4" />
  Save Changes
</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure email notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
                  </div>
                  <Switch
                    id="marketing"
                    checked={emailNotifications.marketing}
                    onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, marketing: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="social">Social Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive emails for connection requests and messages</p>
                  </div>
                  <Switch
                    id="social"
                    checked={emailNotifications.social}
                    onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, social: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="security">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about security updates and login attempts
                    </p>
                  </div>
                  <Switch
                    id="security"
                    checked={emailNotifications.security}
                    onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, security: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="updates">Platform Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about platform updates and maintenance
                    </p>
                  </div>
                  <Switch
                    id="updates"
                    checked={emailNotifications.updates}
                    onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, updates: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
            <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
  <Save className="mr-2 h-4 w-4" />
  Save Changes
</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize email notification templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="welcome-template">Welcome Email</Label>
                <Textarea
                  id="welcome-template"
                  rows={4}
                  defaultValue={settings?.welcome_email_template}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="verification-template">Email Verification</Label>
                <Textarea
                  id="verification-template"
                  rows={4}
                  defaultValue={settings?.email_verification_template}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-reset-template">Password Reset</Label>
                <Textarea
                  id="password-reset-template"
                  rows={4}
                  defaultValue={settings?.password_reset_template}
                />
              </div>
            </CardContent>
            <CardFooter>
            <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
  <Save className="mr-2 h-4 w-4" />
  Save Changes
</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Settings</CardTitle>
              <CardDescription>Configure authentication and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                  <Switch id="two-factor" />
                </div>
                <p className="text-sm text-muted-foreground">Require all users to set up two-factor authentication</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" min="5" defaultValue={settings?.session_timeout_minutes} />
                <p className="text-sm text-muted-foreground">
                  Time of inactivity before users are automatically logged out
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-policy">Password Policy</Label>
                <Select defaultValue={settings?.password_policy}>
                  <SelectTrigger id="password-policy">
                    <SelectValue placeholder="Select password policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                    <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                    <SelectItem value="strong">Strong (8+ chars, mixed case, numbers, symbols)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-expiry">Password Expiry</Label>
                  <Switch id="password-expiry" />
                </div>
                <div className="flex items-center gap-2">
                  <Input id="password-expiry-days" type="number" min="30" defaultValue={settings?.password_expiry_days} disabled />
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
            <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
  <Save className="mr-2 h-4 w-4" />
  Save Changes
</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API & Integrations</CardTitle>
              <CardDescription>Manage API access and third-party integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-api">Enable API Access</Label>
                  <Switch id="enable-api" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">Allow access to the platform API</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-rate-limit">API Rate Limit (requests per minute)</Label>
                <Input id="api-rate-limit" type="number" min="10" defaultValue={settings?.api_rate_limit} />
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Label>Connected Services</Label>
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Email Service</div>
                        <div className="text-sm text-muted-foreground">SendGrid</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Payment Gateway</div>
                        <div className="text-sm text-muted-foreground">Stripe</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                        <Bell className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-sm text-muted-foreground">Firebase</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
            <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
  <Save className="mr-2 h-4 w-4" />
  Save Changes
</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment and billing settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select defaultValue={settings?.default_currency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="cad">CAD ($)</SelectItem>
                    <SelectItem value="aud">AUD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                <Input id="tax-rate" type="number" min="0" step="0.01" defaultValue={settings?.default_tax_rate} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tax-inclusive">Tax Inclusive Pricing</Label>
                  <Switch id="tax-inclusive" />
                </div>
                <p className="text-sm text-muted-foreground">Display prices with tax included</p>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Label>Payment Methods</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Credit/Debit Cards</span>
                    </div>
                    <Switch id="card-payments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>PayPal</span>
                    </div>
                    <Switch id="paypal-payments" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Apple Pay</span>
                    </div>
                    <Switch id="apple-pay" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Google Pay</span>
                    </div>
                    <Switch id="google-pay" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
            <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
  <Save className="mr-2 h-4 w-4" />
  Save Changes
</Button>

            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>Configure invoice and receipt settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue={settings?.company_name_invoice} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Company Address</Label>
                <Textarea
                  id="company-address"
                  rows={3}
                  defaultValue={settings?.company_address_invoice}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-vat">VAT/Tax ID</Label>
                <Input id="company-vat" defaultValue={settings?.vat_tax_id_invoice} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                <Input id="invoice-prefix" defaultValue={settings?.invoice_number_prefix} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-footer">Invoice Footer Text</Label>
                <Textarea
                  id="invoice-footer"
                  rows={3}
                  defaultValue={settings?.invoice_footer_text}
                />
              </div>
            </CardContent>
            <CardFooter>
            <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
  <Save className="mr-2 h-4 w-4" />
  Save Changes
</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
