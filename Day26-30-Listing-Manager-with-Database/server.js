const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

function validateListingInput(body) {
  const { title, city, price, status = "available" } = body;
  const allowedStatuses = ["available", "pending", "rented"];

  if (!title || !city || price === undefined) {
    return {
      error: "Title, city, and price are required",
    };
  }

  const cleanTitle = String(title).trim();
  const cleanCity = String(city).trim();
  const listingPrice = Number(price);
  const cleanStatus = String(status).trim();

  if (!cleanTitle || !cleanCity) {
    return {
      error: "Title and city cannot be empty",
    };
  }

  if (!Number.isInteger(listingPrice) || listingPrice <= 0) {
    return {
      error: "Price must be a positive whole number",
    };
  }

  if (!allowedStatuses.includes(cleanStatus)) {
    return {
      error: "Status must be available, pending, or rented",
    };
  }

  return {
    listing: {
      title: cleanTitle,
      city: cleanCity,
      price: listingPrice,
      status: cleanStatus,
    },
  };
}

app.get("/api/health", async (request, response) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    response.json({
      status: "ok",
      database: "connected",
      currentTime: result.rows[0].current_time,
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

app.get("/api/listings", async (request, response) => {
  try {
    const result = await pool.query(
      "SELECT id, title, city, price, status, created_at FROM listings ORDER BY id"
    );

    response.json(result.rows);
  } catch (error) {
    response.status(500).json({
      message: "Could not fetch listings",
    });
  }
});

app.post("/api/listings", async (request, response) => {
  try {
    const validation = validateListingInput(request.body);

    if (validation.error) {
      return response.status(400).json({
        message: validation.error,
      });
    }

    const { title, city, price, status } = validation.listing;

    const result = await pool.query(
      `INSERT INTO listings (title, city, price, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, city, price, status, created_at`,
      [title, city, price, status]
    );

    response.status(201).json(result.rows[0]);
  } catch (error) {
    response.status(500).json({
      message: "Could not create listing",
    });
  }
});

app.put("/api/listings/:id", async (request, response) => {
  try {
    const listingId = Number(request.params.id);

    if (!Number.isInteger(listingId)) {
      return response.status(400).json({
        message: "Listing id must be a number",
      });
    }

    const validation = validateListingInput(request.body);

    if (validation.error) {
      return response.status(400).json({
        message: validation.error,
      });
    }

    const { title, city, price, status } = validation.listing;

    const result = await pool.query(
      `UPDATE listings
       SET title = $1, city = $2, price = $3, status = $4
       WHERE id = $5
       RETURNING id, title, city, price, status, created_at`,
      [title, city, price, status, listingId]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({
        message: "Listing not found",
      });
    }

    response.json(result.rows[0]);
  } catch (error) {
    response.status(500).json({
      message: "Could not update listing",
    });
  }
});

app.delete("/api/listings/:id", async (request, response) => {
  try {
    const listingId = Number(request.params.id);

    if (!Number.isInteger(listingId)) {
      return response.status(400).json({
        message: "Listing id must be a number",
      });
    }

    const result = await pool.query(
      "DELETE FROM listings WHERE id = $1 RETURNING id, title",
      [listingId]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({
        message: "Listing not found",
      });
    }

    response.json({
      message: "Listing deleted",
      listing: result.rows[0],
    });
  } catch (error) {
    response.status(500).json({
      message: "Could not delete listing",
    });
  }
});

app.get("/api/listings/:id", async (request, response) => {
  try {
    const listingId = Number(request.params.id);

    if (!Number.isInteger(listingId)) {
      return response.status(400).json({
        message: "Listing id must be a number",
      });
    }

    const result = await pool.query(
      "SELECT id, title, city, price, status, created_at FROM listings WHERE id = $1",
      [listingId]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({
        message: "Listing not found",
      });
    }

    response.json(result.rows[0]);
  } catch (error) {
    response.status(500).json({
      message: "Could not fetch listing",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listing Manager API is running on http://localhost:${PORT}`);
});
