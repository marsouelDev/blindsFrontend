export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Organizer {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface TicketTypeEvent {
  id: number;
  name: string;
  price: number;
  quantity: number;
  remaining: number;
  sale_start?: string;
  sale_end?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  capacity: number;
  status: 'draft' | 'published' | 'cancelled' | 'ended';
  image?: string;
  is_online: boolean;
  online_link?: string;
  category?: Category;
  organizer: Organizer;
  ticket_types: TicketTypeEvent[];
  tickets_sold: number;
  available_spots: number;
  min_price: number;
  created_at: string;
  updated_at: string;
}

export interface EventCreate {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  capacity: number;
  category_id?: number;
  is_online: boolean;
  online_link?: string;
  image?: File;
  status?: string;
}

export interface EventUpdate extends Partial<EventCreate> {}
