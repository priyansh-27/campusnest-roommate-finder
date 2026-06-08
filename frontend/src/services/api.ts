import axios, { AxiosError } from 'axios';
import { User, Accommodation, RoommateProfile, Expense, MaintenanceRequest, DashboardStats, PropertyProof } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Spring Boot Backend Integration
// Backend running on: http://localhost:8089
// All requests go through this axios instance and hit live Neon PostgreSQL DB
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8089/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach auth token
apiClient.interceptors.request.use(config => {
  const token = sessionStorage.getItem('cn_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Friendly error wrapper
apiClient.interceptors.response.use(
  resp => resp,
  (err: AxiosError) => {
    if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
      return Promise.reject(new Error(`⚠️ Cannot reach backend at ${API_BASE}. Please start the Spring Boot server.`));
    }
    const msg = (err.response?.data as any)?.message || err.message || 'Request failed';
    return Promise.reject(new Error(msg));
  }
);

// ─── AUTH API ────────────────────────────────────────────────────────────────
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return { user: data.user as User, token: data.token as string };
  },

  register: async (data: { name: string; email: string; phone: string; password: string; role: string }) => {
    const { data: resp } = await apiClient.post('/auth/register', data);
    return { user: resp.user as User, token: resp.token as string };
  },
};

// ─── ACCOMMODATIONS API ──────────────────────────────────────────────────────
export const accommodationsAPI = {
  getAll: async (filters?: { type?: string; city?: string; maxPrice?: number; verified?: boolean }) => {
    const { data } = await apiClient.get<any[]>('/accommodations');
    let result = data.map(mapAccommodation);
    if (filters?.type && filters.type !== 'ALL') result = result.filter(a => a.type === filters.type);
    if (filters?.city && filters.city !== 'ALL') result = result.filter(a => a.city === filters.city);
    if (filters?.maxPrice) result = result.filter(a => a.price <= filters.maxPrice!);
    if (filters?.verified !== undefined) result = result.filter(a => a.verified === filters.verified);
    return result;
  },

  getByLandlord: async (landlordId: number) => {
    const { data } = await apiClient.get<any[]>(`/accommodations/landlord/${landlordId}`);
    return data.map(mapAccommodation);
  },

  create: async (data: Partial<Accommodation>) => {
    const payload = {
      title: data.title,
      type: data.type,
      description: data.description,
      price: data.price,
      deposit: data.deposit,
      distanceKm: data.distance_km,
      address: data.address,
      city: data.city,
      landlordId: data.landlord_id,
      landlordName: data.landlord_name,
      landlordPhone: data.landlord_phone,
      amenities: data.amenities,
      images: data.images || ['https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600'],
      safetyScore: 85,
      verified: false,
      available: true,
    };
    const { data: resp } = await apiClient.post('/accommodations', payload);
    return mapAccommodation(resp);
  },

  verify: async (id: number) => {
    const { data } = await apiClient.put(`/accommodations/${id}/verify`);
    return mapAccommodation(data);
  },

  delete: async (id: number) => {
    await apiClient.delete(`/accommodations/${id}`);
    return { success: true };
  },
};

// Map backend snake_case-ish to frontend camelCase
function mapAccommodation(d: any): Accommodation {
  return {
    id: d.id,
    title: d.title,
    type: d.type,
    description: d.description || '',
    price: parseFloat(d.price) || 0,
    deposit: parseFloat(d.deposit) || 0,
    distance_km: parseFloat(d.distanceKm) || 0,
    safety_score: d.safetyScore || 0,
    verified: !!d.verified,
    available: !!d.available,
    address: d.address || '',
    city: d.city || '',
    landlord_id: d.landlordId,
    landlord_name: d.landlordName,
    landlord_phone: d.landlordPhone,
    amenities: d.amenities || [],
    images: d.images || [],
    rating: parseFloat(d.rating) || 0,
    reviews_count: d.reviewsCount || 0,
    created_at: d.createdAt || new Date().toISOString(),
  };
}

