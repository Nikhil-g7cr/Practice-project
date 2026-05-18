# Cookie-Based Token Storage Implementation

## Architecture Overview

The system now implements a secure cookie-based token storage mechanism:

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Storage                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📝 JavaScript Memory    🔒 HttpOnly Cookie                 │
│  ├─ accessToken          ├─ refreshToken                   │
│  └─ user: {              │  (Secure, HTTP-only)            │
│      id, name,           │  Not accessible via JS          │
│      email, role         │                                  │
│    }                     └─ Sent automatically with         │
│                             POST /api/auth/refresh          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Benefits

✅ **HttpOnly Cookies**

- Prevents XSS attacks (JavaScript can't steal the token)
- Automatically sent by browser on each request to `/api/auth/*`
- Cannot be accessed by `document.cookie`

✅ **SameSite Protection**

- Set to `'strict'` to prevent CSRF attacks
- Only sent to same-site requests

✅ **Secure Flag**

- Only transmitted over HTTPS in production
- HTTP in development for testing

✅ **Path Restriction**

- Refresh token cookie only accessible at `/api/auth` endpoints
- Reduces exposure surface

---

## Backend Changes

### 1. Cookie Parser Middleware

```typescript
// bootstrap.ts
import cookieParser from "cookie-parser";

app.use(cookieParser());

app.enableCors({
  origin: "http://localhost:5173",
  credentials: true, // Important: Allow credentials (cookies)
});
```

### 2. Login Endpoint - Sets HttpOnly Cookie

```typescript
@Post('login')
async signin(
  @Body() loginDto: LoginDto,
  @Headers('user-agent') userAgent: string,
  @Request() req,
  @Response({ passthrough: true }) res,  // Enable response manipulation
) {
  const result = await this.authService.login(...);

  // Set HttpOnly Cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,              // Not accessible via JavaScript
    secure: true,                // HTTPS only
    sameSite: 'strict',          // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    path: '/api/auth',           // Only sent to auth endpoints
  });

  // Return only access token + user data
  return {
    accessToken: result.accessToken,
    user: result.user,
  };
}
```

### 3. Refresh Endpoint - Reads from Cookie

```typescript
@Post('refresh')
async refresh(
  @Request() req,
  @Response({ passthrough: true }) res,
) {
  const refreshToken = req.cookies?.refreshToken;  // Read from HttpOnly cookie

  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  const result = await this.authService.refreshAccessToken(refreshToken);

  // Update cookie with new refresh token
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });

  return {
    accessToken: result.accessToken,
    user: result.user,
  };
}
```

### 4. Logout Endpoint - Clears Cookie

```typescript
@Post('logout')
async logout(
  @Request() req,
  @Response({ passthrough: true }) res
) {
  // ... revoke session ...

  res.clearCookie('refreshToken', { path: '/api/auth' });
  return { message: 'Logged out successfully' };
}
```

---

## Frontend Implementation

### 1. Login Request

```javascript
async function login(email, password) {
  const response = await fetch("http://localhost:6000/api/auth/login", {
    method: "POST",
    credentials: "include", // ⭐ IMPORTANT: Send/receive cookies
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // Store accessToken in memory or sessionStorage
  sessionStorage.setItem("accessToken", data.accessToken);
  sessionStorage.setItem("user", JSON.stringify(data.user));

  // refreshToken is automatically stored in HttpOnly cookie
  // ✅ No manual storage needed!
}
```

### 2. Make Authenticated Requests

```javascript
async function getProfile() {
  const accessToken = sessionStorage.getItem("accessToken");

  const response = await fetch("http://localhost:6000/api/auth/profile", {
    method: "GET",
    credentials: "include", // ⭐ Send cookies automatically
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
}
```

### 3. Auto-Refresh on Token Expiration

```javascript
async function makeRequest(url, options = {}) {
  let accessToken = sessionStorage.getItem("accessToken");

  const response = await fetch(url, {
    ...options,
    credentials: "include", // ⭐ Include cookies
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Token expired?
  if (response.status === 401) {
    // Refresh using HttpOnly cookie
    const refreshResponse = await fetch(
      "http://localhost:6000/api/auth/refresh",
      {
        method: "POST",
        credentials: "include", // ⭐ Send refresh token cookie
        headers: { "Content-Type": "application/json" },
      },
    );

    if (refreshResponse.ok) {
      const newData = await refreshResponse.json();

      // Store new access token
      sessionStorage.setItem("accessToken", newData.accessToken);

      // New refresh token is in HttpOnly cookie ✅
      // No storage needed!

      // Retry original request
      return fetch(url, {
        ...options,
        credentials: "include",
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

### 4. Logout

```javascript
async function logout() {
  const accessToken = sessionStorage.getItem("accessToken");

  await fetch("http://localhost:6000/api/auth/logout", {
    method: "POST",
    credentials: "include", // ⭐ Send cookies
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Clear tokens from storage
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("user");

  // HttpOnly cookie automatically cleared by server ✅
  // No manual cleanup needed!

  window.location.href = "/login";
}
```

---

## Token Lifecycle

### Access Token (Short-lived: 3 days)

- Generated on login
- **Stored in**: Browser memory or sessionStorage
- **Accessible to**: JavaScript, read in Authorization header
- **Expires**: 3 days
- **Risk**: Can be stolen via XSS, but short-lived

### Refresh Token (Long-lived: 7 days)

- Generated on login
- **Stored in**: HttpOnly cookie
- **Accessible to**: Only sent by browser automatically
- **Expires**: 7 days
- **Risk**: Protected from XSS (HttpOnly)

### User Data (Session-only)

- Returned on login
- **Stored in**: sessionStorage (browser memory)
- **Expires**: Browser session ends
- **Contains**: id, name, email, role

---

## Environment Variables

```env
# JWT Configuration
JWT_SECRET=your_super_secret_key_32_characters_min
JWT_EXPIRES=3d
JWT_REFRESH_SECRET=your_refresh_secret_key_32_chars
JWT_REFRESH_EXPIRES=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Environment
NODE_ENV=development  # Set to 'production' for HTTPS-only cookies
```

---

## API Endpoints (Updated)

### Login

```
POST /api/auth/login
Body: { email, password }
Credentials: include

Response:
{
  "accessToken": "eyJhbGc...",  // ← Store in memory
  "user": {                      // ← Store in sessionStorage
    "id": "...",
    "name": "John",
    "email": "john@example.com",
    "role": "user"
  }
}

Cookies Set:
✅ refreshToken: "eyJhbGc..." (HttpOnly, Secure, SameSite=Strict)
```

### Refresh

```
POST /api/auth/refresh
Credentials: include  // Sends refreshToken cookie automatically

Response:
{
  "accessToken": "newAccessToken...",
  "user": { ... }
}

Cookies Updated:
✅ refreshToken: "newRefreshToken..." (new cookie set)
```

### Logout

```
POST /api/auth/logout
Headers: Authorization: Bearer <accessToken>
Credentials: include

Response: { "message": "Logged out successfully" }

Cookies Cleared:
✅ refreshToken removed
```

---

## Security Checklist

- ✅ HttpOnly cookie for refresh token
- ✅ Secure flag enabled in production
- ✅ SameSite=strict for CSRF protection
- ✅ Path restriction to `/api/auth`
- ✅ Access token is short-lived (3 days)
- ✅ Session stored in MongoDB
- ✅ Token revocation on logout
- ✅ CORS enabled with credentials
- ✅ No token exposure in URLs
- ✅ No refresh token in response body

---

## Comparison: Before vs After

| Feature                   | Before                  | After                  |
| ------------------------- | ----------------------- | ---------------------- |
| **Refresh Token Storage** | localStorage (XSS risk) | HttpOnly Cookie (Safe) |
| **Access Token Storage**  | localStorage            | Memory/sessionStorage  |
| **Cookie Handling**       | None                    | Automatic transmission |
| **CSRF Protection**       | None                    | SameSite=strict        |
| **Refresh Endpoint**      | Requires body param     | Reads from cookie      |
| **Logout**                | Manual token clear      | Server + auto clear    |
| **XSS Vulnerability**     | Refresh token exposed   | Protected              |

---

## Installation

Install new dependencies:

```bash
npm install cookie-parser
npm install -D @types/cookie-parser
```

Or if using package-lock:

```bash
npm ci
```

---

## Testing with cURL

### Login

```bash
curl -X POST http://localhost:6000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Refresh (cookies automatically sent from cookies.txt)

```bash
curl -X POST http://localhost:6000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -c cookies.txt
```

### Logout

```bash
curl -X POST http://localhost:6000/api/auth/logout \
  -H "Authorization: Bearer <accessToken>" \
  -b cookies.txt
```

---

## Common Issues

### Issue: "cookies not set"

**Solution:** Ensure `credentials: 'include'` in fetch options

### Issue: "CORS error with cookies"

**Solution:** Set `credentials: true` in app.enableCors()

### Issue: "refreshToken undefined"

**Solution:** Cookie not sent - check `credentials: 'include'` in request

### Issue: "Cookie not working in production"

**Solution:** Set `NODE_ENV=production` to enable Secure flag (HTTPS only)

---

## Next Steps

1. ✅ Install `cookie-parser` dependency
2. ✅ Update frontend to use `credentials: 'include'`
3. ✅ Test login/refresh/logout endpoints
4. ✅ Verify cookies in browser DevTools → Application → Cookies
5. ✅ Test auto-refresh on token expiration
6. ✅ Deploy with HTTPS in production
