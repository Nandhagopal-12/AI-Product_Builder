# Rental Scout Progress Notes

## Backend Database/API Checkpoint

Created Express backendy
Installed express, cors, pg
Created PostgreSQL database: rental_scout
Created schema.sql
Created seed.sql
Created db/pool.js
Connected Express to PostgreSQL

tables
- Created seed.sql with test user and sample listings
- Connected Express to PostgreSQL using db/pool.js
- Updated listing routes to read from PostgreSQL
- Added inquiry routes
- Added saved listing routes
- Tested success and validation cases

Routes completed:
- GET /
- GET /api/health
- GET /api/listings
- GET /api/listings/:id
- POST /api/inquiries
- GET /api/inquiries
- POST /api/saved-listings
- GET /api/saved-listings

Notes:
- pool.js currently stores database password directly.
- Later, move database config into .env.
- Auth is not added yet, so user_id is still sent manually for testing.

## Day 38 Frontend Integration

Completed:
- Created React client with Vite
- Fetched listings from GET /api/listings
- Displayed loading and error states
- Added detail panel using GET /api/listings/:id
- Added inquiry form connected to POST /api/inquiries
- Added success and error states for inquiry form
- Added save listing button connected to POST /api/saved-listings
- Added dashboard tab to view saved listings
- Verified saved listings and inquiries with backend routes

Future cleanup:
- Prevent duplicate saved listings
- Move hardcoded user_id to auth user after authentication is added
- Improve UI polish later

Yes. We can clean the existing duplicate rows and then add a database rule so duplicates cannot come back.

**Concept: keep one row, delete extra rows**

In `saved_listings`, each saved item should be unique by:

```text
user_id + listing_id
```

So for the same user and same listing, we keep the oldest row and delete the rest.

Open `psql`:

```powershell
psql -U postgres -d rental_scout
```

First, check duplicates:

```sql
SELECT user_id, listing_id, COUNT(*)
FROM saved_listings
GROUP BY user_id, listing_id
HAVING COUNT(*) > 1;
```

Then remove duplicates:

```sql
DELETE FROM saved_listings
WHERE id NOT IN (
  SELECT MIN(id)
  FROM saved_listings
  GROUP BY user_id, listing_id
);
```

Now check your saved listings:

```sql
SELECT * FROM saved_listings ORDER BY id ASC;
```

Then add a database-level protection:

```sql
ALTER TABLE saved_listings
ADD CONSTRAINT unique_saved_listing
UNIQUE (user_id, listing_id);
```

Now PostgreSQL itself will reject duplicate saved listings.

Finally exit:

```sql
\q
```

After this, refresh:

```text
http://localhost:4000/api/saved-listings
```

You should see only unique saved listings.

Cleanup:
- Removed duplicate saved listings from the database
- Added UNIQUE constraint on saved_listings(user_id, listing_id)
- Confirmed dashboard and GET /api/saved-listings show each saved listing only once

## Day 38 Notes - Frontend Integration

Completed:
- Created React frontend using Vite
- Connected React frontend to Express backend
- Fetched listings from `GET /api/listings`
- Displayed database listings in React
- Added loading and error states
- Added listing detail panel using `GET /api/listings/:id`
- Added property detail information in the detail panel
- Added listing status such as available, pending, or rented
- Connected inquiry form to `POST /api/inquiries`
- Added inquiry success and error messages
- Connected Save to Favourites button to `POST /api/saved-listings`
- Added Favourites tab
- Fetched saved listings from `GET /api/saved-listings`
- Added Unsave button using `DELETE /api/saved-listings/:id`
- Confirmed unsaved listings are removed from both UI and backend
- Removed duplicate saved listings from database
- Added `UNIQUE (user_id, listing_id)` constraint to prevent duplicate saved listings
- Improved UI layout and tab structure
- Removed unwanted outer UI border

Tabs created:
- Listings
- My Dashboard
- Favourites

Concepts practiced:
- React state
- `useEffect`
- Fetching backend API data
- Conditional rendering
- Loading, error, and success states
- Form submission
- POST request from React
- DELETE request from React
- Updating UI after backend changes

Future cleanup:
- Replace hardcoded `user_id: 1` with logged-in user after auth
- Make listings truly user-owned with auth/user relationship
- Move extra property details into PostgreSQL instead of frontend helper data

## Day 39 Notes - Auth + User Dashboard

- Added signup route with password hashing.
- Added login route that returns a JWT token.
- Added auth middleware to verify token and create req.user.
- Added GET /api/auth/me to check the logged-in user.
- Protected saved listings routes using req.user.id.
- Protected inquiries routes using req.user.id.
- Removed hardcoded user_id from private frontend requests.
- React now stores token and user data after login.
- React checks the saved token on page refresh.
- Logout clears localStorage and logs the user out.
- Frontend blocks save and inquiry actions when logged out.

Main concept:
Frontend should not send user_id for private actions. It sends a token. The backend verifies the token and gets the real user from req.user.id.

Signup
Login
Password hashing
JWT token creation
Auth middleware
GET /api/auth/me
Protected saved listings
Protected inquiries
Frontend token storage
Frontend session check on refresh
Frontend logout
Frontend guards for logged-out users
User-owned saved listings and inquiries