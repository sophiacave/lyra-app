# Auth and Tokens

**Course:** AI Stack Builder
**Order:** 6
**Type:** lesson
**Access:** Premium

---
[AI Stack Builder](/academy/ai-stack-builder/)
  Lesson 6 of 10


  # Auth & Tokens

  Authentication is how your app knows who is talking to it. JWTs (JSON Web Tokens) are the standard. Understanding them is the difference between a secure app and a data breach waiting to happen.


## Why Authentication Matters

Without authentication, every request to your app is anonymous. Anyone can read anyone's data. Anyone can modify anyone's records. **Authentication proves identity** — it answers "who is making this request?" before your app does anything.

Supabase handles the hard parts (password hashing, session management, email verification) so you never write security-critical code yourself. You get a battle-tested auth system with one import.


&#x1f512;
JWT StandardIndustry standard for stateless authentication — no server-side sessions needed


&#x1f6e1;&#xfe0f;
RLS + JWTDatabase-level security using token claims — even buggy code cannot bypass it


&#x26a1;
Zero Custom CodeSupabase Auth handles signup, login, password reset, email verification


## JWT Anatomy: Three Parts, One Token

A JWT has three parts separated by dots. Each part is base64url-encoded. Together they form a self-contained credential that proves who the user is without hitting a database on every request.


eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJidWlsZGVyQGV4YW1wbGUuY29tIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJpYXQiOjE3MTExNTIwMDAsImV4cCI6MTcxMTE1NTYwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c


**Header (Red) — Algorithm + Type**

{ "alg": "HS256", // HMAC-SHA256 signing algorithm

  "typ": "JWT" }  // token type

Tells the server which algorithm was used to create the signature. HS256 (HMAC with SHA-256) is the most common for Supabase.


**Payload (Purple) — Claims (Your Data)**

{ "sub": "1234567890",          // subject (user ID)

  "email": "builder@example.com", // custom claim

  "role": "authenticated",       // Supabase role

  "iat": 1711152000,             // issued at (Unix timestamp)

  "exp": 1711155600 }            // expires in 1 hour

The actual data. `sub` is the user ID — Supabase's `auth.uid()` extracts this for RLS. `exp` is when the token expires (default: 1 hour). **The payload is NOT encrypted** — anyone can decode it. It is only signed.


**Signature (Green) — Verification**

HMACSHA256(

  base64UrlEncode(header) + "." + base64UrlEncode(payload),

  secret // your JWT secret (server-side only)

)

