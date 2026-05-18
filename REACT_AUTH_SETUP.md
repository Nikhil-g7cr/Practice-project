# Frontend Setup Guide - React with Cookie-Based Auth

## Quick Start

### 1. Environment Configuration

```javascript
// src/config/api.ts
export const API_URL = 'http://localhost:6000';

export const fetchConfig = {
  credentials: 'include' as const,  // ⭐ CRITICAL: Enables cookie sending
  headers: {
    'Content-Type': 'application/json',
  },
};
```

---

## Auth Service

### 2. Create Authentication Service

```typescript
// src/services/authService.ts
import { API_URL, fetchConfig } from "../config/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

class AuthService {
  private accessToken: string | null = null;
  private user: User | null = null;

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        ...fetchConfig,
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data: AuthResponse = await response.json();

      // Store in memory
      this.accessToken = data.accessToken;
      this.user = data.user;

      // Optional: persist to sessionStorage for page reload
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async refresh(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        ...fetchConfig,
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data: AuthResponse = await response.json();

      // Update in-memory token
      this.accessToken = data.accessToken;
      this.user = data.user;

      // Update storage
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error("Refresh error:", error);
      // Clear auth on refresh failure
      this.logout();
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.accessToken) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          ...fetchConfig,
          headers: {
            ...fetchConfig.headers,
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear tokens
      this.accessToken = null;
      this.user = null;
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
    }
  }

  getAccessToken(): string | null {
    return this.accessToken || sessionStorage.getItem("accessToken");
  }

  getUser(): User | null {
    if (this.user) return this.user;

    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export default new AuthService();
```

---

## API Client with Auto-Refresh

### 3. Create Axios/Fetch Interceptor

```typescript
// src/services/apiClient.ts
import { API_URL, fetchConfig } from "../config/api";
import authService from "./authService";

export async function apiCall(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const accessToken = authService.getAccessToken();

  const headers = {
    ...fetchConfig.headers,
    ...(options.headers || {}),
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  const requestInit: RequestInit = {
    ...fetchConfig,
    ...options,
    headers,
  };

  let response = await fetch(`${API_URL}${url}`, requestInit);

  // Auto-refresh on 401
  if (response.status === 401 && accessToken) {
    try {
      await authService.refresh();

      // Retry with new token
      const newAccessToken = authService.getAccessToken();
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      response = await fetch(`${API_URL}${url}`, {
        ...requestInit,
        headers: retryHeaders,
      });
    } catch (error) {
      // Refresh failed - redirect to login
      window.location.href = "/login";
      throw error;
    }
  }

  return response;
}

// Helper for JSON responses
export async function apiCallJson<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await apiCall(url, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
```

---

## React Hooks

### 4. Create useAuth Hook

```typescript
// src/hooks/useAuth.ts
import { useCallback, useEffect, useState } from "react";
import authService from "../services/authService";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from storage on mount
  useEffect(() => {
    const storedUser = authService.getUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated(),
  };
}
```

---

## React Components

### 5. Login Component

```typescript
// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 6. Protected Route Component

```typescript
// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
```

### 7. Profile Component with API Call

```typescript
// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiCallJson } from '../services/apiClient';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const data = await apiCallJson<ProfileData>('/api/auth/profile');
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <h1>Profile</h1>
      {profile && (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

### 8. App Router Setup

```typescript
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { ProfilePage } from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## Vite Configuration

### 9. Update Vite Config for CORS

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:6000",
        changeOrigin: true,
        credentials: true,
      },
    },
  },
});
```

---

## Flow Diagram

```
User Clicks Login
      ↓
Submit Email/Password
      ↓
authService.login()
      ↓
POST /api/auth/login (credentials: include)
      ↓
Backend Sets HttpOnly Cookie (refreshToken)
Returns accessToken + user data
      ↓
Store accessToken in sessionStorage
Store user in sessionStorage
      ↓
useAuth hook updates
      ↓
Redirect to Dashboard

Make API Request
      ↓
apiCall() adds Authorization header
Includes credentials: include (sends cookies)
      ↓
GET /api/auth/profile
      ↓
Validate accessToken + check session
      ↓
Response OK
      ↓
Handle Response

Token Expires (401)
      ↓
apiCall() detects 401
      ↓
Call authService.refresh()
      ↓
POST /api/auth/refresh
Browser sends refreshToken cookie
      ↓
Backend validates + generates new tokens
Sets new HttpOnly cookie
Returns new accessToken
      ↓
Retry original request with new token
      ↓
Response OK

User Clicks Logout
      ↓
authService.logout()
      ↓
POST /api/auth/logout
      ↓
Backend clears HttpOnly cookie
Revokes session
      ↓
Clear sessionStorage
      ↓
Redirect to /login
```

---

## Checklist

- ✅ `credentials: 'include'` in fetch calls
- ✅ HttpOnly cookie managed by backend
- ✅ accessToken stored in memory/sessionStorage
- ✅ Auto-refresh on 401
- ✅ User data persisted for page reload
- ✅ Logout clears all tokens
- ✅ Protected routes check authentication
- ✅ CORS enabled with credentials
- ✅ Error handling for network failures
- ✅ Loading states during auth operations

---

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Browser will open at `http://localhost:5173`

---

## Testing

1. **Login**: Navigate to /login, enter credentials
2. **Access Protected Route**: Should redirect if not authenticated
3. **Check Cookies**: DevTools → Application → Cookies → localhost:6000
   - Should see `refreshToken` (HttpOnly)
4. **Refresh Token**: Page reload should keep you logged in
5. **Auto-Refresh**: Wait for token expiration, make API call
6. **Logout**: Should clear tokens and redirect to login

---

## Troubleshooting

| Issue                  | Solution                           |
| ---------------------- | ---------------------------------- |
| Cookies not sent       | Add `credentials: 'include'`       |
| CORS error             | Check backend CORS config          |
| Refresh fails          | Verify cookie name matches backend |
| 401 on protected route | Login first or refresh token       |
| Page reload loses auth | Check sessionStorage persistence   |
