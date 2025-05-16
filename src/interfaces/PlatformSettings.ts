export interface PlatformSettings {
    id: number
    platform_name: string
    platform_url: string
    support_email: string
    default_timezone: string
    date_format: string
    open_registration: boolean
    email_verification: boolean
    auto_approve_venues: boolean
    default_subscription_plan: string
    default_trial_period_days: number
    logo: string
    favicon: string
    primary_color: string
    secondary_color: string
    default_theme: string
    allow_users_to_change_theme: boolean
    border_radius: string
    marketing_emails: boolean
    social_notifications: boolean
    security_alerts: boolean
    platform_updates: boolean
    welcome_email_template: string
    email_verification_template: string
    password_reset_template: string
    require_two_factor_auth: boolean
    session_timeout_minutes: number
    password_policy: string
    password_expiry_days: number
    enable_api_access: boolean
    api_rate_limit: number
    default_currency: string
    default_tax_rate: string
    tax_inclusive_pricing: boolean
    credit_debit_cards: boolean
    paypal: boolean
    apple_pay: boolean
    google_pay: boolean
    company_name_invoice: string
    company_address_invoice: string
    vat_tax_id_invoice: string
    invoice_number_prefix: string
    invoice_footer_text: string
    font_family:string
  }
  