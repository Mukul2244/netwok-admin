interface CustomerProfile {
    name: string;
    one_line_desc: string;
    interests: string[];
    profile: string;
    current_venue: number;
    address: string;
    doj: string;
    is_verified: boolean;
    otp_validated: boolean;
    current_table: number;
  }
  
  interface VenueVisit {
    venue_id: number;
    venue_name: string;
    total_visits: number;
    first_visited: string;
    last_visited: string;
  }
  
 export interface Activity {
    type: string;
    timestamp: string;
    venue?: string;
    [key: string]: string | number | null | undefined;
  }
  
 export interface UserData {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
    status: string;
    last_active: string;
    gender: string;
    total_venues_visited: number;
    customer_profile: CustomerProfile;
    venues_visited: VenueVisit[];
    top_3_favourite_venues: VenueVisit[];
    recent_activity: Activity[];
  }
  