export interface User {
  id: string;
  name: string;
  email: string;
  password: string; 

}

export interface Business {
  id: string;
  name: string;
  description: string;
  managerEmail: string; // עדכון לשימוש ב-managerEmail
}


export interface Service {
  id: string;
  name: string;
  description: string;
  producerEmail: string; // עדכון לשימוש ב-producerEmail
}

export interface Meeting {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface BusinessState {
  business: Business | null;
  loading: boolean;
  error: string | null;
}

export interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

export interface MeetingsState {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
}
