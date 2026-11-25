
import { useState } from "react";
import AddCrop from "./AddCrop";
import "./FarmerDashboard.css";
import PriceComparison from "./PriceComparison";

function FarmerDashboard({
  onBack,
  crops = [],
  onAddCrop,
  requests = [],
  onUpdateRequest

}) {
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showPriceComparison, setShowPriceComparison] = useState(false);

  const mandiPrices = [
    { crop: "Wheat", market: "Lucknow Mandi", price: 2425 },
    { crop: "Rice", market: "Kanpur Mandi", price: 3100 },
    { crop: "Potato", market: "Agra Mandi", price: 1800 }
  ];

  const handleAddCrop = (newCrop) => {
    onAddCrop(newCrop);
    setShowAddCrop(false);
  };

  if (showAddCrop) {
    return (
      <AddCrop
        onAddCrop={handleAddCrop}
        onCancel={() => setShowAddCrop(false)}
      />
    );
  }

  if (showPriceComparison) {
    return (
      <div>
        <button onClick={() => setShowPriceComparison(false)}>
          ← Back to Dashboard
        </button>
        <PriceComparison />
      </div>
    );
  }

  return (
    <div className="farmer-dashboard">

      <nav className="dashboard-navbar">
        <h2>🌱 FasalMitra</h2>
        <button onClick={onBack}>← Back</button>
      </nav>

      <div className="dashboard-welcome">
        <h1>Welcome, Farmer! 🌾</h1>
        <p>Manage your crops and find better market opportunities.</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>My Crops</h3>
          <h2>{crops.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Available Buyers</h3>
          <h2>12</h2>
        </div>

        <div className="stat-card">
          <h3>Market Updates</h3>
          <h2>08</h2>
        </div>
      </div>

      <div className="dashboard-actions">
        <h2>Quick Actions</h2>

        <button onClick={() => setShowPriceComparison(true)}>
          📊 Compare Mandi Prices
        </button>

        <button onClick={() => setShowAddCrop(true)}>
          ➕ Add New Crop
        </button>

        <button onClick={() => alert("Buyer marketplace coming soon!")}>
          🛒 Find Buyers
        </button>
      </div>

      <div className="mandi-section">
        <h2>My Crop Listings</h2>
        {crops.length === 0 ? (
          <p>No crops added yet. Click Add New Crop to get started.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Available Stock</th>
                <th>Expected Price</th>
                <th>Location</th>
                
              </tr>
            </thead>

            <tbody>
              {crops.map((crop) => (
                <tr key={crop.id}>
                  <td>{crop.cropName}</td>
                  <td>{crop.quantity} Quintal</td>
                  <td>₹{crop.price} Quintal</td>
                  <td>{crop.location}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mandi-section">
        <h2>Incoming Purchase Requests 🤝</h2>

        {requests.length === 0 ? (
          <p>No purchase requests received yet.</p>
        ) : (
          <div className="incoming-requests">
            {requests.map((request) => (
              <div className="request-card" key={request.id}>
                <h3>{request.cropName}</h3>
                <p>Buyer: {request.buyerName}</p>
                <p>Requested Quantity: {request.requestedQuantity} Quintal</p>
                <p>Expected Price: ₹{request.price}/Quintal</p>
                <p>Location: {request.location}</p>
                <p>
                  Status: <strong>{request.status}</strong>
                </p>

                {request.status === "Pending" && (
                  <div className="request-actions">
                    <button
                      onClick={() => onUpdateRequest(request.id, "Accepted")}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onUpdateRequest(request.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

  );
}

export default FarmerDashboard;
