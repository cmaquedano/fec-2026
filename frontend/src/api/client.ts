// ==============================================
// FEC 2026 | Cliente HTTP para a API do backend
// ==============================================

const API_BASE = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || data?.error || 'REQUEST_FAILED');
  }

  return data as T;
}

export interface Photo {
  id: number;
  packet_code: string;
  path: string;
  thumbnail_path: string;
  nickname: string | null;
  instagram: string | null;
  views: number;
  status?: 'pending' | 'approved' | 'rejected';
  lgpd_authorized?: number;
  created_at: string;
}

export interface SystemStats {
  core_status: string;
  agents_connected: number;
  packets_received: number;
  records_published: number;
  pending_review: number;
  lgpd_secured: number;
  database: string;
}

export const api = {
  getStats: () => request<SystemStats>('/stats'),

  getApprovedPhotos: (filter: string = 'all') =>
    request<{ photos: Photo[] }>(`/photos/approved?filter=${filter}`),

  registerView: (id: number) => request(`/photos/${id}/view`, { method: 'POST' }),

  uploadPhoto: (formData: FormData) =>
    request<{ message: string; photo: { packet_code: string; status: string; created_at: string } }>(
      '/upload',
      { method: 'POST', body: formData }
    ),

  adminLogin: (username: string, password: string) =>
    request<{ message: string; admin: { username: string } }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  adminLogout: () => request('/admin/logout', { method: 'POST' }),

  adminMe: () => request<{ admin: { username: string } }>('/admin/me'),

  adminGetAllPhotos: () => request<{ photos: Photo[] }>('/admin/photos'),

  adminApprove: (id: number) => request(`/admin/photos/${id}/approve`, { method: 'POST' }),

  adminReject: (id: number) => request(`/admin/photos/${id}/reject`, { method: 'POST' }),
};
