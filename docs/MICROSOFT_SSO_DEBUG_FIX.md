# Microsoft SSO - Debug & Fix Guide

## Issues Found & Fixed ✅

### 1. **CRITICAL: Hardcoded Tenant ID in Token Verification**

**File:** `api-nest/src/modules/auth/auth.service.ts` (Line ~420)

**Problem:**

```typescript
// ❌ WRONG - Hardcoded tenant ID
const expectedIssuer = `https://login.microsoftonline.com/380a88f6-5447-406c-bebb-2c908f53f0a3`;
```

This was causing token verification to fail because it was checking against a specific tenant ID instead of the one in the token.

**Fix Applied:**

```typescript
// ✅ CORRECT - Dynamic tenant ID based on configuration
const issuerTenantId =
  configuredTenantId === "common" ? tokenTenantId : configuredTenantId;
const expectedIssuer = `https://login.microsoftonline.com/${issuerTenantId}/v2.0`;
```

---

### 2. **msLoginButton.tsx - Hardcoded URL & Missing Credentials**

**File:** `ui/src/components/features/Auth/Login/msLoginButton.tsx`

**Problems:**

- ❌ Hardcoded URL: `http://localhost:3000/auth/microsoft` (should use environment variables)
- ❌ Missing `credentials: 'include'` for cookie handling
- ❌ Only sending `accessToken` (should send both `idToken` and `accessToken`)
- ❌ Storing token in `localStorage` instead of `sessionStorage`
- ❌ No proper error handling or Redux dispatch

**Fix Applied:**

- ✅ Now uses `environment.APP_API_URL`
- ✅ Includes `credentials: 'include'` for cookies
- ✅ Sends both `idToken` and `accessToken`
- ✅ Uses `sessionStorage` for token
- ✅ Dispatches to Redux
- ✅ Proper error handling with console logs

---

## Environment Variables Required

Make sure your backend `.env` file has these variables:

```env
# Backend (.env in api-nest/)
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Microsoft Azure Configuration
MICROSOFT_CLIENT_ID=your_client_id_from_azure
MICROSOFT_TENANT_ID=common
MICROSOFT_AUTHORITY=https://login.microsoftonline.com/your_tenant_id

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES=3d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=7d

# Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/your_database_name
```

And your frontend `.env` file (or `.env.local`):

```env
# Frontend (.env in ui/)
VITE_APP_API_URL=http://localhost:3000/api
VITE_MICROSOFT_CLIENT_ID=your_client_id_from_azure
VITE_MICROSOFT_AUTHORITY=https://login.microsoftonline.com/your_tenant_id
VITE_MICROSOFT_REDIRECT_URL=http://localhost:5173
```

---

## Step-by-Step Debugging

### Step 1: Verify Backend Configuration

```bash
# Go to backend directory
cd api-nest

# Check if .env file exists with correct variables
cat .env | grep MICROSOFT

# Output should show:
# MICROSOFT_CLIENT_ID=xxx
# MICROSOFT_TENANT_ID=common (or your specific tenant ID)
```

### Step 2: Test Backend Endpoint

```bash
# Start the backend (if not already running)
npm run start:dev

# In another terminal, test the endpoint with a real Microsoft token:
curl -X POST http://localhost:3000/api/auth/microsoft \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "your_microsoft_id_token",
    "accessToken": "your_microsoft_access_token"
  }'

# Expected response:
# {
#   "accessToken": "jwt_token_from_backend",
#   "user": { "id": "...", "email": "...", "name": "...", "role": "user" }
# }
```

### Step 3: Check Frontend Configuration

```bash
# Go to frontend directory
cd ui

# Check environment variables are loaded
cat src/environment/environment.ts

# Should show:
# APP_API_URL: "http://localhost:3000/api"
# CLIENT_ID: "your_client_id"
# AUTHORITY: "https://login.microsoftonline.com/your_tenant_id"
```

### Step 4: Browser DevTools Debugging

1. **Network Tab:**
   - Open DevTools → Network tab
   - Click Microsoft login button
   - Look for request to `/api/auth/microsoft`
   - Check request body has both `idToken` and `accessToken`
   - Check response has `accessToken` and `user`