// ─── EXPENSES API ────────────────────────────────────────────────────────────
export const expensesAPI = {
  getAll: async () => {
    const { data } = await apiClient.get<any[]>('/expenses');
    return data.map(mapExpense);
  },

  create: async (data: Partial<Expense>) => {
    const payload = {
      title: data.title,
      amount: data.amount,
      category: data.category,
      paidById: data.paid_by_id,
      paidByName: data.paid_by_name,
      date: data.date || new Date().toISOString().split('T')[0],
      participants: data.participants,
      status: 'pending',
    };
    const { data: resp } = await apiClient.post('/expenses', payload);
    return mapExpense(resp);
  },

  settle: async (id: number) => {
    const { data } = await apiClient.put(`/expenses/${id}/settle`);
    return mapExpense(data);
  },
};

function mapExpense(d: any): Expense {
  return {
    id: d.id,
    title: d.title,
    amount: parseFloat(d.amount) || 0,
    category: d.category,
    paid_by_id: d.paidById,
    paid_by_name: d.paidByName,
    date: d.date,
    status: d.status,
    participants: d.participants || [],
    split_amount: parseFloat(d.splitAmount) || 0,
    created_at: d.createdAt || new Date().toISOString(),
  };
}

// ─── MAINTENANCE API ─────────────────────────────────────────────────────────
export const maintenanceAPI = {
  getAll: async () => {
    const { data } = await apiClient.get<any[]>('/maintenance');
    return data.map(mapMaintenance);
  },

  getByLandlord: async (landlordId: number) => {
    const { data } = await apiClient.get<any[]>(`/maintenance/landlord/${landlordId}`);
    return data.map(mapMaintenance);
  },

  create: async (data: Partial<MaintenanceRequest>) => {
    const payload = {
      tenantId: data.tenant_id,
      tenantName: data.tenant_name,
      propertyId: data.property_id,
      propertyTitle: data.property_title,
      issue: data.issue,
      priority: data.priority,
      status: 'open',
    };
    const { data: resp } = await apiClient.post('/maintenance', payload);
    return mapMaintenance(resp);
  },

  updateStatus: async (id: number, status: MaintenanceRequest['status']) => {
    const { data } = await apiClient.put(`/maintenance/${id}/status`, { status });
    return mapMaintenance(data);
  },
};

function mapMaintenance(d: any): MaintenanceRequest {
  return {
    id: d.id,
    tenant_id: d.tenantId,
    tenant_name: d.tenantName,
    property_id: d.propertyId,
    property_title: d.propertyTitle,
    issue: d.issue,
    priority: d.priority,
    status: d.status,
    created_at: d.createdAt,
  };
}

