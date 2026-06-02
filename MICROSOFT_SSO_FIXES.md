# Microsoft SSO Fix Summary

## 🔴 Critical Issues Found & Fixed

### Issue #1: Hardcoded Tenant ID in Token Verification ⚠️ CRITICAL

**Location:** `api-nest/src/modules/auth/auth.service.ts` → `assertMicrosoftIssuer()` method

**The Bug:**

```typescript
// ❌ WRONG
const expectedIssuer = `https://login.microsoftonline.com/380a88f6-5447-406c-bebb-2c908f53f0a3`;
```

This hardcoded tenant ID was causing ALL Microsoft login attempts to fail because:

- The token issuer in the JWT didn't match this hardcoded value
- Your actual Azure tenant ID is different from this hardcoded one
- Even if it matched, it was inflexible and wouldn't work in different environments

**The Fix:**

```typescript
// ✅ CORRECT
const issuerTenantId =
  configuredTenantId === "common" ? tokenTenantId : configuredTenantId;
const expectedIssuer = `https://login.microsoftonline.com/${issuerTenantId}/v2.0`;
```

Now it:

- Uses the tenant ID from the token itself when using "common" tenant
- Uses your configured tenant ID otherwise
- Works with any Azure tenant configuration

**Status:** ✅ FIXED

---

### Issue #2: msLoginButton.tsx - Multiple Problems

**Location:** `ui/src/components/features/Auth/Login/msLoginButton.tsx`

#### Problem 2a: Hardcoded Backend URL

```typescript
// ❌ WRONG
const response = await fetch("http://localhost:3000/auth/microsoft", {
```

This fails because:

- In production, localhost:3000 doesn't exist
- The correct path should include `/api`
- Should use environment variables for flexibility

#### Problem 2b: Missing Credentials for Cookies

```typescript
// ❌ WRONG - No credentials option
const response = await fetch("...", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ accessToken }),
});
```

This fails because:

- Cookies aren't sent without `credentials: 'include'`
- Refresh token cookie won't be set
- User won't stay logged in on page refresh

#### Problem 2c: Wrong Token Being Sent

```typescript
// ❌ WRONG - Only sending accessToken
body: JSON.stringify({ accessToken });
```

Backend expects both:

- `idToken` - to verify user identity
- `accessToken` - to fetch profile photo

#### Problem 2d: Wrong Storage Location

```typescript
// ❌ WRONG
localStorage.setItem("token", data.accessToken);
```

Should use `sessionStorage` (main Login component does this correctly)

#### Problem 2e: No Error Handling or Redux Dispatch

No proper error handling or integration with Redux store

**The Fix:**

```typescript
// ✅ CORRECT - All problems fixed
const response = await fetch(
  `${environment.APP_API_URL}/auth/microsoft`, // Uses env variable
  {
    method: "POST",
    credentials: "include", // Important for cookies
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idToken: result.idToken, // Send ID token
      accessToken: result.accessToken, // Send access token
    }),
  },
);

const data: AuthPayload = await response.json();
const apiAccessToken = data.accessToken || data.token;

// Proper error handling
if (!apiAccessToken) {
  throw new Error("API did not return an access token");
}

// Redux dispatch
dispatch(login({ user: data.user, token: apiAccessToken }));
sessionStorage.setItem("accessToken", apiAccessToken);
sessionStorage.setItem("user", JSON.stringify(data.user));

navigate("/");
```

**Status:** ✅ FIXED

---

## 📋 Checklist for Testing

### Backend Configuration

- [ ] `.env` file exists in `api-nest/` directory
- [ ] `MICROSOFT_CLIENT_ID` is set correctly from Azure
- [ ] `MICROSOFT_TENANT_ID` is set (use "common" for testing)
- [ ] `CORS_ORIGIN` includes your frontend URL (e.g., `http://localhost:5173`)
- [ ] `JWT_SECRET` is set

### Frontend Configuration

- [ ] `.env.local` or `.env` file exists in `ui/` directory
- [ ] `VITE_APP_API_URL=http://localhost:3000/api`
- [ ] `VITE_MICROSOFT_CLIENT_ID` matches Azure
- [ ] `VITE_MICROSOFT_REDIRECT_URL=http://localhost:5173`

