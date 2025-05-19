
export interface Activity {
    active_visitors: number,
    total_visitors: number,
    average_stay: string;
  }
  
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
  
  interface Offer {
    id: string;
    token: string;
    description: string;
    created_at: string;
    time_based: boolean;
    time_duration_hours: number;
    expiry_time: string;
    venue: number;
  }
  
  interface UserInfo {
    first_name: string;
    last_name: string;
    username: string;
  }
  
  interface Signup {
    id: number;
    venue: number;
    customer: number;
    join_time: string;
    leave_time: string | null;
    is_active: boolean;
    user: UserInfo;
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
    payment_date: string;
    payment_amount: string;
    last_update: string;
  }
  
export  interface Venue {
    id: number;
    address: Address;
    business_details: BusinessDetails;
    qr_settings: QrSettings;
    offers: Offer[];
    signups: Signup[];
    owner: number;
    owner_username: string;
    payment_details: PaymentDetails;
    name: string;
    description: string;
    logo: string | null;
    venue_type: string;
    capacity: number;
    is_active: boolean;
    require_otp: boolean;
    date_created: string;
    venue_website: string | null;
    insta_url: string | null;
    fb_url: string | null;
    twitter_url: string | null;
  }