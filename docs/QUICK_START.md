# 🚀 QUICK START - Microsoft SSO Fixes

## ✅ What Was Fixed

### 1. Backend Issue - Token Verification Failed

**File:** `api-nest/src/modules/auth/auth.service.ts`

The code had a **hardcoded tenant ID** that prevented Microsoft tokens from being verified. This was the main blocker.

**Before:**

```typescript
const expectedIssuer = `https://login.microsoftonline.com/380a88f6-5447-406c-bebb-2c908f53f0a3`;
```

**After:**

```typescript
const issuerTenantId =
  configuredTenantId === "common" ? tokenTenantId : configuredTenantId;
const expectedIssuer = `https://login.microsoftonline.com/${issuerTenantId}/v2.0`;
```

---

### 2. Frontend Issue - Wrong API Call

**File:** `ui/src/components/features/Auth/Login/msLoginButton.tsx`

Had multiple issues:

- ❌ Hardcoded URL `http://localhost:3000/auth/microsoft`
- ❌ Missing `/api` in path
- ❌ Missing `credentials: 'include'` for cookies
- ❌ Only sending `accessToken` (needed both tokens)
- ❌ Wrong storage location
- ❌ No proper error handling

**Now Fixed:**

- ✅ Uses `${environment.APP_API_URL}/auth/microsoft`
- ✅ Includes `credentials: 'include'`
- ✅ Sends both `idToken` and `accessToken`
- ✅ Uses `sessionStorage` correctly
- ✅ Proper error handling with logs

---

## 🏃 Quick Test

### Terminal 1 - Start Backend

```bash
cd api-nest
npm run start:dev
# Should show: Server is running on http://localhost:3000
```

### Terminal 2 - Start Frontend

```bash
cd ui
npm run dev
# Should show: Local: http://localhost:5173
```

### Browser

1. Go to `http://localhost:5173/login`
2. Click Microsoft button
3. Sign in with Microsoft account
4. Should redirect to home page
5. Check DevTools → Storage → sessionStorage
   - Should have `accessToken` and `user`

---

## ⚙️ Required Setup

Create **`.env`** in `api-nest/`:

```env
MICROSOFT_CLIENT_ID=from_azure_portal
MICROSOFT_TENANT_ID=common
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=any_secret_key_here
```

Create **`.env.local`** in `ui/`:

```env
VITE_APP_API_URL=http://localhost:3000/api
VITE_MICROSOFT_CLIENT_ID=from_azure_portal
VITE_MICROSOFT_AUTHORITY=https://login.microsoftonline.com/common
VITE_MICROSOFT_REDIRECT_URL=http://localhost:5173
```

---

## 📊 Before & After

| Aspect             | Before                                    | After                          |
| ------------------ | ----------------------------------------- | ------------------------------ |
| Token Verification | ❌ Hardcoded tenant                       | ✅ Dynamic tenant from config  |
| API URL            | ❌ `http://localhost:3000/auth/microsoft` | ✅ `${env}/api/auth/microsoft` |
| Cookies            | ❌ Not sent                               | ✅ Included with credentials   |
| Tokens Sent        | ❌ Only accessToken                       | ✅ Both idToken & accessToken  |
| Error Handling     | ❌ Silent failures                        | ✅ Detailed console logs       |
| Token Storage      | ❌ localStorage                           | ✅ sessionStorage              |

---

## 🐛 Debugging

If still not working:

### Check Backend Logs

Look for `[Microsoft SSO]` prefixed messages:

- `[Microsoft SSO] Login exchange started` → Good start
- `[Microsoft SSO] ID token verified` → Token is valid
- `[Microsoft SSO] Login failed` → Check error message

### Check Browser Console

Look for console logs and errors:

```javascript
// Should see these:
[MicrosoftLoginButton] Starting Microsoft login
[MicrosoftLoginButton] Exchanging token with API
[MicrosoftLoginButton] Login successful
```

### Check Network Tab

1. DevTools → Network
2. Look for POST to `/api/auth/microsoft`
3. Request body should have `idToken` and `accessToken`
4. Response should have `accessToken` and `user`

### Check Storage

DevTools → Storage → sessionStorage:

- `accessToken` → Should be a JWT token
- `user` → Should be JSON object with user data

---

## 📁 Documentation

- `docs/MICROSOFT_SSO_DEBUG_FIX.md` - Detailed debugging guide
- `docs/MICROSOFT_SSO_TROUBLESHOOTING.md` - Common issues
- `docs/AUTH_IMPLEMENTATION.md` - Complete auth flow

---

## ✨ Summary

**The problem:** Hardcoded tenant ID + wrong API endpoint configuration prevented Microsoft SSO login.

**The solution:** Dynamic tenant verification + proper API endpoint with credentials.

**Result:** Microsoft SSO should now work correctly! 🎉

---

**Next:** Run the Quick Test above and check console logs for any remaining issues.
