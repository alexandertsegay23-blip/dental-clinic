# 🔒 Security Documentation

## Overview

This document outlines the security measures implemented in the Dental Clinic website.

---

## Implemented Security Features

### 1. Route Protection (Proxy)

**File:** `src/proxy.ts`

All `/admin/*` routes are protected by proxy:
- Unauthenticated users are automatically redirected to `/admin/login`
- API endpoints return 401 Unauthorized without valid session

```typescript
// Protected routes
const adminRoutes = ['/manage', '/admin', '/api/manage', '/api/admin'];

// Public routes (no auth required)
const publicRoutes = ['/manage/login', '/admin/login', '/api/manage/login', '/api/admin/login'];
```

### 2. Session-Based Authentication

**File:** `src/lib/auth.ts`

- Sessions are stored server-side in SQLite database
- Session tokens are cryptographically secure (256-bit random)
- HTTP-only, secure cookies
- 24-hour session expiration
- bcrypt password hashing (cost factor 12)

### 3. Rate Limiting

**File:** `src/lib/rate-limit.ts`

Login attempts are rate-limited:
- **5 attempts** per IP address
- **15-minute** lockout window
- Automatic cleanup of expired entries

```typescript
checkRateLimit(ip, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });
```

### 4. Security Headers

All responses include security headers:

```typescript
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; ...
```

### 5. Input Validation

All API endpoints use Zod for schema validation:
- Login credentials
- Patient data
- Appointment data
- Settings

### 6. API Route Protection

All `/api/admin/*` routes verify authentication:

```typescript
const user = await getCurrentUser();
if (!user) {
  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
}
```

---

## Environment Variables

See `.env.example` for required variables:

```bash
# REQUIRED - Creates default admin account
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!

# RECOMMENDED - Session security
SESSION_SECRET=your-session-secret-here

# SMS Configuration
AFROMESSAGE_API_KEY=your-api-key
```

---

## Production Checklist

Before deploying to production:

### 1. Change Default Credentials
```bash
# Set strong admin credentials
ADMIN_USERNAME=unique-admin-username
ADMIN_PASSWORD=<generate-strong-password>
```

### 2. Enable HTTPS
Ensure `NODE_ENV=production` so cookies use `secure: true`

### 3. Use Production Database
For high-traffic sites, consider PostgreSQL or MySQL instead of SQLite

### 4. Set Environment Variables
```bash
# On Vercel
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD
```

### 5. Monitor Failed Logins
Check server logs for repeated failed login attempts

---

## Common Security Questions

### Q: What happens if someone tries to access /admin without logging in?
A: They are automatically redirected to `/admin/login` with a `redirect` query parameter to return after login.

### Q: How long is a session valid?
A: 24 hours. After that, the user must log in again.

### Q: Can someone brute-force the login?
A: No. After 5 failed attempts, the IP is locked for 15 minutes.

### Q: Where are sessions stored?
A: In the SQLite database (`sessions` table). Each session has an expiration timestamp.

### Q: Is the password stored securely?
A: Yes. Passwords are hashed using bcrypt with cost factor 12. Plain-text passwords are never stored.

---

## Incident Response

If you suspect unauthorized access:

1. **Check session logs** - Review the `sessions` table for suspicious activity
2. **Invalidate all sessions** - Clear the `sessions` table
3. **Change admin password** - Use the environment variables
4. **Review access logs** - Check for unusual IP addresses
5. **Enable additional monitoring** - Consider adding logging service

```sql
-- Clear all sessions (force logout everyone)
DELETE FROM sessions;
```
