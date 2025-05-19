interface VenueVisit {
    venue_id: number;
    venue_name: string;
    total_visits: number;
    first_visited: string;
    last_visited: string;
  }
  
  interface Activity {
    type: string;
    venue?: string;
    chat_id: string;
    total_visits: number;
    message: string;
    timestamp: string;
  }
  
export  interface Connection {
    username?: string;
    first_name?: string;
    last_name?: string;
    venue_name?: string;
    timestamp?: string;
  }
  
export interface CustomerDetails {
    id: number;
    username: string;
    email: string;
    gender: string;
    first_name: string;
    last_name: string;
    status: string;
    last_active: string;
    customer_profile: {
      name: string;
      one_line_desc: string;
      interests: string[];
      profile: string;
      doj: string;
      address: string;
    };
    venues_visited: VenueVisit[];
    top_3_favourite_venues: VenueVisit[];
    total_venues_visited: number;
    recent_activity: Activity[];
  }
  