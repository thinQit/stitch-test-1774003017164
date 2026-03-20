export type FeatureCard = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  url?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: "admin" | "user";
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
};
