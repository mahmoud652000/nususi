export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  booksCount: number;
  avatar?: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  year?: number;
  fileUrl: string;
  coverUrl?: string;
  downloads: number;
  views: number;
  userId: User | string;
  status: 'pending' | 'approved' | 'rejected';
  fileSize: number;
  pages?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
}

export interface DashboardStats {
  stats: {
    totalBooks: number;
    totalUsers: number;
    totalDownloads: number;
    totalViews: number;
  };
  booksByCategory: { _id: string; count: number }[];
  recentBooks: Book[];
  topBooks: Book[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
