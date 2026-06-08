export type UserRole = 'student' | 'landlord' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Accommodation {
  id: number;
  title: string;
  type: 'PG' | 'Hostel' | 'Flat' | 'Studio';
  description: string;
  price: number;
  deposit: number;
  distance_km: number;
  safety_score: number;
  verified: boolean;
  available: boolean;
  address: string;
  city: string;
  landlord_id: number;
  landlord_name?: string;
  landlord_phone?: string;
  amenities: string[];
  images: string[];
  rating: number;
  reviews_count: number;
  created_at: string;
}

export interface RoommateProfile {
  id: number;
  user_id: number;
  name: string;
  major: string;
  year: string;
  budget_min: number;
  budget_max: number;
  sleep_schedule: string;
  cleanliness: string;
  study_habits: string;
  diet: string;
  smoking: string;
  pets: string;
  guests: string;
  bio: string;
  avatar?: string;
  compatibility_score?: number;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  paid_by_id: number;
  paid_by_name?: string;
  date: string;
  status: 'pending' | 'settled';
  participants: string[];
  split_amount?: number;
  created_at: string;
}

export interface ExpenseGroup {
  id: number;
  name: string;
  members: string[];
  total_spent: number;
  your_share: number;
  your_balance: number;
}

export interface MaintenanceRequest {
  id: number;
  tenant_id: number;
  tenant_name?: string;
  property_id: number;
  property_title?: string;
  issue: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}

export interface DashboardStats {
  totalListings?: number;
  totalStudents?: number;
  totalLandlords?: number;
  pendingVerifications?: number;
  monthlyRevenue?: number;
  activeBookings?: number;
  totalExpenses?: number;
  pendingExpenses?: number;
  myProperties?: number;
  activeRequests?: number;
  myBalance?: number;
  roommateMatches?: number;
  pendingProofs?: number;
}

export type ProofType =
  | 'ELECTRICITY_BILL'
  | 'PROPERTY_DEED'
  | 'TAX_RECEIPT'
  | 'RENTAL_AGREEMENT'
  | 'AADHAAR_CARD'
  | 'WATER_BILL'
  | 'GAS_CONNECTION'
  | 'SOCIETY_NOC';

export type ProofStatus = 'pending' | 'approved' | 'rejected';

export interface PropertyProof {
  id: number;
  landlordId: number;
  landlordName?: string;
  propertyTitle?: string;
  propertyId?: number;
  proofType: ProofType;
  documentNumber?: string;
  issueDate?: string;
  issuingAuthority?: string;
  documentData?: string; // base64 image
  fileName?: string;
  fileSize?: number;
  notes?: string;
  status: ProofStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  uploadedAt?: string;
}
