export interface Coupon {
    id: string;
    token: string;
    description: string;
    discount_type: string;
    applicable_to: "all" | "specific";
    min_purchase_amount: string; 
    discount_value: number;
    created_at: string;
    valid_from: string;
    valid_to: string;
    time_based: boolean;
    limited_users: boolean;
    limited_users_count: number;
    status: "active" | "expired" | "scheduled" ;
    uses_per_user: number;
    time_duration_hours: number;
    expiry_time: string;
    total_redumptions: number;
    new_customers_only: boolean;
    venue: number;
  }
  