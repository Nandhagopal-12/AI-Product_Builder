# Rental Scout Full-Stack v1 Plan

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