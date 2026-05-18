# Quick Reference: New Auth Endpoints

## 1️⃣ Sign Up

```
POST /api/auth/signup
Body: { name, email, password }
Response: User created
```

## 2️⃣ Login (Creates Session)

```
POST /api/auth/login
Body: { email, password }
Response: { accessToken, refreshToken, sessionId, user }

✅ Session stored in MongoDB with:
   - User IP tracked
   - Device info saved
   - Active status
   - Expiration time
```

## 3️⃣ Get Profile (Protected)

```
GET /api/auth/profile
Headers: Authorization: Bearer <accessToken>
✅ Validates session is still active in DB
Response: { id, name, email, role }
```

## 4️⃣ Refresh Token

```
POST /api/auth/refresh
Body: { refreshToken }
✅ Generates new access & refresh tokens
✅ Updates session in DB
Response: { accessToken, refreshToken, user }
```

## 5️⃣ Logout (Revokes Session)

```
POST /api/auth/logout
Headers: Authorization: Bearer <accessToken>
✅ Marks session as inactive in DB
✅ Token becomes invalid immediately
Response: { message: "Logged out successfully" }
```

## 6️⃣ Logout All Sessions

```
POST /api/auth/logout-all
Headers: Authorization: Bearer <accessToken>
✅ Revokes ALL active sessions for user
✅ User logged out everywhere
Response: { message: "All sessions logged out" }
```

## 7️⃣ Admin Route (Role-Based)

```
GET /api/auth/admin
Headers: Authorization: Bearer <accessToken>
✅ Only accessible if user.role = 'admin'
Response: "AdminOnly"
```

---

## Key Improvements

| Feature                | Before     | After              |
| ---------------------- | ---------- | ------------------ |
| **Session Storage**    | ❌ No      | ✅ MongoDB         |
| **Token Revocation**   | ❌ No      | ✅ Yes (Logout)    |
| **Logout**             | ❌ No      | ✅ Yes             |
| **Refresh Token**      | ❌ No      | ✅ Yes             |
| **Session Tracking**   | ❌ No      | ✅ IP + Device     |
| **Role in JWT**        | ❌ Missing | ✅ Included        |
| **Session Validation** | ❌ No      | ✅ On each request |

---

## Flow Diagram

```
User Login
   ↓
Verify Credentials
   ↓
Generate Access Token (3d)
Generate Refresh Token (7d)
   ↓
Save Session to MongoDB ← NEW!
   ├─ token
   ├─ userId
   ├─ ipAddress
   ├─ userAgent
   ├─ isActive: true
   └─ expiresAt
   ↓
Return Tokens to Client

Protected Route Request
   ↓
Extract Token from Header
   ↓
Validate JWT Signature
   ↓
Check Session in DB ← NEW!
   ↓
Verify isActive = true ← NEW!
   ↓
Grant Access
```

---

## Environment Setup

Update your `.env`:

```
JWT_SECRET=your_secret_key
JWT_EXPIRES=3d
JWT_REFRESH_SECRET=refresh_secret_key
JWT_REFRESH_EXPIRES=7d
```

---

## Files Modified/Created

✅ **Created:**

- `src/database/mongoose/schemas/session.schema.ts`
- `src/database/mongoose/dao/session.dao.ts`
- `AUTH_IMPLEMENTATION.md`

✅ **Updated:**

- `src/modules/auth/auth.service.ts`
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/auth.module.ts`
- `src/modules/auth/strategies/jwt.strategy.ts`
- `.env`

---

## Next Steps

1. **Test all endpoints** (use curl or Postman)
2. **Update frontend** to use new endpoints
3. **Store tokens** properly (localStorage/sessionStorage)
4. **Handle token refresh** automatically
5. **Set strong JWT secrets** in production
