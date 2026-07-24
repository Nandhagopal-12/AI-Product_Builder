const express = require("express");
const cors = require("cors");
const pool = require("./db/pool");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 4000;
const JWT_SECRET = "rental_scout_secret_key";

app.use(cors());
app.use(express.json());

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
    process.exit(1);
});

function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid token format"
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Rental Scout API" });
});

app.get("/api/health", (req, res) => {
  res.json({ message: "Rental Scout API is running" });
});

// POST signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email, and password are required"
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );

    res.status(201).json({
      message: "Signup successful",
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required"
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET current logged-in user test
app.get("/api/auth/me", authenticateUser, (req, res) => {
  res.json({
    message: "Authenticated user",
    user: req.user
  });
});

// GET all listings
app.get("/api/listings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM listings ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// POST create a listing for the logged-in user
app.post("/api/listings", authenticateUser, async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      title,
      location,
      price,
      bedrooms,
      bathrooms,
      description,
      image_url,
      status
    } = req.body;

    if (!title || !location || !price || !bedrooms || !bathrooms) {
      return res.status(400).json({
        message: "title, location, price, bedrooms, and bathrooms are required"
      });
    }

    const listingDescription = description || `${bedrooms} BHK rental in ${location}.`;

    const result = await pool.query(
      `INSERT INTO listings (
        title,
        location,
        price,
        bedrooms,
        bathrooms,
        description,
        image_url,
        status,
        user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'available'), $9)
      RETURNING *`,
      [
        title,
        location,
        price,
        bedrooms,
        bathrooms,
        listingDescription,
        image_url,
        status,
        user_id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// GET single listing details
app.get("/api/listings/:id", async (req, res) => {
  try {
    const listingId = Number(req.params.id);
    const result = await pool.query(
      "SELECT * FROM listings WHERE id = $1",
      [listingId]
    );

    const listing = result.rows[0];
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    console.error("Error fetching listing details:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// PUT update a listing. User must own the listing.
app.put("/api/listings/:id", authenticateUser, async (req, res) => {
  try {
    const listingId = Number(req.params.id);
    const userId = req.user.id;
    const { title, location, price, bedrooms, bathrooms, status } = req.body;

    if (!title || !location || !price || !bedrooms || !bathrooms || !status) {
      return res.status(400).json({
        message: "title, location, price, bedrooms, bathrooms, and status are required"
      });
    }

    const result = await pool.query(
      `UPDATE listings
       SET title = $1,
           location = $2,
           price = $3,
           bedrooms = $4,
           bathrooms = $5,
           status = $6
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [title, location, price, bedrooms, bathrooms, status, listingId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Listing not found or you do not own this listing" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a listing. User must own the listing.
app.delete("/api/listings/:id", authenticateUser, async (req, res) => {
  try {
    const listingId = Number(req.params.id);
    const userId = req.user.id;

    const existingListing = await pool.query(
      "SELECT id FROM listings WHERE id = $1 AND user_id = $2",
      [listingId, userId]
    );

    if (existingListing.rows.length === 0) {
      return res.status(404).json({ message: "Listing not found or you do not own this listing" });
    }

    await pool.query("DELETE FROM saved_listings WHERE listing_id = $1", [listingId]);
    await pool.query("DELETE FROM inquiries WHERE listing_id = $1", [listingId]);
    await pool.query("DELETE FROM listings WHERE id = $1 AND user_id = $2", [listingId, userId]);

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST send an inquiry
app.post("/api/inquiries", async (req, res) => {  
  try {
    const { listing_id, message } = req.body;

    if (!listing_id || !message || message.trim() === "") {
      return res.status(400).json({
        message: "listing_id and message are required"
  });
}

    const result = await pool.query(
      `INSERT INTO inquiries (listing_id, message)
       VALUES ($1, $2)
       RETURNING *`,
      [listing_id, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all inquiries
app.get("/api/inquiries", authenticateUser, async (req, res) => {  
  try {
    const user_id = req.user.id;
    const result = await pool.query(
      `SELECT inquiries.id,
              inquiries.user_id,
              users.name AS user_name,
              inquiries.listing_id,
              listings.title AS listing_title,
              inquiries.message,
              inquiries.created_at
       FROM inquiries
       LEFT JOIN users ON inquiries.user_id = users.id
       JOIN listings ON inquiries.listing_id = listings.id
       WHERE inquiries.user_id = $1
       ORDER BY inquiries.id ASC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET inquiries received for listings owned by the logged-in vendor
app.get("/api/vendor-inquiries", authenticateUser, async (req, res) => {
  try {
    const vendorId = req.user.id;

    const result = await pool.query(
      `SELECT inquiries.id,
              inquiries.user_id AS sender_id,
              COALESCE(users.name, 'Public visitor') AS sender_name,
              COALESCE(users.email, 'Not logged in') AS sender_email,
              inquiries.listing_id,
              listings.title AS listing_title,
              inquiries.message,
              inquiries.created_at
       FROM inquiries
       LEFT JOIN users ON inquiries.user_id = users.id
       JOIN listings ON inquiries.listing_id = listings.id
       WHERE listings.user_id = $1
       ORDER BY inquiries.created_at DESC`,
      [vendorId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching vendor inquiries:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// POST save a listing
app.post("/api/saved-listings", authenticateUser, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { listing_id } = req.body;

    if (!listing_id) {
      return res.status(400).json({
        message: "listing_id is required"
      });
    }

    const existingSavedListing = await pool.query(
      `SELECT * FROM saved_listings
       WHERE user_id = $1 AND listing_id = $2`,
      [user_id, listing_id]
    );

    if (existingSavedListing.rows.length > 0) {
      return res.status(200).json({
        message: "Listing already saved",
        savedListing: existingSavedListing.rows[0]
      });
    }

    const result = await pool.query(
      `INSERT INTO saved_listings (user_id, listing_id)
       VALUES ($1, $2)
       RETURNING *`,
      [user_id, listing_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error saving listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET saved listings
app.get("/api/saved-listings", authenticateUser, async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await pool.query(
      `SELECT saved_listings.id,
              saved_listings.user_id,
              users.name AS user_name,
              saved_listings.listing_id,
              listings.title,
              listings.location,
              listings.price,
              listings.bedrooms,
              listings.bathrooms,
              listings.image_url,
              saved_listings.created_at
       FROM saved_listings
       JOIN users ON saved_listings.user_id = users.id
       JOIN listings ON saved_listings.listing_id = listings.id
       WHERE saved_listings.user_id = $1
       ORDER BY saved_listings.id ASC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching saved listings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE saved listing
// DELETE saved listing owned by logged-in user
app.delete("/api/saved-listings/:id", authenticateUser, async (req, res) => {
  try {
    const savedListingId = Number(req.params.id);
    const user_id = req.user.id;

    const existingSavedListing = await pool.query(
      "SELECT * FROM saved_listings WHERE id = $1",
      [savedListingId]
    );

    const savedListing = existingSavedListing.rows[0];

    if (!savedListing) {
      return res.status(404).json({
        message: "Saved listing not found"
      });
    }

    if (savedListing.user_id !== user_id) {
      return res.status(403).json({
        message: "You are not allowed to delete this saved listing"
      });
    }

    await pool.query(
      "DELETE FROM saved_listings WHERE id = $1",
      [savedListingId]
    );

    res.json({
      message: "Listing removed from favourites"
    });
  } catch (error) {
    console.error("Error deleting saved listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});










