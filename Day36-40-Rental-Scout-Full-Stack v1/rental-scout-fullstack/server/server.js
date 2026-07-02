const express = require("express");
const cors = require("cors");
const pool = require("./db/pool");

const app = express();
const PORT = 4000;

const listings = [
  {
    id: 1,
    title: "Modern Studio Apartment",
    location: "Kochi",
    price: 18000,
    bedrooms: 1,
    bathrooms: 1,
    description: "A compact studio apartment near public transport.",
    image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
  },
  {
    
    id: 2,
    title: "Two Bedroom Family Home",
    location: "Bengaluru",
    price: 32000,
    bedrooms: 2,
    bathrooms: 2,
    description: "A comfortable home with good sunlight and nearby schools.",
    image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
  }
];

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Rental Scout API" });
});

app.get("/api/health", (req, res) => {
  res.json({ message: "Rental Scout API is running" });
});

app.get("/api/listings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM listings ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/listings/:id", (req, res) => {
  const listingId = Number(req.params.id);

  const listing = listings.find((item) => item.id === listingId);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  res.json(listing);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});