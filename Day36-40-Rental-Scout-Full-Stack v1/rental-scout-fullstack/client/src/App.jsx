import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import "./App.css";

const listingImagePool = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858",
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
];
function App() {
  // Tab Switching State ('public' or 'dashboard')
  const [currentTab, setCurrentTab] = useState("public");

  // Global Listings State
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Dashboard Saved Listings State
  const [savedListings, setSavedListings] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState("");
  const [vendorInquiries, setVendorInquiries] = useState([]);
  const [vendorInquiriesLoading, setVendorInquiriesLoading] = useState(false);
  const [vendorInquiriesError, setVendorInquiriesError] = useState("");

  // Selected Listing Detail Panel State
  const [selectedListing, setSelectedListing] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  
  // Inquiry Form States
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryContact, setInquiryContact] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState("");
  const [inquiryError, setInquiryError] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  
  // Save Listing Actions States
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || "");
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      localStorage.removeItem("currentUser");
      return null;
    }
  });

const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [loginError, setLoginError] = useState("");

const [signupName, setSignupName] = useState("");
const [signupEmail, setSignupEmail] = useState("");
const [signupPassword, setSignupPassword] = useState("");
const [signupMessage, setSignupMessage] = useState("");
const [signupError, setSignupError] = useState("");

const [newListingTitle, setNewListingTitle] = useState("");
const [newListingLocation, setNewListingLocation] = useState("");
const [newListingPrice, setNewListingPrice] = useState("");
const [newListingBedrooms, setNewListingBedrooms] = useState("");
const [newListingBathrooms, setNewListingBathrooms] = useState("");
const [newListingStatus, setNewListingStatus] = useState("available");
const [newListingMessage, setNewListingMessage] = useState("");
const [newListingError, setNewListingError] = useState("");
const [newListingLoading, setNewListingLoading] = useState(false);

  // Fetch all public listings initially
  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch("http://localhost:4000/api/listings");
        if (!response.ok) throw new Error("Failed to fetch listings");
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError("Could not load listings");
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  useEffect(() => {
  async function checkLoggedInUser() {
    if (!authToken) {
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      const data = await response.json();

      setCurrentUser((previousUser) => ({
        ...previousUser,
        id: data.user.id,
        email: data.user.email
      }));
    } catch (err) {
      setAuthToken("");
      setCurrentUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
    }
  }

  checkLoggedInUser();
}, [authToken]);

  useEffect(() => {
    if (authToken) {
      fetchSavedListings();
      fetchVendorInquiries();
    } else {
      setSavedListings([]);
      setVendorInquiries([]);
    }
  }, [authToken]);

  // Fetch saved listings from database for the Dashboard
  async function fetchSavedListings() {
    try {
      setSavedLoading(true);
      setSavedError("");
      const response = await fetch("http://localhost:4000/api/saved-listings", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch saved listings");
      const data = await response.json();
      setSavedListings(data);
    } catch (err) {
      setSavedError("Could not load your saved favorites");
    } finally {
      setSavedLoading(false);
    }
  }

  async function fetchVendorInquiries() {
    try {
      setVendorInquiriesLoading(true);
      setVendorInquiriesError("");

      const response = await fetch("http://localhost:4000/api/vendor-inquiries", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vendor inquiries");
      }

      const data = await response.json();
      setVendorInquiries(data);
    } catch (err) {
      setVendorInquiriesError("Could not load received inquiries");
    } finally {
      setVendorInquiriesLoading(false);
    }
  }

  async function handleLogin(event) {
  event.preventDefault();

  try {
    setLoginError("");

    const response = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword
      })
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    setAuthToken(data.token);
    setCurrentUser(data.user);

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("currentUser", JSON.stringify(data.user));

    setLoginEmail("");
    setLoginPassword("");
    setCurrentTab("public");
    window.location.href = "/";
  } catch (err) {
    setLoginError("Invalid email or password");
  }
}

  function handleLogout() {
  setAuthToken("");
  setCurrentUser(null);
  setCurrentTab("public");
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
}

  // Handle Tab Navigation Transitions
  function handleTabChange(tabName) {
  setCurrentTab(tabName);
  setSelectedListing(null);

  if (tabName === "favorites") {
    fetchSavedListings();
  }
}