2. **Console Tab:**
   - Look for logs like `[Microsoft SSO] Login exchange started`
   - Look for `[Microsoft SSO] ID token verified`
   - Look for any error messages

3. **Storage Tab:**
   - After successful login, check `sessionStorage`:
     - Should have `accessToken` key
     - Should have `user` key

---

## Common Issues & Solutions

### Issue 1: "Invalid Microsoft token issuer"

**Symptoms:** Error in backend logs about token issuer mismatch

**Causes:**

- MICROSOFT_TENANT_ID env variable is wrong
- Microsoft token is from a different tenant than configured

**Solution:**

```javascript
// Get your correct tenant ID from Azure Portal:
// 1. Go to Azure AD → Properties
// 2. Copy the "Tenant ID"
// 3. Set it in your .env: MICROSOFT_TENANT_ID=your_tenant_id
// Or use "common" for any tenant (less secure)
```

### Issue 2: "Cookies not being set"

**Symptoms:** Login works but refresh token cookie is not set

**Check CORS configuration in `api-nest/src/main.ts`:**

```typescript
const corsConfig = {
  origin: process.env.CORS_ORIGIN || `http://localhost:3000`,
  credentials: true, // ✅ MUST BE TRUE
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

**Check cookie settings in `auth.controller.ts`:**

```typescript
res.cookie("refreshToken", result.refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // false for localhost
  sameSite: "lax", // ✅ Important for CORS
  path: "/", // ✅ Must be root path
});
```

### Issue 3: "Microsoft popup redirects but login fails"

**Debug steps:**

1. Check browser console for error messages
2. Check backend logs (look for `[Microsoft SSO]` prefixed logs)
3. Verify Azure App Registration has correct Redirect URI:
   - Go to Azure Portal → App registrations → Your app
   - Check "Authentication" → "Redirect URIs"
   - Must include `http://localhost:5173` for local development

### Issue 4: "User creation fails"

**Check if email already exists:**

```bash
# Check MongoDB for existing user
mongosh
use your_database
db.users.findOne({ email: "user@example.com" })
```

**If user exists, you'll see the Microsoft identity linking flow should work**

---

## Testing Flow

### Manual Test:

1. **Start Backend:**

   ```bash
   cd api-nest
   npm run start:dev
   ```

2. **Start Frontend:**

   ```bash
   cd ui
   npm run dev
   ```

3. **Test Login:**
   - Open http://localhost:5173/login
   - Click Microsoft button
   - Sign in with Microsoft account
   - Should be redirected to home page
   - Check sessionStorage has `accessToken` and `user`

4. **Check Logs:**
   - Backend console should show: `[Microsoft SSO] Login exchange started`
   - Backend console should show: `[Microsoft SSO] ID token verified`
   - Backend console should show: `[Auth Session] Session created`

---

## Key Files Modified

### ✅ `api-nest/src/modules/auth/auth.service.ts`

- Fixed `assertMicrosoftIssuer()` method
- Now uses dynamic tenant ID instead of hardcoded value

### ✅ `ui/src/components/features/Auth/Login/msLoginButton.tsx`

- Updated to use environment variables
- Added proper credentials handling
- Fixed token sending and storage
- Added error handling and Redux dispatch

---

## Additional Resources

- [Microsoft SSO Implementation Guide](./AUTH_IMPLEMENTATION.md)
- [Microsoft SSO Troubleshooting](./MICROSOFT_SSO_TROUBLESHOOTING.md)
- [Cookie-based Auth Setup](./SETUP_COOKIE_AUTH.md)

---

## Need More Help?

If you're still seeing issues:

1. **Enable debug mode:**

   ```javascript
   // In Login component, add:
   localStorage.setItem("debug", "microsoft-sso:*");
   ```

2. **Check environment variables are loaded:**

   ```bash
   # In browser console:
   console.log(window.__VITE_DEFINE_CONFIG__)
   ```

3. **Monitor network requests:**
   - DevTools → Network tab
   - Filter by `microsoft`
   - Check request/response details

4. **Check MongoDB for created users:**
   ```bash
   mongosh
   db.users.find({}).pretty()
   ```
