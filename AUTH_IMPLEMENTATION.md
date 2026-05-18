# Authentication & Authorization System - Implementation Guide

## Overview

This implementation provides a complete, production-ready authentication system with:

- Session-based JWT authentication
- Token revocation & logout
- Refresh token mechanism
- Role-based access control (RBAC)
- Security tracking (IP, User-Agent)

---

## Architecture

### 1. **Session Schema**

Stores all active user sessions in MongoDB:

```
Session
├── userId (indexed) - Reference to user
├── token - Access token
├── refreshToken - Refresh token
├── userAgent - Browser/device info
├── ipAddress - Client IP
├── isActive - Session status
├── expiresAt - Token expiration
├── revokedAt - Logout timestamp
└── revokeReason - Why session ended
```

### 2. **Authentication Flow**

#### **Sign Up**

```
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: User created
```

#### **Login** ⭐

```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "accessToken": "eyJhbGc...", (3d validity)
  "refreshToken": "eyJhbGc...", (7d validity)
  "sessionId": "60d5ec49c1234567890abcde",
  "user": {
    "id": "60d5ec49c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

Session stored in DB with:

- User IP address tracked
- User agent saved
- Token marked as active

---

#### **Protected Route Access**

```
GET /api/auth/profile
Headers: Authorization: Bearer <accessToken>

Process:
1. Extract token from Authorization header
2. Validate JWT signature & expiration
3. Check if session exists in DB
4. Verify session is still active
5. Return user data

Response:
{
  "id": "60d5ec49c1234567890abcde",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

---

#### **Refresh Token** 🔄

```
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "accessToken": "newAccessToken...",
  "refreshToken": "newRefreshToken...",
  "user": { ... }
}

Process:
1. Validate refresh token signature
2. Find existing session with refresh token
3. Generate new access & refresh tokens
4. Update session in DB
5. Return new tokens
```

Use this when access token expires but refresh token is still valid.

---

#### **Logout**

```
POST /api/auth/logout
Headers: Authorization: Bearer <accessToken>

Process:
1. Extract token
2. Find session
3. Mark isActive = false
4. Record revokedAt timestamp
5. Token becomes invalid immediately

Response: { "message": "Logged out successfully" }
```

---

#### **Logout All Sessions**

```
POST /api/auth/logout-all
Headers: Authorization: Bearer <accessToken>

Process:
1. Get user ID from token
2. Find ALL active sessions for user
3. Revoke all of them
4. User logged out everywhere

Response: { "message": "All sessions logged out" }
```

Useful for: Password change, security issues, suspicious activity

---

### 3. **Role-Based Access Control (RBAC)**

#### **Admin-Only Route**

```
GET /api/auth/admin
Headers: Authorization: Bearer <accessToken>

Process:
1. JwtAuthGuard validates token & session
2. RolesGuard checks if user.role = 'admin'
3. If not admin → 403 Forbidden

Response: "AdminOnly"
```

#### **How to protect routes:**

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // or @Roles('admin', 'moderator')
@Get('admin-panel')
adminPanel() {
  return 'Only admins can access';
}
```

---

## Environment Variables

```env
# JWT Configuration
JWT_SECRET=your_secret_key_here          # Access token secret
JWT_EXPIRES=3d                           # Access token lifetime
JWT_REFRESH_SECRET=refresh_secret        # Refresh token secret
JWT_REFRESH_EXPIRES=7d                   # Refresh token lifetime

# Database
MONGODB_URI=mongodb://localhost:27017/devices
PORT=6000
```

**Important:** Change `JWT_SECRET` and `JWT_REFRESH_SECRET` in production!

---

## Security Features

### ✅ Implemented

- **Password Hashing**: bcrypt with 10 salt rounds
- **Token Revocation**: Logout marks session inactive
- **Session Expiration**: Tokens checked against expiration date
- **IP Tracking**: Record client IP for audit trail
- **Device Tracking**: Store user-agent for device identification
- **Refresh Token Rotation**: New tokens generated on refresh
- **Role-Based Access**: Decorator-based authorization

### 🔒 Database Indexes

```typescript
SessionSchema.index({ userId: 1, isActive: 1 });
SessionSchema.index({ token: 1, isActive: 1 });
```

Fast queries for active sessions.

---

## Frontend Integration Guide

### **Login Flow**

```javascript
// 1. Login & store tokens
const response = await fetch("http://localhost:6000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@example.com",
    password: "password123",
  }),
});