async function handleSignup(event) {
  event.preventDefault();

  try {
    setSignupMessage("");
    setSignupError("");

    const response = await fetch("http://localhost:4000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: signupName,
        email: signupEmail,
        password: signupPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    const loginResponse = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: signupEmail,
        password: signupPassword
      })
    });

    if (!loginResponse.ok) {
      throw new Error("Signup worked, but automatic login failed");
    }

    const loginData = await loginResponse.json();

    setAuthToken(loginData.token);
    setCurrentUser(loginData.user);
    setCurrentTab("public");

    localStorage.setItem("authToken", loginData.token);
    localStorage.setItem("currentUser", JSON.stringify(loginData.user));

    setSignupMessage("Signup successful.");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    window.location.href = "/";
  } catch (err) {
    setSignupError(err.message);
  }
}

  async function handleAddListing(event) {
    event.preventDefault();

    if (!authToken) {
      setNewListingMessage("");
      setNewListingError("Please login before adding a listing.");
      return;
    }

    try {
      setNewListingLoading(true);
      setNewListingMessage("");
      setNewListingError("");

      const response = await fetch("http://localhost:4000/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: newListingTitle,
          location: newListingLocation,
          price: Number(newListingPrice),
          bedrooms: Number(newListingBedrooms),
          bathrooms: Number(newListingBathrooms),
          status: newListingStatus,
          description: `${newListingBedrooms} BHK rental in ${newListingLocation}.`,
          image_url: listingImagePool[listings.length % listingImagePool.length]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add listing");
      }

      setListings((currentListings) => [...currentListings, data]);
      setNewListingTitle("");
      setNewListingLocation("");
      setNewListingPrice("");
      setNewListingBedrooms("");
      setNewListingBathrooms("");
      setNewListingStatus("available");
      setNewListingMessage("Listing added successfully!");
      setCurrentTab("public");
    } catch (err) {
      setNewListingError(err.message);
    } finally {
      setNewListingLoading(false);
    }
  }

  async function handleViewDetails(listingId) {
    try {
      setDetailLoading(true);
      setDetailError("");
      setSelectedListing(null);
      setInquirySuccess("");
      setInquiryError("");
      setSaveSuccess("");
      setSaveError("");
      
      const response = await fetch(`http://localhost:4000/api/listings/${listingId}`);
      if (!response.ok) throw new Error("Failed to fetch listing details");
      const data = await response.json();
      setSelectedListing(data);
    } catch (err) {
      setDetailError("Could not load listing details");
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleInquirySubmit(event) {
    event.preventDefault();
    if (!authToken) {
      setInquiryMessage("");
      setInquiryError("Please login before sending an inquiry.");
      return;
    }
    if (!selectedListing) return;
    if (inquiryMessage.trim() === "") {
      setInquiryError("Message is required");
      return;
    }
    try {
      setInquiryLoading(true);
      setInquirySuccess("");
      setInquiryError("");
      
      const response = await fetch("http://localhost:4000/api/inquiries", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
        listing_id: selectedListing.id,
          message: inquiryMessage
        })
      });

      if (!response.ok) throw new Error("Failed to send inquiry");
      setInquirySuccess("Inquiry sent successfully!");
      setInquiryName("");
      setInquiryContact("");
      setInquiryMessage("");
    } catch (err) {
      setInquiryError("Could not send inquiry");
    } finally {
      setInquiryLoading(false);
    }
  }

 async function handleSaveListing(listingId = selectedListing?.id) {
    if (!authToken) {
      setSaveSuccess("");
      setSaveError("Please login before saving a listing.");
      return;
    }
    if (!listingId) return;
    try {
      setSaveLoading(true);
      setSaveSuccess("");
      setSaveError("");
      
      const response = await fetch("http://localhost:4000/api/saved-listings", {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${authToken}`
},
        body: JSON.stringify({
          listing_id: listingId
        })
      });

      if (!response.ok) throw new Error("Failed to save listing");
      setSaveSuccess("Listing saved successfully!");
      
      fetchSavedListings();
    } catch (err) {
      setSaveError("Could not save listing");
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleUnsaveListing(savedListingId) {
    try {
      const response = await fetch(
      `http://localhost:4000/api/saved-listings/${savedListingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`
        }
      }
    );

      if (!response.ok) {
        throw new Error("Failed to remove saved listing");
      }

      fetchSavedListings();
    } catch (err) {
      setSavedError("Could not remove saved listing");
    }
  }

  if (loading) return <div className="status-msg"><p>Loading database components...</p></div>;
  if (error) return <div className="status-msg error"><p>{error}</p></div>;

  function getPropertyDetails(listing) {
  const extraDetails = {
    1: {
      furnished: "Yes",
      petFriendly: "No",
      swimmingPool: "No"
    },
    2: {
      furnished: "Yes",
      petFriendly: "Yes",
      swimmingPool: "Yes"
    },
    3: {
      furnished: "No",
      petFriendly: "Yes",
      swimmingPool: "No"
    }
  };

  const details = extraDetails[listing.id] || {
    furnished: "No",
    petFriendly: "No",
    swimmingPool: "No"
  };

  return {
    location: listing.location,
    budget: `₹${Number(listing.price).toLocaleString("en-IN")}`,
    bedrooms: `${listing.bedrooms} BHK`,
    furnished: details.furnished,
    petFriendly: details.petFriendly,
    swimmingPool: details.swimmingPool
  };
}



  async function handleDeleteListing(listingId) {
    if (!authToken) {
      setSaveError("Please login before deleting a listing.");
      return;
    }

    const shouldDelete = window.confirm("Delete this listing?");

    if (!shouldDelete) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/listings/${listingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete listing");
      }

      setListings((currentListings) =>
        currentListings.filter((listing) => listing.id !== listingId)
      );
      fetchSavedListings();
    } catch (err) {
      setSaveError("Could not delete listing");
    }
  }

  function findSavedListing(listingId) {
    return savedListings.find((savedListing) => savedListing.listing_id === listingId);
  }

  const visibleListings = currentUser
    ? listings.filter((listing) => Number(listing.user_id) === Number(currentUser.id))
    : listings;

  const authPage = (
    <main className="app-container auth-page">
      <section className="auth-hero">
        <p className="eyebrow">Rental Scout</p>
        <h1>Login</h1>
        <p className="auth-copy">
          Sign in to save favourites, send inquiries, and manage your rental listings.
        </p>
      </section>

      <section className="auth-panel auth-panel-single">
        <form onSubmit={handleLogin} className="auth-card">
          <h2>Login</h2>

          <label>Email</label>
          <input
            type="email"
            value={loginEmail}
            onChange={(event) => setLoginEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={loginPassword}
            onChange={(event) => setLoginPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />

          <button type="submit" className="auth-primary-btn">
            Login
          </button>

          <p className="auth-switch-text">If you are New User, then Signup</p>
          <Link className="auth-secondary-btn" to="/signup">
            Signup
          </Link>

          {loginError && <p className="error-msg">{loginError}</p>}
        </form>
      </section>
    </main>
  );

  const signupPage = (
    <main className="app-container auth-page">
      <section className="auth-hero">
        <p className="eyebrow">Rental Scout</p>
        <h1>Create account</h1>
        <p className="auth-copy">
          Create an account to save listings and send property inquiries.
        </p>
      </section>

      <section className="auth-panel auth-panel-single">
        <form onSubmit={handleSignup} className="auth-card">
          <h2>Signup</h2>

          <label>Name</label>
          <input
            type="text"
            value={signupName}
            onChange={(event) => setSignupName(event.target.value)}
            placeholder="Enter your name"
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={signupEmail}
            onChange={(event) => setSignupEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={signupPassword}
            onChange={(event) => setSignupPassword(event.target.value)}
            placeholder="Create a password"
            required
          />

          <button type="submit" className="auth-primary-btn">
            Create account
          </button>

          <Link className="auth-login-link" to="/auth">
            Already have an account? Login
          </Link>

          {signupMessage && <p className="success-msg">{signupMessage}</p>}
          {signupError && <p className="error-msg">{signupError}</p>}
        </form>
      </section>
    </main>
  );
return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <main className="app-container">
              <nav className="tab-navigation">
                <button
                  className={`tab-btn ${currentTab === "public" ? "active" : ""}`}
                  onClick={() => handleTabChange("public")}
                >
                  Listings
                </button>

                {currentUser && (
                  <button
                    className={`tab-btn ${currentTab === "addListing" ? "active" : ""}`}
                    onClick={() => handleTabChange("addListing")}
                  >
                    Add Listing
                  </button>
                )}

                <button
                  className={`tab-btn ${currentTab === "dashboard" ? "active" : ""}`}
                  onClick={() => handleTabChange("dashboard")}
                >
                  My Dashboard
                </button>

                <button
                  className={`tab-btn ${currentTab === "favorites" ? "active" : ""}`}
                  onClick={() => handleTabChange("favorites")}
                >
                  Favourites
                </button>

                {currentUser ? (
                  <button className="tab-btn logout-tab-btn" onClick={handleLogout}>
                    Logout
                  </button>
                ) : (
                  <Link className="tab-btn login-tab-link" to="/auth">
                    Login
                  </Link>
                )}
              </nav>

              {currentTab === "addListing" && currentUser && (
                <section className="add-listing-page">
                  <h2>Add New Listing</h2>
                  <p className="subtitle">Create a rental listing as {currentUser.name}.</p>

                  <form className="add-listing-form" onSubmit={handleAddListing}>
                    <label>Title</label>
                    <input
                      type="text"
                      value={newListingTitle}
                      onChange={(event) => setNewListingTitle(event.target.value)}
                      placeholder="Example: Sunny 2BHK Apartment"
                      required
                    />

                    <label>Location</label>
                    <input
                      type="text"
                      value={newListingLocation}
                      onChange={(event) => setNewListingLocation(event.target.value)}
                      placeholder="Example: Chennai"
                      required
                    />

                    <label>Budget</label>
                    <input
                      type="number"
                      value={newListingPrice}
                      onChange={(event) => setNewListingPrice(event.target.value)}
                      placeholder="Example: 22000"
                      required
                    />

                    <label>Bedrooms</label>
                    <input
                      type="number"
                      value={newListingBedrooms}
                      onChange={(event) => setNewListingBedrooms(event.target.value)}
                      placeholder="Example: 2"
                      required
                    />

                    <label>Bathrooms</label>
                    <input
                      type="number"
                      value={newListingBathrooms}
                      onChange={(event) => setNewListingBathrooms(event.target.value)}
                      placeholder="Example: 2"
                      required
                    />

                    <label>Status</label>
                    <select value={newListingStatus} onChange={(event) => setNewListingStatus(event.target.value)}>
                      <option value="available">available</option>
                      <option value="pending">pending</option>
                      <option value="rented">rented</option>
                    </select>

                    <button type="submit" className="auth-primary-btn" disabled={newListingLoading}>
                      {newListingLoading ? "Adding..." : "Add Listing"}
                    </button>

                    {newListingMessage && <p className="success-msg">{newListingMessage}</p>}
                    {newListingError && <p className="error-msg">{newListingError}</p>}
                  </form>
                </section>
              )}

              {currentTab === "public" && (
                <>
                  <h2>My Listings</h2>
                  <p className="subtitle">
                    Listings created by{" "}
                    <b>
                      {currentUser ? `${currentUser.name} (ID: ${currentUser.id})` : "Guest"}
                    </b>
                  </p>

                  {currentUser && visibleListings.length === 0 && (
                    <div className="empty-favorites">
                      <p>No listings created by this user yet.</p>
                    </div>
                  )}

                  <div className="listings-grid">
                    {visibleListings.map((listing) => {
                      const savedListing = findSavedListing(listing.id);

                      return (
                        <div key={listing.id} className="rental-card">
                          {listing.image_url && (
                            <img src={listing.image_url} alt={listing.title} className="card-thumb" />
                          )}

                          <div className="card-body">
                            <p className="card-location">{listing.location.toUpperCase()}</p>
                            <h3>{listing.title}</h3>
                            <p className="meta-price">Rs. {listing.price} / month</p>

                            {savedListing ? (
                              <button
                                className="btn-card-save btn-card-unsave"
                                onClick={() => handleUnsaveListing(savedListing.id)}
                              >
                                Unsave
                              </button>
                            ) : (
                              <button className="btn-card-save" onClick={() => handleSaveListing(listing.id)}>
                                Save
                              </button>
                            )}

                            <Link className="btn-card-details" to={`/listings/${listing.id}`}>
                              View details
                            </Link>

                            {currentUser && (
                              <div className="card-actions">
                                <Link className="btn-card-edit" to={`/listings/${listing.id}/edit`}>
                                  Edit
                                </Link>
                                <button
                                  type="button"
                                  className="btn-card-delete"
                                  onClick={() => handleDeleteListing(listing.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {currentTab === "dashboard" && (
                <div className="dashboard-page">
                  {currentUser ? (
                    <>
                      <div className="dashboard-header">
                        <div>
                          <p className="dashboard-kicker">Listing Manager</p>
                          <h1>Private Saved Listings</h1>
                        </div>
                      </div>

                      <section className="dashboard-card">
                        <h2>Auth state</h2>
                        <p>Current user: {currentUser.email}</p>
                        <p className="dashboard-success">Login successful</p>
                      </section>

                      <section className="dashboard-card">
                        <h2>Public listings preview</h2>
                        <p>Your private listing summary is shown here while the dashboard keeps the editing tools.</p>

                        <div className="dashboard-stats">
                          <span className="stat stat-total">Total {visibleListings.length}</span>
                          <span className="stat stat-available">
                            Available {visibleListings.filter((listing) => listing.status === "available").length}
                          </span>
                          <span className="stat stat-pending">
                            Pending {visibleListings.filter((listing) => listing.status === "pending").length}
                          </span>
                          <span className="stat stat-rented">
                            Rented {visibleListings.filter((listing) => listing.status === "rented").length}
                          </span>
                        </div>
                      </section>

                      <section className="dashboard-card">
                        <h2>Received Inquiries</h2>

                        {vendorInquiriesLoading && <p>Loading received inquiries...</p>}
                        {vendorInquiriesError && <p className="error-msg">{vendorInquiriesError}</p>}

                        {!vendorInquiriesLoading && vendorInquiries.length === 0 && (
                          <p>No inquiries received yet.</p>
                        )}

                        <div className="vendor-inquiry-list">
                          {vendorInquiries.map((inquiry) => (
                            <article key={inquiry.id} className="vendor-inquiry-card">
                              <h3>{inquiry.listing_title}</h3>
                              <p><b>From:</b> {inquiry.sender_name} ({inquiry.sender_email})</p>
                              <pre>{inquiry.message}</pre>
                            </article>
                          ))}
                        </div>
                      </section>
                    </>
                  ) : (
                    <section className="dashboard-card empty-dashboard">
                      <h2>Dashboard</h2>
                      <p>Please login to view your dashboard.</p>
                    </section>
                  )}
                </div>
              )}

              {currentTab === "favorites" && (
                <div className="dashboard-view">
                  <h2>Your Favourite Properties</h2>

                  {!currentUser ? (
                    <div className="empty-favorites">
                      <p>Please login to view your favourite properties.</p>
                    </div>
                  ) : (
                    <>
                      {savedLoading && <p className="status-text">Loading favourites...</p>}
                      {savedError && <p className="status-text error">{savedError}</p>}

                      {!savedLoading && savedListings.length === 0 && (
                        <div className="empty-favorites">
                          <p>No favourite properties saved yet.</p>
                        </div>
                      )}

                      <div className="listings-grid">
                        {savedListings.map((fav) => (
                          <div key={fav.id} className="rental-card favorite-card">
                            {fav.image_url && (
                              <img src={fav.image_url} alt={fav.title} className="card-thumb" />
                            )}

                            <div className="card-body">
                              <p className="card-location">{fav.location.toUpperCase()}</p>
                              <h3>{fav.title}</h3>
                              <p className="meta-price">Rs. {fav.price} / month</p>

                              <Link className="btn-card-details" to={`/listings/${fav.listing_id}`}>
                                View details
                              </Link>

                              <button className="btn-danger" onClick={() => handleUnsaveListing(fav.id)}>
                                Unsave
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </main>
          }
        />

        <Route path="/auth" element={authPage} />
        <Route path="/signup" element={signupPage} />
        <Route path="/listings/:id/edit" element={<EditListingPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage currentUser={currentUser} />} />      </Routes>
    </BrowserRouter>
  );
}


function EditListingPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [status, setStatus] = useState("available");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchListing() {
      try {
        const response = await fetch(`http://localhost:4000/api/listings/${id}`);

        if (!response.ok) {
          throw new Error("Listing not found");
        }

        const data = await response.json();

        setListing(data);
        setTitle(data.title);
        setLocation(data.location);
        setPrice(data.price);
        setBedrooms(data.bedrooms);
        setBathrooms(data.bathrooms);
        setStatus(data.status || "available");
      } catch (err) {
        setError("Could not load listing");
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [id]);

  async function handleUpdateListing(event) {
    event.preventDefault();

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setError("Please login before updating a listing.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`http://localhost:4000/api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title,
          location,
          price: Number(price),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          status
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update listing");
      }

      setListing(data);
      setSuccess("Listing updated successfully!");

      setTimeout(() => {
        window.location.href = "/";
      }, 700);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <main className="app-container">
        <p>Loading listing editor...</p>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="app-container">
        <p>{error}</p>
        <Link to="/">Back to listings</Link>
      </main>
    );
  }

  return (
    <main className="app-container">
      <Link to="/" className="back-link">Back to listings</Link>

      <section className="edit-listing-page">
        <h1>Edit Listing</h1>
        <p className="subtitle">{listing.title}</p>

        <form className="edit-listing-form" onSubmit={handleUpdateListing}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            required
          />

          <label>Budget</label>
          <input
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />

          <label>Bedrooms</label>
          <input
            type="number"
            value={bedrooms}
            onChange={(event) => setBedrooms(event.target.value)}
            required
          />

          <label>Bathrooms</label>
          <input
            type="number"
            value={bathrooms}
            onChange={(event) => setBathrooms(event.target.value)}
            required
          />

          <label>Status</label>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="available">available</option>
            <option value="pending">pending</option>
            <option value="rented">rented</option>
          </select>

          <button type="submit" className="auth-primary-btn">
            Update Listing
          </button>

          {success && <p className="success-msg">{success}</p>}
          {error && <p className="error-msg">{error}</p>}
        </form>
      </section>
    </main>
  );
}

function ListingDetailPage({ currentUser }) { 
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryContact, setInquiryContact] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState("");
  const [inquiryError, setInquiryError] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        const response = await fetch(`http://localhost:4000/api/listings/${id}`);

        if (!response.ok) {
          throw new Error("Listing not found");
        }

        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError("Could not load listing details");
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [id]);

  async function handleDetailInquirySubmit(event) {
    event.preventDefault();

    if (inquiryName.trim() === "" || inquiryContact.trim() === "" || inquiryMessage.trim() === "") {
      setInquirySuccess("");
      setInquiryError("Name, email/phone, and message are required.");
      return;
    }

    try {
      setInquiryLoading(true);
      setInquirySuccess("");
      setInquiryError("");

      const response = await fetch("http://localhost:4000/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          listing_id: listing.id,
          message: `Name: ${inquiryName}\nContact: ${inquiryContact}\nMessage: ${inquiryMessage}`
        })
      });

      if (!response.ok) {
        throw new Error("Failed to send inquiry");
      }

      setInquirySuccess("Inquiry sent successfully!");
      setInquiryName("");
      setInquiryContact("");
      setInquiryMessage("");
    } catch (err) {
      setInquiryError("Could not send inquiry");
    } finally {
      setInquiryLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="app-container">
        <p>Loading listing details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-container">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="app-container">
      <Link to="/" className="back-link">Back to listings</Link>

      <section className="detail-layout">
        <article className="full-detail-page">
          {listing.image_url && (
            <img src={listing.image_url} alt={listing.title} className="full-detail-img" />
          )}

          <h1>{listing.title}</h1>
          <p><b>Location:</b> {listing.location}</p>
          <p><b>Budget:</b> Rs. {listing.price}</p>
          <p><b>Bedrooms:</b> {listing.bedrooms} BHK</p>
          <p><b>Bathrooms:</b> {listing.bathrooms}</p>
          <p><b>Status:</b> {listing.status}</p>
          <p>{listing.description}</p>

  {!currentUser && (
    <button
      type="button"
      className="detail-inquiry-toggle"
      onClick={() => {
      setShowInquiryForm(true);
      setInquirySuccess("");
      setInquiryError("");
    }}
  >
    Send an Inquiry
    </button>
)}
  </article>

        {!currentUser && showInquiryForm && (
          <aside className="detail-inquiry-panel">
            <form className="detail-inquiry-form" onSubmit={handleDetailInquirySubmit}>


              <label>Name</label>
              <input
                type="text"
                value={inquiryName}
                onChange={(event) => setInquiryName(event.target.value)}
                placeholder="Your name"
              />

              <label>Email / Phone no</label>
              <input
                type="text"
                value={inquiryContact}
                onChange={(event) => setInquiryContact(event.target.value)}
                placeholder="Email or phone number"
              />

              <label>Message</label>
              <textarea
                rows="6"
                value={inquiryMessage}
                onChange={(event) => setInquiryMessage(event.target.value)}
                placeholder="Ask about availability, rent, or amenities..."
              />

              <button type="submit" className="btn-send" disabled={inquiryLoading}>
                {inquiryLoading ? "Submitting..." : "Submit"}
              </button>

              {inquirySuccess && <p className="success-msg">{inquirySuccess}</p>}
              {inquiryError && <p className="error-msg">{inquiryError}</p>}
            </form>
          </aside>
        )}
      </section>
    </main>
  );
}

export default App;



















