import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:4000/api";
const LISTINGS_API_URL = `${API_BASE_URL}/listings`;

const emptyListingForm = {
  title: "",
  city: "",
  price: "",
  status: "available",
};

const emptyAuthForm = {
  name: "",
  email: "",
  password: "",
};

const savedSession = JSON.parse(localStorage.getItem("authSession")) || null;
const savedUser = savedSession?.user || null;
const savedToken = savedSession?.token || "";

function getAuthHeaders(authToken) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };
}

function App() {
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState(emptyListingForm);
  const [authFormData, setAuthFormData] = useState(emptyAuthForm);
  const [authMode, setAuthMode] = useState("signup");
  const [currentUser, setCurrentUser] = useState(savedUser);
  const [authToken, setAuthToken] = useState(savedToken);
  const [activePage, setActivePage] = useState(savedUser ? "dashboard" : "public");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccessMessage, setAuthSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const listingCounts = {
    total: listings.length,
    available: listings.filter((listing) => listing.status === "available").length,
    pending: listings.filter((listing) => listing.status === "pending").length,
    rented: listings.filter((listing) => listing.status === "rented").length,
  };

  function resetForm() {
    setFormData(emptyListingForm);
    setEditingId(null);
  }

  async function loadListings() {
    if (!currentUser || !authToken) {
      setListings([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(LISTINGS_API_URL, {
        headers: getAuthHeaders(authToken),
      });

      if (!response.ok) {
        throw new Error("Could not load listings");
      }

      const data = await response.json();
      setListings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, [currentUser, authToken]);

  useEffect(() => {
    if ((!currentUser || !authToken) && activePage === "dashboard") {
      setActivePage("public");
      setAuthMode("login");
      setAuthError("Please log in to open your private dashboard.");
    }
  }, [activePage, currentUser, authToken]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function handleAuthChange(event) {
    const { name, value } = event.target;

    setAuthFormData((currentAuthFormData) => ({
      ...currentAuthFormData,
      [name]: value,
    }));
  }

  function switchAuthMode(nextMode) {
    setAuthMode(nextMode);
    setAuthError("");
    setAuthSuccessMessage("");
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();

    try {
      setIsAuthSubmitting(true);
      setAuthError("");
      setAuthSuccessMessage("");

      const endpoint =
        authMode === "signup"
          ? `${API_BASE_URL}/auth/signup`
          : `${API_BASE_URL}/auth/login`;

      const body =
        authMode === "signup"
          ? authFormData
          : {
              email: authFormData.email,
              password: authFormData.password,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Auth request failed");
      }

      const nextSession = {
        token: data.token,
        user: data.user,
      };

      setCurrentUser(data.user);
      setAuthToken(data.token);
      localStorage.setItem("authSession", JSON.stringify(nextSession));
      localStorage.removeItem("currentUser");
      setActivePage("dashboard");
      setAuthSuccessMessage(data.message);
      setAuthFormData(emptyAuthForm);
    } catch (err) {
      setCurrentUser(null);
      setAuthToken("");
      localStorage.removeItem("authSession");
      localStorage.removeItem("currentUser");
      setAuthError(err.message);
    } finally {
      setIsAuthSubmitting(false);
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    setAuthToken("");
    localStorage.removeItem("authSession");
    localStorage.removeItem("currentUser");
    setActivePage("public");
    setAuthMode("login");
    setAuthSuccessMessage("Logged out successfully");
    setAuthError("");
    resetForm();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (!currentUser || !authToken) {
        throw new Error("Please log in before saving listings");
      }

      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      const url = editingId
        ? `${LISTINGS_API_URL}/${editingId}`
        : LISTINGS_API_URL;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(authToken),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create listing");
      }

      await loadListings();
      setSuccessMessage(
        editingId ? `${data.title} was updated` : `${data.title} was added`
      );
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(listing) {
    setEditingId(listing.id);
    setSuccessMessage("");
    setError("");
    setFormData({
      title: listing.title,
      city: listing.city,
      price: String(listing.price),
      status: listing.status,
    });
  }

  function cancelEditing() {
    setSuccessMessage("");
    setError("");
    resetForm();
  }

  async function deleteListing(listing) {
    if (!currentUser || !authToken) {
      setError("Please log in before deleting listings");
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${listing.title}" from the database?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const response = await fetch(`${LISTINGS_API_URL}/${listing.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(authToken),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete listing");
      }

      if (editingId === listing.id) {
        cancelEditing();
      }

      await loadListings();
      setSuccessMessage(`${listing.title} was deleted`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app-shell">
      <section className="page-header">
        <div>
          <p>Listing Manager</p>
          <h1>Private Saved Listings</h1>
        </div>

        <nav className="app-nav" aria-label="Primary navigation">
          <button
            className={activePage === "public" ? "" : "ghost-button"}
            type="button"
            onClick={() => setActivePage("public")}
          >
            Public
          </button>
          <button
            className={activePage === "dashboard" ? "" : "ghost-button"}
            type="button"
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>
          {currentUser && (
            <button className="ghost-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </section>

      <section className="auth-panel">
        <div className="panel-heading">
          <div>
            <h2>{currentUser ? "Auth state" : "Login or sign up"}</h2>
            {currentUser && (
              <p className="muted">Current user: {currentUser.email}</p>
            )}
          </div>

          {!currentUser && (
            <div className="mode-switch">
              <button
                className={authMode === "signup" ? "" : "ghost-button"}
                type="button"
                onClick={() => switchAuthMode("signup")}
              >
                Sign up
              </button>
              <button
                className={authMode === "login" ? "" : "ghost-button"}
                type="button"
                onClick={() => switchAuthMode("login")}
              >
                Login
              </button>
            </div>
          )}
        </div>

        {!currentUser && (
          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authMode === "signup" && (
              <label>
                Name
                <input
                  name="name"
                  value={authFormData.name}
                  onChange={handleAuthChange}
                  placeholder="Demo User"
                />
              </label>
            )}

            <label>
              Email
              <input
                name="email"
                type="email"
                value={authFormData.email}
                onChange={handleAuthChange}
                placeholder="demo@example.com"
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                value={authFormData.password}
                onChange={handleAuthChange}
                placeholder="secret123"
              />
            </label>

            <button disabled={isAuthSubmitting}>
              {isAuthSubmitting
                ? "Checking..."
                : authMode === "signup"
                  ? "Create account"
                  : "Login"}
            </button>
          </form>
        )}

        {authSuccessMessage && <p className="success">{authSuccessMessage}</p>}
        {authError && <p className="error">{authError}</p>}
      </section>

      {activePage === "public" && (
        <section className="public-panel">
          <h2>Public listings preview</h2>
          {currentUser ? (
            <>
              <p className="muted">
                Your private listing summary is shown here while the dashboard
                keeps the editing tools.
              </p>
              <div className="count-row" aria-label="Private listing summary">
                <span className="count-pill">Total {listingCounts.total}</span>
                <span className="count-pill status-available">
                  Available {listingCounts.available}
                </span>
                <span className="count-pill status-pending">
                  Pending {listingCounts.pending}
                </span>
                <span className="count-pill status-rented">
                  Rented {listingCounts.rented}
                </span>
              </div>
            </>
          ) : (
            <p className="muted">
              This page stays open for everyone. Log in to open the private
              dashboard where listing tools are available.
            </p>
          )}
        </section>
      )}

      {currentUser && activePage === "dashboard" && (
        <section className="workspace">
        <form className="listing-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <h2>{editingId ? "Edit listing" : "New listing"}</h2>
            {editingId && (
              <button
                className="ghost-button"
                type="button"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            )}
          </div>

          <label>
            Title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Sunny 1BHK Apartment"
            />
          </label>

          <label>
            City
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Chennai"
            />
          </label>

          <label>
            Price
            <input
              name="price"
              type="number"
              min="1"
              value={formData.price}
              onChange={handleChange}
              placeholder="20000"
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="available">available</option>
              <option value="pending">pending</option>
              <option value="rented">rented</option>
            </select>
          </label>

          <button disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : editingId
                ? "Update listing"
                : "Save listing"}
          </button>

          {successMessage && <p className="success">{successMessage}</p>}
          {error && <p className="error">{error}</p>}
        </form>

        <section className="listings-panel">
          <div className="panel-heading">
            <h2>My saved listings</h2>
            <span>{listings.length} records</span>
          </div>

          {isLoading && <p className="muted">Loading listings...</p>}

          {!isLoading && listings.length === 0 && (
            <div className="empty-state">
              <h3>No private listings yet</h3>
              <p>Add your first saved listing with the form on the left.</p>
            </div>
          )}

          {!isLoading && listings.length > 0 && (
            <div className="records-table">
              <div className="record-row record-header">
                <span>ID</span>
                <span>User</span>
                <span>Title</span>
                <span>City</span>
                <span>Price</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {listings.map((listing) => (
                <div className="record-row" key={listing.id}>
                  <span>{listing.id}</span>
                  <span>{listing.user_id}</span>
                  <strong>{listing.title}</strong>
                  <span>{listing.city}</span>
                  <span>Rs. {listing.price}</span>
                  <span className={`status-pill status-${listing.status}`}>
                    {listing.status}
                  </span>
                  <div className="listing-actions">
                    <button type="button" onClick={() => startEditing(listing)}>
                      Edit
                    </button>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => deleteListing(listing)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        </section>
      )}
    </main>
  );
}

export default App;
