import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_URL = "http://localhost:4000/api/listings";

const emptyListingForm = {
  title: "",
  city: "",
  price: "",
  status: "available",
};

function App() {
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState(emptyListingForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  function resetForm() {
    setFormData(emptyListingForm);
    setEditingId(null);
  }

  async function loadListings() {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(API_URL);

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
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
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
    const shouldDelete = window.confirm(
      `Delete "${listing.title}" from the database?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const response = await fetch(`${API_URL}/${listing.id}`, {
        method: "DELETE",
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
        <p>Listing Manager</p>
        <h1>Admin records</h1>
      </section>

      <section className="workspace">
        <form className="listing-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <h2>{editingId ? "Edit listing" : "New listing"}</h2>
            {editingId && (
              <button className="ghost-button" type="button" onClick={cancelEditing}>
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
            <h2>Saved listings</h2>
            <span>{listings.length} records</span>
          </div>

          {isLoading && <p className="muted">Loading listings...</p>}

          {!isLoading && listings.length === 0 && (
            <div className="empty-state">
              <h3>No listings yet</h3>
              <p>Add the first listing with the form on the left.</p>
            </div>
          )}

          {!isLoading && listings.length > 0 && (
            <div className="records-table">
              <div className="record-row record-header">
                <span>ID</span>
                <span>Title</span>
                <span>City</span>
                <span>Price</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {listings.map((listing) => (
                <div className="record-row" key={listing.id}>
                  <span>{listing.id}</span>
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
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
