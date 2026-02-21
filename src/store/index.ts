import { create } from 'zustand';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'cutting' | 'bulking' | 'maintenance';
export type Gender = 'male' | 'female';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  height: number;
  weight: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface FitnessResults {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface PaymentStatus {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  pdfUrl?: string;
}

interface AppState {
  // Current view/step
  currentStep: 'landing' | 'calculator' | 'results' | 'subscription' | 'my-plan' | 'admin';
  setCurrentStep: (step: 'landing' | 'calculator' | 'results' | 'subscription' | 'my-plan' | 'admin') => void;
  
  // User profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  
  // Fitness results
  fitnessResults: FitnessResults | null;
  setFitnessResults: (results: FitnessResults) => void;
  
  // Payment status
  paymentStatus: PaymentStatus | null;
  setPaymentStatus: (status: PaymentStatus | null) => void;
  
  // User ID for tracking
  userId: string | null;
  setUserId: (id: string | null) => void;
  
  // Admin token
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  
  // Reset state
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentStep: 'landing',
  setCurrentStep: (step) => set({ currentStep: step }),
  
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
  
  fitnessResults: null,
  setFitnessResults: (results) => set({ fitnessResults: results }),
  
  paymentStatus: null,
  setPaymentStatus: (status) => set({ paymentStatus: status }),
  
  userId: null,
  setUserId: (id) => set({ userId: id }),
  
  adminToken: null,
  setAdminToken: (token) => set({ adminToken: token }),
  
  reset: () => set({
    currentStep: 'landing',
    userProfile: null,
    fitnessResults: null,
    paymentStatus: null,
    userId: null,
  }),
}));