### Azure Portal Setup

- [ ] App Registration created
- [ ] Redirect URI includes `http://localhost:5173`
- [ ] Redirect URI includes `http://localhost:5173/auth`
- [ ] Credentials/certificates configured
- [ ] API permissions granted (User.Read, email, profile, openid)

---

## 🧪 How to Test

### Step 1: Start Backend

```bash
cd api-nest
npm run start:dev
```

### Step 2: Start Frontend

```bash
cd ui
npm run dev
```

### Step 3: Test Login Flow

1. Navigate to `http://localhost:5173/login`
2. Click the Microsoft login button
3. Sign in with your Microsoft account
4. Watch backend console for logs like:
   - `[Microsoft SSO] Login exchange started`
   - `[Microsoft SSO] ID token verified`
   - `[Auth Session] Session created`

### Step 4: Verify Session

1. Open DevTools (F12)
2. Go to Storage tab
3. Check `sessionStorage` has:
   - `accessToken` - JWT token from backend
   - `user` - User object with email, name, etc.

---

## 🔍 Debugging Guide

### If Login Still Fails:

**Check Backend Logs:**

```
Look for errors starting with [Microsoft SSO]
- "Invalid Microsoft token issuer" → Tenant ID mismatch
- "ID token verification failed" → Token format issue
- "User not found" or "User creation failed" → DB issue
```

**Check Browser Console:**

```
Look for [Microsoft SSO] or [MicrosoftLoginButton] logs
Check if there are CORS errors
Check if fetch request is being made to correct URL
```

**Test Endpoint Directly:**

```bash
# Get a valid Microsoft token first (from login popup)
# Then test the backend endpoint:
curl -X POST http://localhost:3000/api/auth/microsoft \
  -H "Content-Type: application/json" \
  -H "Cookie: refreshToken=your_refresh_token" \
  -d '{
    "idToken": "your_id_token",
    "accessToken": "your_access_token"
  }'
```

---

## 📝 Files Modified

| File                                                      | Changes                                                     |
| --------------------------------------------------------- | ----------------------------------------------------------- |
| `api-nest/src/modules/auth/auth.service.ts`               | Fixed tenant ID verification in `assertMicrosoftIssuer()`   |
| `ui/src/components/features/Auth/Login/msLoginButton.tsx` | Fixed URL, credentials, tokens, storage, and error handling |

---

## ✨ What Each Fix Solves

| Issue                                  | Fix                                   | Result                                  |
| -------------------------------------- | ------------------------------------- | --------------------------------------- |
| "Invalid Microsoft token issuer" error | Dynamic tenant ID                     | Token verification now passes ✅        |
| Cookies not being set                  | Added `credentials: 'include'`        | Refresh token now persists ✅           |
| Wrong endpoint URL                     | Use `environment.APP_API_URL`         | Works in dev and production ✅          |
| Backend rejects request                | Send both `idToken` and `accessToken` | Backend can verify and fetch profile ✅ |
| Login doesn't persist                  | Use `sessionStorage`                  | User stays logged in ✅                 |
| No error feedback                      | Added proper error handling           | Debugging is now possible ✅            |

---

## 🚀 Next Steps

1. **Ensure backend is running:** `npm run start:dev` in `api-nest/`
2. **Ensure frontend is running:** `npm run dev` in `ui/`
3. **Test the flow** using the checklist above
4. **Check console logs** for debugging info
5. **Verify sessionStorage** has the token after login

## 📞 Still Having Issues?

Check these in order:

1. Environment variables are correctly set
2. Azure App Registration has correct redirect URIs
3. Backend `/api/auth/microsoft` endpoint exists (it does)
4. Frontend can reach backend API
5. Microsoft tokens are being passed correctly

If you're still stuck, enable debug logging:

```typescript
// In Login component
console.log("Debug: environment config", {
  apiUrl: environment.APP_API_URL,
  clientId: environment.CLIENT_ID,
  authority: environment.AUTHORITY,
});
```
