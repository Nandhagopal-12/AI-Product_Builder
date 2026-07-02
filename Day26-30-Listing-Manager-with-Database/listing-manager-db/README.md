# Listing Manager Database

Day 26 goal: plan the first PostgreSQL data model and create seed data.

## What we are storing

This app stores property listings. Each listing is one row in the `listings` table.

## Table plan

Table name: `listings`

| Column | Type | Why we need it |
| --- | --- | --- |
| `id` | `SERIAL PRIMARY KEY` | Unique ID for each listing |
| `title` | `VARCHAR(120)` | Short listing name |
| `city` | `VARCHAR(80)` | Where the listing is located |
| `price` | `INTEGER` | Monthly rent or price |
| `status` | `VARCHAR(20)` | Example: `available`, `pending`, `rented` |
| `created_at` | `TIMESTAMP` | When the row was created |

## Run later after PostgreSQL is installed

Open PowerShell inside this folder and run:

```powershell
createdb listing_manager
psql -d listing_manager -f schema.sql
psql -d listing_manager -f seed.sql
psql -d listing_manager -c "SELECT * FROM listings;"
```

If `psql` is not recognized, PostgreSQL is not installed or its `bin` folder is not in PATH.

## Today's checkpoint

- You understand what a table is.
- You understand that each listing becomes one row.
- You understand why each row needs a unique `id`.
- You have schema and seed files ready for PostgreSQL.

## Day 27 API checkpoint

The Express backend reads the PostgreSQL `listings` table through API routes.

Routes:

```text
GET /api/health
GET /api/listings
GET /api/listings/:id
POST /api/listings
PUT /api/listings/:id
DELETE /api/listings/:id
```

Setup:

From the `Day_26` project folder, run:

```powershell
copy .env.example .env
npm install
npm run dev
```

In `.env`, replace `your_password_here` with your local PostgreSQL password.

## Day 28 form checkpoint

The React form sends new listing data to Express. Express validates the request and inserts the row into PostgreSQL.

Run backend from the `Day_26` folder:

```powershell
npm.cmd run dev
```

Run frontend from the `Day_26/client` folder:

```powershell
npm.cmd run dev
```

Flow:

```text
React form
  -> POST /api/listings
  -> Express validation
  -> SQL INSERT
  -> PostgreSQL listings table
  -> new row returned as JSON
  -> React shows confirmation and updates the list
```

## Day 29 edit and delete checkpoint

The app can update and delete existing PostgreSQL rows.

Edit flow:

```text
Click Edit
  -> React fills the form with that listing
  -> submit sends PUT /api/listings/:id
  -> Express validates request.body
  -> SQL UPDATE changes the database row
  -> React refetches the list
```

Delete flow:

```text
Click Delete
  -> confirm delete
  -> React sends DELETE /api/listings/:id
  -> SQL DELETE removes the database row
  -> React refetches the list
```

## Day 30 admin CRUD checkpoint

The app now works like a small admin screen for database records.

It should:

- show saved records in a table-style list
- add a new listing
- edit an existing listing
- delete an existing listing
- show loading, empty, success, and validation/error states
- refetch records after update or delete

CRUD flow:

```text
Create -> POST /api/listings -> SQL INSERT
Read   -> GET /api/listings -> SQL SELECT
Update -> PUT /api/listings/:id -> SQL UPDATE
Delete -> DELETE /api/listings/:id -> SQL DELETE
```
