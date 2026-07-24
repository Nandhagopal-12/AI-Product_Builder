# Rental Scout Full-Stack v1 Plan

The full workflow means: **how the app will work from database → backend → frontend → user action**.

Project: **Rental Scout Full-Stack v1**

**Big Picture**

```text
User clicks in React
        ↓
React sends request to Express API
        ↓
Express checks route and validation
        ↓
Express reads/writes PostgreSQL data
        ↓
Express sends JSON response
        ↓
React shows updated UI
```

Example:

```text
User clicks "Save Listing"
        ↓
React sends POST /api/saved-listings
        ↓
Backend checks logged-in user
        ↓
Backend saves user_id + listing_id in database
        ↓
React updates dashboard or button state
```

**Day 36: Plan The App**

This is what you already did.

Focus:

- MVP scope
- user stories
- database tables
- API routes
- frontend pages

Output:

```text
PROJECT_PLAN.md
```

Goal: know what we are building before writing code.

**Day 37: Backend Starter + Listings**

Main concept: **backend foundation**

We will create the Express backend and basic routes.

Likely work:

```text
GET /api/health
GET /api/listings
GET /api/listings/:id
```

At first, we may use seed data or database data depending on setup.

Goal: React should later be able to ask the backend for rental listings.

Concepts:

- Express server
- route
- JSON response
- route params
- backend validation basics

**Day 38: Database + Save/Inquiries**

Main concept: **PostgreSQL data flow**

We connect backend routes to database tables.

Tables:

```text
users
listings
saved_listings
inquiries
```

Work may include:

```text
Create schema
Add seed listings
Fetch listings from database
Add inquiry route
Add saved listing route
```

Goal: data should not disappear when server restarts.

Concepts:

- schema
- seed data
- SQL SELECT
- SQL INSERT
- foreign keys
- user_id
- listing_id

**Day 39: Auth + User Dashboard**

Main concept: **user-owned data**

We add login/signup and make some routes private.

Auth routes:

```text
POST /api/auth/signup
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
```

Private routes:

```text
GET /api/saved-listings
POST /api/saved-listings
GET /api/inquiries
POST /api/inquiries
```

Goal: each user sees only their own saved listings and inquiries.

Concepts:

- signup
- login
- password hashing
- current user
- protected routes
- 401 vs 403
- ownership checks

**Day 40: Frontend Integration + Polish**

Main concept: **connect the full app**

React pages:

```text
Home / Listings Page
Listing Detail Page
Signup Page
Login Page
Dashboard Page
```

Frontend flow:

```text
Listings Page fetches GET /api/listings
Detail Page fetches GET /api/listings/:id
Login Page sends POST /api/auth/login
Save button sends POST /api/saved-listings
Inquiry form sends POST /api/inquiries
Dashboard fetches saved listings and inquiries
```

Goal: user can actually use the app from browser.

Concepts:

- fetch
- loading state
- error state
- form submit
- protected page
- dashboard rendering
- simple polish

**Main User Workflow**

A visitor workflow:

```text
Open app
View listings
Open listing detail
Decide to sign up or log in
```

A logged-in user workflow:

```text
Log in
Browse listings
Open listing detail
Save a listing
Send inquiry
Go to dashboard
See saved listings and inquiries
Log out
```

**Main Developer Workflow**

How we build it:

```text
1. Plan app
2. Build backend routes
3. Create database schema
4. Connect backend to database
5. Build React pages
6. Connect React to backend
7. Add auth
8. Protect user routes
9. Test full user flow
10. Polish and demo
```

For now, remember this simple idea:

```text
Database stores data.
Backend controls data.
Frontend displays data.
User actions connect everything.
```

Next, before coding Day 37, you should be able to explain this in your own words:

```text
When a user saves a listing, what should happen from React to backend to database?
```

## MVP Scope

Users can sign up and log in
Users can browse rental listings
Users can open a listing detail page
Logged-in users can save listings
Logged-in users can send inquiries
Logged-in users can view their saved listings and inquiries in a dashboard

## User Stories

As a visitor, I want to view rental listings, so that I can compare homes.
As a visitor, I want to view listing details, so that I can decide if I am interested.
As a user, I want to sign up and log in, so that I can save my favorite listings.
As a logged-in user, I want to save listings, so that I can review them later.
As a logged-in user, I want to send an inquiry, so that I can contact the property owner.
As a logged-in user, I want to view my dashboard, so that I can see my saved listings and inquiries.

## Database Tables

1. users table
2. listings table
3. saved_listings table
4. inquiries table

1. users table
- id
- name
- email
- password_hash
- created_at

2. listings table
- id
- title
- location
- price
- bedrooms
- bathrooms
- description
- image_url
- created_at

3. saved_listings table
- id
- user_id
- listing_id
- created_at

4. inquiries table
- id
- user_id
- listing_id
- message
- created_at

Note : user_id connects saved listings and inquiries to a user.
listing_id connects saved listings and inquiries to a rental listing.

## API Routes

Routes are the backend API paths.

Possible MVP routes:

Checks if backend is running.

GET /api/health

Handles users and login.

POST /api/auth/signup
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout

Shows listings.

GET /api/listings
GET /api/listings/:id

Handles saved listings for the current logged-in user.

GET /api/saved-listings
POST /api/saved-listings
DELETE /api/saved-listings/:id

Handles user inquiries.

GET /api/inquiries
POST /api/inquiries

## Frontend Pages
Pages are the React frontend screens.
MVP pages:
Home / Listings Page
Listing Detail Page
Signup Page
Login Page
Dashboard Page
Dashboard can show:
saved listings
inquiries sent by the user

Day 39 : 
[ Frontend: Form Submission ] 
       │ (email, password, name)
       ▼
[ Backend Route Handler ]
       │ 
       ├─► 1. Check if email already exists in 'users' table 
       │      (If yes ──► Return 400 Bad Request)
       │
       ├─► 2. Hash the password using bcryptjs (e.g., salt rounds = 10)
       │
       ├─► 3. INSERT new user row into 'users' table
       │
       ▼
[ Database saves: id, email, hashed_password ]
       │
       └─► Return 201 Created (Success message)

npm install bcryptjs jsonwebtoken