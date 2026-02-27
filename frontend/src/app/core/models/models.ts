export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  verified: boolean;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  location?: string;
  website?: string;
  companyName?: string;
  documentVerified: boolean;
  artistName?: string;
  genre?: string;
  followersCount: number;
  followingCount: number;
  eventsCount: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface BodaEvent {
  id: number;
  organizerId: number;
  organizerName: string;
  organizerAvatar?: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
  status: string;
  imageUrl?: string;
  videoUrl?: string;
  isFeatured: boolean;
  isHybrid: boolean;
  minAge: number;
  refundPolicy?: string;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  venue?: Venue;
  tickets: Ticket[];
  createdAt: string;
}

export interface Venue {
  id: number;
  name: string;
  address?: string;
  city?: string;
  lat?: number;
  lng?: number;
  capacity: number;
}

export interface Ticket {
  id: number;
  type: string;
  price: number;
  quantityTotal: number;
  quantitySold: number;
  available: number;
}

export interface Comment {
  id: number;
  eventId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  body?: string;
  createdAt: string;
}

export interface Message {
  id: number;
  fromUserId: number;
  fromUserName: string;
  fromUserAvatar?: string;
  toUserId: number;
  toUserName: string;
  subject?: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface Notification {
  id: number;
  type: string;
  title?: string;
  payload?: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  activeEvents: number;
  pendingEvents: number;
  recentOrders: RecentOrder[];
}

export interface RecentOrder {
  id: number;
  userName: string;
  eventTitle?: string;
  amount: number;
  status: string;
  createdAt: string;
}

// ── Orders & Checkout ──────────────────────────────────

export interface OrderDto {
  id: number;
  eventId: number;
  eventTitle?: string;
  eventImage?: string;
  venueName?: string;
  venueCity?: string;
  eventDate?: string;
  ticketType?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalAmount: number;
  commission: number;
  paymentMethod?: string;
  paymentStatus: string;
  createdAt: string;
  paidAt?: string;
  tickets: IssuedTicketDto[];
}

export interface IssuedTicketDto {
  id: number;
  ticketCode: string;
  qrCodeUrl?: string;
  used: boolean;
}

export interface SearchSuggestion {
  id: number;
  title: string;
  slug: string;
  category?: string;
  imageUrl?: string;
  city?: string;
  startDateTime: string;
}