// ─── ROOMMATES API (frontend-only since matching uses local algorithm) ──────
const ROOMMATES_LOCAL: RoommateProfile[] = [
  { id: 1, user_id: 2, name: 'Rahul Kumar', major: 'Computer Science', year: 'Sophomore', budget_min: 8000, budget_max: 14000, sleep_schedule: 'Night Owl', cleanliness: 'Neat Freak', study_habits: 'Silence', diet: 'Vegetarian', smoking: 'No', pets: 'Love', guests: 'Rarely', bio: 'CS student, late night coder, keep desk spotless. Let\'s split a 2BHK near Gate 2!', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150', compatibility_score: 96 },
  { id: 2, user_id: 4, name: 'Priya Mehta', major: 'Economics', year: 'Junior', budget_min: 10000, budget_max: 16000, sleep_schedule: 'Early Bird', cleanliness: 'Moderate', study_habits: 'Music Ok', diet: 'Vegan', smoking: 'No', pets: 'None', guests: 'Weekends', bio: 'Early riser, love meal-prepping and jogging. Looking for a quiet, clean flatmate.', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150', compatibility_score: 91 },
  { id: 3, user_id: 6, name: 'Ananya Singh', major: 'Architecture', year: 'Sophomore', budget_min: 9000, budget_max: 15000, sleep_schedule: 'Night Owl', cleanliness: 'Neat Freak', study_habits: 'Background Music', diet: 'Vegetarian', smoking: 'No', pets: 'Love', guests: 'Rarely', bio: 'Architecture student with large drawing board.', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150', compatibility_score: 88 },
  { id: 4, user_id: 7, name: 'Karan Mehta', major: 'MBA', year: 'First Year', budget_min: 12000, budget_max: 20000, sleep_schedule: 'Flexible', cleanliness: 'Moderate', study_habits: 'Library', diet: 'Non-Veg', smoking: 'No', pets: 'None', guests: 'Weekends', bio: 'MBA student, mostly out, very easygoing.', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150', compatibility_score: 84 },
];

export const roommatesAPI = {
  getAll: async () => ROOMMATES_LOCAL,
  getMatch: async (_userId: number) => ROOMMATES_LOCAL,
};

// ─── USERS API ───────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: async () => {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  getStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<any>('/stats');
    return {
      totalListings: data.totalListings || 0,
      totalStudents: data.totalStudents || 0,
      totalLandlords: data.totalLandlords || 0,
      pendingVerifications: data.pendingVerifications || 0,
      monthlyRevenue: data.monthlyRevenue || 0,
      activeBookings: data.activeBookings || 0,
      totalExpenses: data.totalExpenses || 0,
      pendingExpenses: data.pendingExpenses || 0,
      myProperties: data.myProperties || 0,
      activeRequests: data.activeRequests || 0,
      myBalance: data.myBalance || 0,
      roommateMatches: data.roommateMatches || 4,
    };
  },
};

// ─── SUBSCRIPTIONS API ───────────────────────────────────────────────────────
export const subscriptionAPI = {
  getActive: async (landlordId: number) => {
    const { data } = await apiClient.get(`/subscriptions/landlord/${landlordId}`);
    return data;
  },
  subscribe: async (landlordId: number, plan: 'starter' | 'growth' | 'pro') => {
    const { data } = await apiClient.post('/subscriptions', { landlordId, plan });
    return data;
  },
};

// ─── SOLO SEEKERS API ────────────────────────────────────────────────────────
export const soloSeekersAPI = {
  getAll: async () => {
    const { data } = await apiClient.get<any[]>('/solo-seekers');
    return data;
  },
  create: async (post: any) => {
    const { data } = await apiClient.post('/solo-seekers', post);
    return data;
  },
};

// ─── COMMUNITY API ───────────────────────────────────────────────────────────
export const communityAPI = {
  getPosts: async () => {
    const { data } = await apiClient.get<any[]>('/community/posts');
    return data;
  },
  createPost: async (post: any) => {
    const { data } = await apiClient.post('/community/posts', post);
    return data;
  },
  upvote: async (id: number) => {
    const { data } = await apiClient.put(`/community/posts/${id}/upvote`);
    return data;
  },
  reply: async (id: number, text: string) => {
    const { data } = await apiClient.post(`/community/posts/${id}/reply`, { text });
    return data;
  },
};

// ─── PROPERTY PROOFS API ─────────────────────────────────────────────────────
export const proofsAPI = {
  getAll: async () => {
    const { data } = await apiClient.get<PropertyProof[]>('/proofs');
    return data;
  },
  getPending: async () => {
    const { data } = await apiClient.get<PropertyProof[]>('/proofs/pending');
    return data;
  },
  getByLandlord: async (landlordId: number) => {
    const { data } = await apiClient.get<PropertyProof[]>(`/proofs/landlord/${landlordId}`);
    return data;
  },
  getStatus: async (landlordId: number) => {
    const { data } = await apiClient.get<{ approved: number; pending: number; rejected: number; canListProperty: boolean }>(`/proofs/landlord/${landlordId}/status`);
    return data;
  },
  upload: async (proof: Partial<PropertyProof>) => {
    const { data } = await apiClient.post<PropertyProof>('/proofs', proof);
    return data;
  },
  approve: async (id: number, reviewNotes?: string, reviewedBy?: string) => {
    const { data } = await apiClient.put<PropertyProof>(`/proofs/${id}/approve`, { reviewNotes, reviewedBy });
    return data;
  },
  reject: async (id: number, reviewNotes?: string, reviewedBy?: string) => {
    const { data } = await apiClient.put<PropertyProof>(`/proofs/${id}/reject`, { reviewNotes, reviewedBy });
    return data;
  },
  delete: async (id: number) => {
    await apiClient.delete(`/proofs/${id}`);
    return { success: true };
  },
};

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
export const healthAPI = {
  check: async () => {
    try {
      const { data } = await apiClient.get('/health');
      return { online: true, ...data };
    } catch (e: any) {
      return { online: false, message: e.message };
    }
  },
};

export default {
  auth: authAPI,
  accommodations: accommodationsAPI,
  roommates: roommatesAPI,
  expenses: expensesAPI,
  maintenance: maintenanceAPI,
  users: usersAPI,
  subscriptions: subscriptionAPI,
  soloSeekers: soloSeekersAPI,
  community: communityAPI,
  proofs: proofsAPI,
  health: healthAPI,
};
