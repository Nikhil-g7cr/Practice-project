# Microsoft SSO - Quick Troubleshooting Guide

## **All Issues Fixed** ✅

### Summary of Changes:

1. ✅ Created `POST /api/auth/microsoft` endpoint
2. ✅ Added `microsoftLogin()` service method
3. ✅ Created `MicrosoftAuthDto` for validation
4. ✅ Fixed REDIRECT_URL from `localhost:5000` → `localhost:5173`
5. ✅ Made password optional in User schema (for SSO users)
6. ✅ Made password optional in `CreateUserDto`

---

## **If Microsoft Login Still Doesn't Work**

### Issue 1: "Token not found in cookies after Microsoft login"

**Check:** Does the cookie path match your routes?

```typescript
// In auth.controller.ts - this should be correct now
res.cookie("refreshToken", result.refreshToken, {
  path: "/", // ✅ Correct
  httpOnly: true,
  sameSite: "lax",
});
```

### Issue 2: "Redirect loop or blank popup"

**Solutions:**

1. Verify REDIRECT_URL matches your actual frontend URL:
   - Local: `http://localhost:5173` (if using Vite)
   - Production: `https://yourdomain.com`

2. Check Azure App Registration settings:
   - Go to Azure Portal → App registrations
   - Find your app → Redirect URIs
   - Verify `http://localhost:5173` is registered

### Issue 3: "User creation fails after Microsoft login"

**Debug:** Check if password is being validated:

```bash
# Test backend endpoint
curl -X POST http://localhost:3000/api/auth/microsoft \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "test_token",
    "idToken": "test_id_token"
  }'
```

Expected error: "Invalid idToken" (token decode will fail with test data - that's OK)

### Issue 4: "Microsoft button shows 'Login failed'"

**Debug:** Add console logs:

```typescript
// In frontend Login component
const handleMicrosoftLogin = async () => {
  console.log("🔵 Starting Microsoft login...");
  try {
    const response = await msalInstance.loginPopup({
      scopes: ["openid", "profile", "email"],
    });
    console.log("✅ Microsoft response:", response);

    const payload = await getMicrosoftAuthPayload(response);
    console.log("✅ Auth payload:", payload);

    completeLogin(payload.user, payload.token);
  } catch (err) {
    console.error("❌ Error:", err);
  }
};
```

### Issue 5: "Cookies not being set"

**Check CORS in backend:**

```typescript
// src/core/cors.config.ts - should have credentials: true
export const corsConfig = {
  origin: "http://localhost:5173",
  credentials: true, // ✅ MUST BE TRUE
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};
```

**Check frontend fetch:**

```typescript
// In getMicrosoftAuthPayload() - should have credentials
const backendResponse = await fetch(
  `${environment.APP_API_URL}/auth/microsoft`,
  {
    method: "POST",
    credentials: "include", // ✅ MUST BE INCLUDED
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accessToken: authResult.accessToken,
      idToken: authResult.idToken,
    }),
  },
);
```

---

## **Verify Installation**

### Backend:

```bash
# Make sure jsonwebtoken is installed
npm list jsonwebtoken

# If missing:
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

### Restart Services:

```bash
# Backend
npm run start:dev

# Frontend
npm run dev
```

---

## **Test Checklist**

- [ ] Microsoft button appears on login page
- [ ] Click Microsoft button opens popup
- [ ] Sign in with your Microsoft account
- [ ] Popup closes and redirects to home
- [ ] `accessToken` appears in `sessionStorage`
- [ ] User info displays correctly
- [ ] Private routes require login
- [ ] Refresh token cookie is set (check DevTools → Application → Cookies)
- [ ] Page refresh doesn't log you out (refresh token works)

---

## **Production Considerations**

Before deploying to production:

1. **Update environment variables:**

   ```typescript
   // production environment.ts
   REDIRECT_URL: "https://yourdomain.com";
   APP_API_URL: "https://api.yourdomain.com/api";
   ```

2. **Enable HTTPS-only cookies:**

   ```typescript
   // auth.controller.ts
   res.cookie("refreshToken", token, {
     secure: process.env.NODE_ENV === "production", // ✅ Requires HTTPS
     httpOnly: true,
     sameSite: "strict", // Stricter in production
   });
   ```

3. **Add to Azure Portal:**
   - Register `https://yourdomain.com` as allowed redirect URI
   - Set reply URL for production environment

4. **Enable Token Signature Verification** (Optional but Recommended):
   - Validate Microsoft's JWT signature using public keys
   - Prevents token tampering

---

## **Common Environment Values**

| Variable         | Local                       | Production                       |
| ---------------- | --------------------------- | -------------------------------- |
| `APP_API_URL`    | `http://localhost:3000/api` | `https://api.yourdomain.com/api` |
| `REDIRECT_URL`   | `http://localhost:5173`     | `https://yourdomain.com`         |
| `NODE_ENV`       | `development`               | `production`                     |
| `SECURE_COOKIES` | `false`                     | `true`                           |

---

## **Need More Help?**

Check these logs:

1. **Browser Console** (`F12` → Console tab)
2. **Network Tab** - Check `/api/auth/microsoft` request/response
3. **Backend Logs** - Check terminal running `npm run start:dev`
4. **Azure AD Logs** - Azure Portal → Azure AD → Sign-ins