const data = await response.json();

// Store tokens
localStorage.setItem("accessToken", data.accessToken);
localStorage.setItem("refreshToken", data.refreshToken);
localStorage.setItem("sessionId", data.sessionId);
```

### **Make Authenticated Requests**

```javascript
const accessToken = localStorage.getItem("accessToken");

const response = await fetch("http://localhost:6000/api/auth/profile", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const user = await response.json();
```

### **Handle Token Expiration**

```javascript
async function makeRequest(url, options = {}) {
  let accessToken = localStorage.getItem("accessToken");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // If token expired, refresh it
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    const refreshResponse = await fetch(
      "http://localhost:6000/api/auth/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (refreshResponse.ok) {
      const newData = await refreshResponse.json();

      // Store new tokens
      localStorage.setItem("accessToken", newData.accessToken);
      localStorage.setItem("refreshToken", newData.refreshToken);

      // Retry original request
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newData.accessToken}`,
        },
      });
    } else {
      // Refresh failed - redirect to login
      window.location.href = "/login";
    }
  }

  return response;
}
```

### **Logout**

```javascript
async function logout() {
  const accessToken = localStorage.getItem("accessToken");

  await fetch("http://localhost:6000/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Clear tokens
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("sessionId");

  // Redirect to login
  window.location.href = "/login";
}
```

---

## API Endpoints Summary

| Method | Endpoint               | Auth | Description            |
| ------ | ---------------------- | ---- | ---------------------- |
| POST   | `/api/auth/signup`     | ❌   | Register new user      |
| POST   | `/api/auth/login`      | ❌   | Login & create session |
| POST   | `/api/auth/refresh`    | ❌   | Get new access token   |
| POST   | `/api/auth/logout`     | ✅   | Revoke current session |
| POST   | `/api/auth/logout-all` | ✅   | Revoke all sessions    |
| GET    | `/api/auth/profile`    | ✅   | Get user profile       |
| GET    | `/api/auth/admin`      | ✅   | Admin-only route       |

---

## Database Schema

### Session Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  token: String (indexed),
  refreshToken: String,
  userAgent: String,
  ipAddress: String,
  isActive: Boolean (default: true),
  expiresAt: Date,
  createdAt: Date,
  revokedAt: Date (null if active),
  revokeReason: String
}
```

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: 'user')
}
```

---

## Common Issues & Solutions

### **Issue: "Session expired or revoked"**

**Solution:** Refresh the token using refresh endpoint, or login again

### **Issue: "Invalid credentials"**

**Solution:** Check email/password are correct, ensure user exists

### **Issue: "Token not found"**

**Solution:** Include `Authorization: Bearer <token>` header

### **Issue: CORS errors**

**Solution:** Ensure CORS is enabled in bootstrap.ts or via middleware

---

## Testing the System

### **1. Sign Up**

```bash
curl -X POST http://localhost:6000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### **2. Login**

```bash
curl -X POST http://localhost:6000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Copy the `accessToken` from response.

### **3. Access Protected Route**

```bash
curl -X GET http://localhost:6000/api/auth/profile \
  -H "Authorization: Bearer <accessToken>"
```

### **4. Refresh Token**

```bash
curl -X POST http://localhost:6000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "<refreshToken>"}'
```

### **5. Logout**

```bash
curl -X POST http://localhost:6000/api/auth/logout \
  -H "Authorization: Bearer <accessToken>"
```

---

## Security Recommendations

1. **Production Environment:**
   - Use strong JWT_SECRET (min 32 characters)
   - Enable HTTPS only
   - Set secure CORS origins

2. **Token Lifecycle:**
   - Access tokens: 15-60 minutes (short-lived)
   - Refresh tokens: 7-30 days (long-lived)

3. **Session Management:**
   - Periodically cleanup expired sessions
   - Implement suspicious activity detection
   - Track failed login attempts

4. **Best Practices:**
   - Never expose tokens in URLs
   - Store tokens in httpOnly cookies (frontend)
   - Implement rate limiting on login endpoint
   - Require strong passwords

---

## Future Enhancements

- Two-factor authentication (2FA)
- OAuth2 integration (Google, GitHub)
- Session limit per user
- Automatic session cleanup
- Suspicious activity alerts
- Device fingerprinting
- Rate limiting on auth endpoints