The server uses this to verify the token was not tampered with. If anyone changes the payload (e.g., swapping their user ID for another's), the signature will not match, and the server rejects the request.


**Key insight:** JWTs are **signed, not encrypted**. Anyone can decode the payload (it is just base64). The signature only prevents tampering — it proves the data has not been modified since the server issued it. **Never put secrets in JWT payloads.**


## The Auth Flow: Signup to Database Query

Here is exactly what happens from the moment a user signs up to the moment they read their own data — and how JWT + RLS work together at each step.


1. **User signs up** — email + password sent to Supabase Auth via `supabase.auth.signUp()`
2. **Email verification** — Supabase sends a magic link or OTP to confirm the address
3. **JWT issued** — after verification, Supabase returns an access token (1hr) + refresh token (long-lived)
4. **Authenticated requests** — the JWT travels in the `Authorization: Bearer` header with every API call
5. **RLS enforced** — Postgres extracts `auth.uid()` from the JWT and scopes all queries to that user's rows


## Supabase Auth in Code

The Supabase client handles token management automatically — storing tokens, refreshing expired ones, and attaching them to requests. You rarely need to touch JWTs directly.


JavaScript — Frontend auth with Supabase

```
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Sign up a new user
const { data, error } = await supabase.auth.signUp({
  email: 'builder@example.com',
  password: 'secure-password-123'
})

// Sign in an existing user
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'builder@example.com',
  password: 'secure-password-123'
})

// Get the current session (includes the JWT)
const { data: { session } } = await supabase.auth.getSession()
console.log(session.access_token) // This is the JWT!

// All subsequent queries automatically use the JWT
// RLS scopes results to this user's rows
const { data } = await supabase
  .from('user_data')
  .select('*')  // returns only this user's rows
```


## Protecting Edge Functions with JWT

When your frontend calls an edge function, it sends the JWT in the Authorization header. The edge function verifies it before doing anything — this is the security gate for your backend.


TypeScript — Edge function with JWT verification

```
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

Deno.serve(async (req) => {
  // 1. Extract the Bearer token
  const authHeader = req.headers.get("Authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response("Missing token", { status: 401 })
  }
  const token = authHeader.replace("Bearer ", "")

  // 2. Create client with the user's token
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )

  // 3. Verify the token — this hits Supabase Auth
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return new Response("Invalid token", { status: 401 })
  }

  // 4. Token valid — RLS scopes queries to this user
  const { data } = await supabase
    .from("user_data")
    .select("*")  // only this user's rows returned

  return new Response(JSON.stringify({ user: user.email, data }))
})
```


## RLS Policies: The Database Bouncer

Row Level Security is what makes JWT + Supabase truly powerful. Instead of checking permissions in your application code (where bugs can bypass them), **the database itself enforces who can see what**.


SQL — RLS policies that use JWT claims

```
-- Enable RLS on a user-scoped table
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Users can only READ their own rows
-- auth.uid() extracts the 'sub' claim from the JWT automatically
CREATE POLICY "users read own data" ON user_data
  FOR SELECT TO authenticated
  USING ( auth.uid() = user_id );

-- Users can only INSERT rows with their own user_id
CREATE POLICY "users insert own data" ON user_data
  FOR INSERT TO authenticated
  WITH CHECK ( auth.uid() = user_id );

-- Users can only UPDATE their own rows
CREATE POLICY "users update own data" ON user_data
  FOR UPDATE TO authenticated
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );
```


**Why this is powerful:** Even if your application code has a bug that forgets to filter by user_id, the database rejects unauthorized rows automatically. RLS is defense-in-depth — security at the lowest possible layer.


## Access Tokens vs. Refresh Tokens

Supabase issues two tokens on login. Understanding the difference prevents the most common auth bugs.


**Access Token (JWT)**
**Lifespan:** 1 hour (3600 seconds)
**Purpose:** Sent with every API request to prove identity
**Storage:** In memory (Supabase client manages this)
**If stolen:** Attacker has access for up to 1 hour


**Refresh Token**
**Lifespan:** Long-lived (configurable, typically days/weeks)
**Purpose:** Used ONLY to silently get a new access token
**Storage:** HTTP-only cookie (browser cannot read it via JS)
**If stolen:** Revoke it immediately in Supabase dashboard


**The Supabase client handles this automatically.** When the access token expires, the client silently uses the refresh token to get a new one. Your users never see a login screen mid-session. You do not need to write any token refresh logic.


## Common Auth Mistakes

These mistakes are how data breaches happen. Avoid all of them.


Mistake
Risk
Fix


Storing JWT in localStorage
XSS attack can steal the token
Let the Supabase client handle storage (uses secure cookies)


Putting secrets in JWT payload
Anyone can decode and read them
JWTs are signed, not encrypted — never include sensitive data


Skipping RLS
Any authenticated user can read ALL data
Enable RLS + create policies on every user-facing table


Using service role key in frontend
Bypasses ALL RLS — full database access from browser
Service role key belongs ONLY in edge functions (server-side)


Not verifying JWT in edge functions
Anyone can call your API without authentication
Always call `supabase.auth.getUser()` before processing


### Quiz

**Q1: Which part of a JWT is cryptographically signed to prevent tampering?**
    A. Header only
    B. Payload only
  ✓ C. The signature is computed from the header AND payload together
    D. All three parts are encrypted
  *The signature is an HMAC computed from the base64-encoded header + payload using a secret. Any change to either part invalidates the signature. Note: the parts are signed, not encrypted — the payload is readable by anyone.*

**Q2: What does the sub claim in a JWT payload represent?**
    A. Subscription tier
  ✓ B. Subject — typically the user ID
    C. Supabase project ID
    D. Secret key
  *The sub (subject) claim uniquely identifies the principal — usually the user ID. Supabase auth.uid() extracts this value to enforce Row Level Security policies.*

**Q3: How long does a Supabase access token (JWT) last by default?**
    A. 24 hours
    B. 7 days
  ✓ C. 1 hour
    D. 30 minutes
  *Supabase access tokens expire after 1 hour (3600 seconds). The long-lived refresh token silently obtains a new access token when the old one expires — users stay logged in without interruption.*

**Q4: Why is RLS more secure than checking permissions in application code?**
    A. RLS is faster than code checks
  ✓ B. Even if your app code has a bug that forgets to filter by user_id, the database itself rejects unauthorized rows
    C. RLS encrypts all data at rest
    D. RLS prevents SQL injection
  *Application code can have bugs — a missed WHERE clause, a wrong variable, or a code path that skips validation. RLS operates at the database level, below your app code. It enforces access rules on EVERY query, regardless of how the query was constructed.*

**Q5: What happens if you store the service role key in a NEXT_PUBLIC_ variable?**
    A. Nothing — it is automatically protected
  ✓ B. The key is exposed in the browser, bypassing ALL RLS — anyone can read, write, or delete all database data
    C. Supabase rejects the key
    D. The build fails
  *NEXT_PUBLIC_ variables are included in the browser bundle, visible to anyone. The service role key bypasses RLS entirely. Exposing it gives any browser visitor full, unrestricted access to your entire database. This is a critical security vulnerability.*


### Auth & Tokens Flashcards

**Card 1:**
Front: What are the three parts of a JWT?
Back: Header (algorithm + type), Payload (claims/data), Signature (cryptographic verification). Separated by dots and base64url-encoded. Signed but NOT encrypted — anyone can read the payload.

**Card 2:**
Front: What is RLS and why does it matter for JWTs?
Back: Row Level Security is a Postgres feature that enforces data access rules per row. Supabase RLS policies use auth.uid() to extract the user ID from the JWT, so each user can only access their own data — even if application code has bugs.

**Card 3:**
Front: What is the difference between an access token and a refresh token?
Back: Access token: short-lived JWT (1 hour) sent with every request. Refresh token: long-lived, stored securely, used only to silently get a new access token when the old one expires. The Supabase client handles refresh automatically.

**Card 4:**
Front: What HTTP header carries a JWT in API requests?
Back: Authorization: Bearer . The server reads this header, extracts the token, and verifies the signature to authenticate the request.

**Card 5:**
Front: Why should you never store secrets in a JWT payload?
Back: JWTs are signed, not encrypted. The payload is simply base64-encoded — anyone can decode it and read the contents. The signature only prevents tampering, not reading. Store secrets in server-side environment variables.

**Card 6:**
Front: What does auth.uid() do in a Supabase RLS policy?
Back: Extracts the sub (subject) claim from the JWT — which is the authenticated user ID. RLS policies use this to restrict each query to only the rows belonging to the current user.


Lesson 6 of 10

Module 1
