# SvelteKit SaaS App Folder Structure

## Client-Side Only SPA with External API
```
src/
├── lib/
│   ├── stores/
│   │   ├── auth.js                 # Main auth store - user state, token management
│   │   └── user.js                 # User profile data store
│   │
│   ├── api/
│   │   ├── client.js               # Fetch wrapper with auth headers, error handling
│   │   ├── auth.js                 # Auth API calls: login, signup, logout, refresh
│   │   └── users.js                # User-related API calls: profile, settings
│   │
│   ├── guards/
│   │   └── route-guard.js          # Reusable auth check logic
│   │
│   └── utils/
│       ├── config.js               # API_BASE_URL and environment constants
│       ├── storage.js              # localStorage/sessionStorage helpers
│       ├── token.js                # JWT decode, validation, expiry checks
│       └── api-error.js            # Error handling utilities
│
├── routes/
│   ├── (public)/
│   │   ├── +layout.js              # ssr = false for public routes
│   │   ├── login/
│   │   │   └── +page.svelte        # Login page
│   │   ├── signup/
│   │   │   └── +page.svelte        # Registration page
│   │   ├── pricing/
│   │   │   └── +page.svelte        # Pricing page
│   │   ├── features/
│   │   │   └── +page.svelte        # Features page
│   │   ├── about/
│   │   │   └── +page.svelte        # About page
│   │   └── recover/
│   │       ├── +page.svelte        # Request password reset
│   │       └── [token]/
│   │           └── +page.svelte    # Reset password with token
│   │
│   ├── (protected)/
│   │   ├── +layout.svelte          # Auth guard - redirects if not authenticated
│   │   ├── +layout.js              # ssr = false for protected routes
│   │   ├── dashboard/
│   │   │   └── +page.svelte        # Main dashboard page
│   │   ├── settings/
│   │   │   ├── +page.svelte        # General settings overview
│   │   │   ├── profile/
│   │   │   │   └── +page.svelte    # Profile settings
│   │   │   ├── security/
│   │   │   │   └── +page.svelte    # Password, 2FA settings
│   │   │   ├── notifications/
│   │   │   │   └── +page.svelte    # Notification preferences
│   │   │   └── billing/
│   │   │       └── +page.svelte    # Subscription, payment methods
│   │   └── admin/
│   │       └── +page.svelte        # Admin panel (with role check)
│   │
│   ├── +layout.svelte              # Root layout - auth initialization
│   ├── +layout.js                  # export const ssr = false, csr = true
│   ├── +page.svelte                # Smart root - landing page OR redirect to dashboard
│   └── +error.svelte               # 404 and error handling
│
└── app.html                        # HTML template
```

## Route Groups Explanation

### (public) - No Authentication Required
- Routes are accessible without login
- URL examples: `/login`, `/signup`, `/pricing`, `/recover`
- Shared layout for public pages styling

### (protected) - Authentication Required
- Routes require valid auth token
- Layout checks auth and redirects to `/login` if not authenticated
- URL examples: `/dashboard`, `/settings`, `/settings/profile`
- Shared layout with app navigation

**Note:** Route groups `(public)` and `(protected)` do NOT appear in browser URLs - they're for organization only.

## URL Structure

| Folder Path | Browser URL |
|-------------|-------------|
| `routes/+page.svelte` | `/` |
| `routes/(public)/login/+page.svelte` | `/login` |
| `routes/(public)/signup/+page.svelte` | `/signup` |
| `routes/(public)/pricing/+page.svelte` | `/pricing` |
| `routes/(public)/recover/+page.svelte` | `/recover` |
| `routes/(public)/recover/[token]/+page.svelte` | `/recover/abc123token` |
| `routes/(protected)/dashboard/+page.svelte` | `/dashboard` |
| `routes/(protected)/settings/+page.svelte` | `/settings` |
| `routes/(protected)/settings/profile/+page.svelte` | `/settings/profile` |

## Key Files

### `lib/stores/auth.js`
- Central authentication state management
- Methods: `login()`, `logout()`, `register()`, `checkAuth()`, `refreshToken()`
- Persists tokens to localStorage
- All components subscribe to this store

### `lib/api/client.js`
- Base fetch wrapper for all API calls
- Automatically adds Authorization headers
- Handles token refresh on 401 errors
- Centralized error handling

### `lib/utils/config.js`
- External API base URL
- Environment-specific configuration
- Feature flags and constants

### `routes/+layout.js` (root)
- Disables SSR: `export const ssr = false`
- Enables CSR: `export const csr = true`
- Makes entire app client-side only

### `routes/+layout.svelte` (root)
- Initializes auth on app load
- Checks for existing tokens in localStorage
- Shows loading state until auth determined

### `routes/(protected)/+layout.svelte`
- Auth guard implementation
- Redirects to `/login` if not authenticated
- Shows loading spinner during auth check

### `routes/+page.svelte` (root)
- **Hybrid approach**: Smart root page
- If authenticated → redirect to `/dashboard`
- If not authenticated → show landing page
- Provides best UX for both visitors and users

## Authentication Flow

1. App loads → Root layout checks localStorage for token
2. If token exists → Validate with auth store
3. Update auth store with user data
4. Components reactively update based on auth state
5. Protected routes check auth in layout
6. Redirect to login if not authenticated

## Deployment

This structure supports static deployment to:
- Netlify
- Vercel
- Cloudflare Pages
- AWS S3 + CloudFront
- Any static hosting provider

Use `adapter-static` in `svelte.config.js`