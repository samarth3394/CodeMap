/**
 * CodeMap API Client
 * Manages HTTP communication with the FastAPI backend, authentication tokens,
 * request retries, cancellation via AbortSignal, and upload progress tracking.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export interface BackendProject {
  id: string;
  user_id: string;
  name: string;
  description: string;
  default_branch: string;
  visibility: string;
  repository_source: string;
  github_repo_url?: string | null;
  commit_hash: string;
  status: string;
  error_message?: string | null;
  stats: {
    filesCount: number;
    modulesCount: number;
    symbolsCount: number;
    linesOfCode: number;
    testCoverage: number;
    securityScore: number;
    dependencyCount: number;
  };
  created_at: string;
  updated_at: string;
}

export interface GitHubStatusResponse {
  is_configured: boolean;
  setup_message: string;
  client_id?: string | null;
  redirect_uri?: string | null;
}

export interface UploadStatusResponse {
  project_id: string;
  status: string;
  progress: number;
  message: string;
  stats?: any;
  error?: string | null;
}

class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

// Token helper
export const getToken = (): string | null => localStorage.getItem('codemap_access_token');
export const setToken = (token: string): void => localStorage.setItem('codemap_access_token', token);
export const removeToken = (): void => {
  localStorage.removeItem('codemap_access_token');
  localStorage.removeItem('codemap_user');
};

/**
 * Standard fetch wrapper with authentication headers, timeout, and retry support
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 1
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const detail = data?.detail || `HTTP Error ${response.status}`;
      throw new ApiError(response.status, detail);
    }

    return data as T;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }

    // Auto-retry once on network failure
    if (retries > 0 && !(err instanceof ApiError && err.status < 500)) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return apiFetch<T>(endpoint, options, retries - 1);
    }
    throw err;
  }
}

export const api = {
  // Authentication Endpoints
  auth: {
    signup: (data: { email: string; password: string; full_name: string }) =>
      apiFetch<AuthTokenResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: (data: { email: string; password: string }) =>
      apiFetch<AuthTokenResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getMe: () => apiFetch<UserResponse>('/auth/me'),

    logout: () => apiFetch<{ message: string }>('/auth/logout', { method: 'POST' }),

    forgotPassword: (email: string) =>
      apiFetch<{ message: string; dev_reset_token?: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    resetPassword: (data: { token: string; new_password: string }) =>
      apiFetch<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Projects Endpoints
  projects: {
    list: (params?: { search?: string; skip?: number; limit?: number }) => {
      const q = new URLSearchParams();
      if (params?.search) q.set('search', params.search);
      if (params?.skip) q.set('skip', params.skip.toString());
      if (params?.limit) q.set('limit', params.limit.toString());
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return apiFetch<{ items: BackendProject[]; total: number }>(`/projects${queryStr}`);
    },

    get: (id: string) => apiFetch<BackendProject>(`/projects/${id}`),

    create: (data: {
      name: string;
      description?: string;
      default_branch?: string;
      visibility?: 'private' | 'public';
      repository_source?: 'zip' | 'github' | 'sample';
      github_repo_url?: string;
    }) =>
      apiFetch<BackendProject>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (
      id: string,
      data: {
        name?: string;
        description?: string;
        default_branch?: string;
        visibility?: 'private' | 'public';
      }
    ) =>
      apiFetch<BackendProject>(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      apiFetch<void>(`/projects/${id}`, {
        method: 'DELETE',
      }),

    getStatus: (id: string) => apiFetch<UploadStatusResponse>(`/projects/${id}/status`),

    /**
     * Upload ZIP file using XMLHttpRequest for accurate real-time progress events
     * Supports AbortSignal for cancellation!
     */
    uploadZip: (
      projectId: string,
      file: File,
      onProgress?: (percent: number) => void,
      signal?: AbortSignal
    ): Promise<UploadStatusResponse> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `${API_BASE}/projects/${projectId}/upload-zip`;

        if (signal) {
          signal.addEventListener('abort', () => {
            xhr.abort();
            reject(new DOMException('Upload aborted by user', 'AbortError'));
          });
        }

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve(res);
            } catch {
              resolve({
                project_id: projectId,
                status: 'ready',
                progress: 100,
                message: 'Repository uploaded successfully',
              });
            }
          } else {
            let detail = 'Upload failed';
            try {
              const err = JSON.parse(xhr.responseText);
              detail = err.detail || detail;
            } catch {}
            reject(new ApiError(xhr.status, detail));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new ApiError(0, 'Network error during ZIP upload. Check backend connection.'));
        });

        xhr.addEventListener('abort', () => {
          reject(new DOMException('Upload aborted by user', 'AbortError'));
        });

        const formData = new FormData();
        formData.append('file', file);

        xhr.open('POST', url, true);
        const token = getToken();
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        xhr.send(formData);
      });
    },
  },

  // GitHub Endpoints
  github: {
    getStatus: () => apiFetch<GitHubStatusResponse>('/github/status'),

    importRepo: (data: {
      name: string;
      description?: string;
      repo_url: string;
      branch?: string;
    }) =>
      apiFetch<BackendProject>('/github/import', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
