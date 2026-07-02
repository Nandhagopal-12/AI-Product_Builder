const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
const TOKEN_SECRET =
  process.env.AUTH_TOKEN_SECRET || "day-35-development-token-secret";
const TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

function toBase64Url(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function signTokenPart(value) {
  return crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(value)
    .digest("base64url");
}

function createAuthToken(user) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const payload = {
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS,
  };
  const unsignedToken = `${toBase64Url(header)}.${toBase64Url(payload)}`;
  const signature = signTokenPart(unsignedToken);

  return `${unsignedToken}.${signature}`;
}

function verifyAuthToken(token) {
  const parts = String(token || "").split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [header, payload, signature] = parts;
  const unsignedToken = `${header}.${payload}`;
  const expectedSignature = signTokenPart(unsignedToken);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return null;
  }

  try {
    const decodedPayload = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (!decodedPayload.sub || decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decodedPayload;
  } catch (error) {
    return null;
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return `${salt}:${passwordHash}`;
}

function checkPassword(password, savedPasswordHash) {
  const [salt, originalHash] = savedPasswordHash.split(":");

  const passwordHash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(originalHash, "hex"),
    Buffer.from(passwordHash, "hex")
  );
}

function validateAuthInput(body) {
  const { name = "", email = "", password = "" } = body;
  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password);

  if (!cleanEmail || !cleanPassword) {
    return {
      error: "Email and password are required",
    };
  }

  if (!cleanEmail.includes("@")) {
    return {
      error: "Email must be valid",
    };
  }

  if (cleanPassword.length < 6) {
    return {
      error: "Password must be at least 6 characters",
    };
  }

  return {
    user: {
      name: cleanName || cleanEmail.split("@")[0],
      email: cleanEmail,
      password: cleanPassword,
    },
  };
}

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

function getUserFromTokenRequest(request) {
  const authHeader = request.get("authorization") || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return {
      error: "Auth token is required",
    };
  }

  const payload = verifyAuthToken(token);

  if (!payload) {
    return {
      error: "Auth token is invalid or expired",
    };
  }

  const userId = Number(payload.sub);

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      error: "Auth token has an invalid user",
    };
  }

  return { userId };
}

function requireCurrentUser(request, response) {
  const userCheck = getUserFromTokenRequest(request);

  if (userCheck.error) {
    response.status(401).json({
      message: "Please log in to continue",
    });
    return null;
  }

  return userCheck.userId;
}

async function findListingOwner(listingId) {
  const result = await pool.query(
    "SELECT id, user_id FROM listings WHERE id = $1",
    [listingId]
  );

  return result.rows[0] || null;
}

function checkListingOwnership(listing, currentUserId, response) {
  if (!listing) {
    response.status(404).json({
      message: "Listing not found",
    });
    return false;
  }

  if (listing.user_id !== currentUserId) {
    response.status(403).json({
      message: "You can only change your own listings",
    });
    return false;
  }

  return true;
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

app.post("/api/auth/signup", async (request, response) => {
  try {
    const validation = validateAuthInput(request.body);

    if (validation.error) {
      return response.status(400).json({
        message: validation.error,
      });
    }

    const { name, email, password } = validation.user;
    const passwordHash = hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );

    const newUser = result.rows[0];

    response.status(201).json({
      message: "Signup successful",
      token: createAuthToken(newUser),
      user: newUser,
    });
  } catch (error) {
    if (error.code === "23505") {
      return response.status(409).json({
        message: "Email is already registered",
      });
    }

    response.status(500).json({
      message: "Could not sign up",
    });
  }
});

app.post("/api/auth/login", async (request, response) => {
  try {
    const { email = "", password = "" } = request.body;
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    if (!cleanEmail || !cleanPassword) {
      return response.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      "SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1",
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return response.status(401).json({
        message: "Invalid email or password",
      });
    }

    const savedUser = result.rows[0];
    const passwordMatches = checkPassword(cleanPassword, savedUser.password_hash);

    if (!passwordMatches) {
      return response.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      created_at: savedUser.created_at,
    };

    response.json({
      message: "Login successful",
      token: createAuthToken(user),
      user,
    });
  } catch (error) {
    response.status(500).json({
      message: "Could not log in",
    });
  }
});

app.get("/api/listings", async (request, response) => {
  try {
    const currentUserId = requireCurrentUser(request, response);

    if (!currentUserId) {
      return;
    }

    const result = await pool.query(
      `SELECT id, user_id, title, city, price, status, created_at
       FROM listings
       WHERE user_id = $1
       ORDER BY id`,
      [currentUserId]
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
    const currentUserId = requireCurrentUser(request, response);

    if (!currentUserId) {
      return;
    }

    if (validation.error) {
      return response.status(400).json({
        message: validation.error,
      });
    }

    const { title, city, price, status } = validation.listing;

    const result = await pool.query(
      `INSERT INTO listings (user_id, title, city, price, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, title, city, price, status, created_at`,
      [currentUserId, title, city, price, status]
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
    const currentUserId = requireCurrentUser(request, response);

    if (!currentUserId) {
      return;
    }

    if (!Number.isInteger(listingId)) {
      return response.status(400).json({
        message: "Listing id must be a number",
      });
    }

    const listing = await findListingOwner(listingId);

    if (!checkListingOwnership(listing, currentUserId, response)) {
      return;
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
       WHERE id = $5 AND user_id = $6
       RETURNING id, user_id, title, city, price, status, created_at`,
      [title, city, price, status, listingId, currentUserId]
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
    const currentUserId = requireCurrentUser(request, response);

    if (!currentUserId) {
      return;
    }

    if (!Number.isInteger(listingId)) {
      return response.status(400).json({
        message: "Listing id must be a number",
      });
    }

    const listing = await findListingOwner(listingId);

    if (!checkListingOwnership(listing, currentUserId, response)) {
      return;
    }

    const result = await pool.query(
      "DELETE FROM listings WHERE id = $1 AND user_id = $2 RETURNING id, title",
      [listingId, currentUserId]
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
    const currentUserId = requireCurrentUser(request, response);

    if (!currentUserId) {
      return;
    }

    if (!Number.isInteger(listingId)) {
      return response.status(400).json({
        message: "Listing id must be a number",
      });
    }

    const listing = await findListingOwner(listingId);

    if (!checkListingOwnership(listing, currentUserId, response)) {
      return;
    }

    const result = await pool.query(
      `SELECT id, user_id, title, city, price, status, created_at
       FROM listings
       WHERE id = $1 AND user_id = $2`,
      [listingId, currentUserId]
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
