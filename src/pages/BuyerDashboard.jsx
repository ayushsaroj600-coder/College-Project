
import { useState } from "react";
import "./BuyerDashboard.css";

function BuyerDashboard({
  onBack,
  crops = [],
  requests = [],
  onCreateRequest
}) {
  const [quantities, setQuantities] = useState({});

  // Contact Farmer
 const handleContact = (crop) => {
  if (!crop.farmerPhone) {
    alert("Farmer contact number is not available!");
    return;
  }

  window.location.href = `tel:${crop.farmerPhone}`;
};

  // Purchase Request
  const handlePurchaseRequest = (crop) => {
    const requestedQuantity = Number(quantities[crop.id]);

    if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
      alert("Please enter a valid  Whole quantity!");
      return;
    }

    if (requestedQuantity > Number(crop.quantity)) {
      alert("Requested quantity is more than available quantity!");
      return;
    }

    const newRequest = {
      id: Date.now(),
      cropId: crop.id,
      cropName: crop.cropName,
      requestedQuantity: requestedQuantity,
      price: crop.price,
      location: crop.location,
        farmerId: crop.farmerId,
      buyerName: "Demo Buyer",
      status: "Pending"
    };

    onCreateRequest(newRequest);

    alert("Purchase request sent successfully!");

    setQuantities((previous) => ({
      ...previous,
      [crop.id]: ""
    }));
  };

  return (
    <div className="buyer-dashboard">

      <nav className="buyer-navbar">
        <h2>🌾 FasalMitra</h2>
        <button onClick={onBack}>Back</button>
      </nav>

      <div className="buyer-welcome">
        <h1>Welcome, Buyer!</h1>
        <p>Find quality crops directly from farmers.</p>
      </div>

      <div className="buyer-stats">

        <div className="buyer-stat-card">
          <h2>{crops.length}</h2>
          <p>Available Crops</p>
        </div>

        <div className="buyer-stat-card">
          <h2>
            {new Set(crops.map((crop) => crop.location)).size}
          </h2>
          <p>Locations</p>
        </div>

      </div>

      <h2 className="crop-heading">Available Crops</h2>

      <div className="buyer-crop-list">

        {crops.length === 0 ? (
          <p>No crops are currently available.</p>
        ) : (

          crops.map((crop) => (
            <div className="buyer-crop-card" key={crop.id}>

              <h2>🌾 {crop.cropName}</h2>

              <p>Quantity: {crop.quantity} Quintal</p>

              <p>Expected Price: ₹{crop.price}/Quintal</p>

              <p>Location: {crop.location}</p>
              <p>Farmer Contact:{crop.farmerPhone}</p>

              <button
                onClick={() => handleContact(crop)}
              >
                Contact Farmer
              </button>

              <div className="purchase-request-form">

                <label>Required Quantity (Quintal)</label>

                <input
                  type="number"
                  min="1"
                  max={crop.quantity}
                  placeholder="Enter quantity"
                  value={quantities[crop.id] || ""}
                  onChange={(e) =>
                    setQuantities((previous) => ({
                      ...previous,
                      [crop.id]: e.target.value
                    }))
                  }
                />

                <button
                  onClick={() => handlePurchaseRequest(crop)}
                >
                  Send Purchase Request
                </button>


                {/* My Purchase Requests */}

                <div className="my-requests-section">

                  <h2>My Purchase Requests 📋</h2>

                  {requests.length === 0 ? (
                    <p>You have not sent any purchase requests yet.</p>
                  ) : (

                    requests.map((request) => (

                      <div className="my-request-card" key={request.id}>

                        <h3>{request.cropName}</h3>

                        <p>
                          Requested Quantity: {request.requestedQuantity} Quintal
                        </p>

                        <p>
                          Expected Price: ₹{request.price}/Quintal
                        </p>

                        <p>Location: {request.location}</p>

                        <p>
                          Request Status:{" "}
                          <strong className={`status-${request.status.toLowerCase()}`}>
                            {request.status}
                          </strong>
                        </p>

                      </div>

                    ))

                  )}

                </div>

              </div>

            </div>
          ))

        )}

      </div>

    </div>
  );
}

export default BuyerDashboard;
