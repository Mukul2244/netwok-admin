interface Address {
    id: number;
    address: string;
    city: string;
    state: string;
    postal_code: number;
    country: string;
    contact: string;
    business_email: string;
    contact_name: string;
    position: string;
    venue: number;
  }
  
  interface BusinessDetails {
    id: number;
    subscription_plan: string;
    revenue: number;
    total_customers: number;
    total_messages: number;
    total_qr_scanned: number;
    venue: number;
  }
  
  interface QrSettings {
    id: number;
    var_id: string;
    var_id_gen_time: string;
    var_id_expiry_time: string;
    qr_gen_frequency_text: string;
    qr_gen_frequency_hours: number;
    customer_token_refresh_frequency: number;
    venue: number;
  }
  
  interface PaymentDetails {
    id: number;
    venue: number;
    card_no: string;
    expiry_month: number;
    expiry_year: number;
    cvc: string;
    name_on_card: string;
    billing_address: string;
    zipcode: string;
    city: string;
    country: string;
    subscription_start_date: string;
    payment_date: string;
    payment_amount: string;
    last_update: string;
  }
  
export interface Venue {
    id: number;
    address: Address;
    business_details: BusinessDetails;
    qr_settings: QrSettings;
    payment_details: PaymentDetails;
    owner: number;
    owner_username: string;
    name: string;
    description: string;
    logo: string | null;
    venue_type: string;
    capacity: number;
    is_active: boolean;
    require_otp: boolean;
    date_created: string;
    insta_url: string;
    fb_url: string;
    twitter_url: string;
    venue_webiste: string;
  }