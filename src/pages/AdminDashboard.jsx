
import "./AdminDashboard.css";

function AdminDashboard({ 
  onBack, 
  crops = [], 
  requests = [] ,
  onDeleteCrop
}) 
{
  const totalCrops = crops.length;

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const acceptedRequests = requests.filter(
    (request) => request.status === "Accepted"
  ).length;



  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <h2>🌱 FasalMitra Admin</h2>
        <button onClick={onBack}>Back</button>
      </nav>

      <div className="admin-content">
        <h1>Welcome, Admin!</h1>
        <p>Manage FasalMitra platform activities.</p>

        <div className="admin-cards">
          <div className="admin-card">
            <h2>🌾</h2>
            <h3>Total Crops</h3>
            <p>{totalCrops}</p>
          </div>

          <div className="admin-card">
            <h2>📋</h2>
            <h3>Total Requests</h3>
            <p>{totalRequests}</p>
          </div>

          <div className="admin-card">
            <h2>⏳</h2>
            <h3>Pending Requests</h3>
            <p>{pendingRequests}</p>
          </div>

          <div className="admin-card">
            <h2>✅</h2>
            <h3>Accepted Requests</h3>
            <p>{acceptedRequests}</p>
          </div>
          <div className="admin-card">
            <h2>👨‍🌾</h2>
            <h3>Manage Farmers</h3>
            <p>View farmer information.</p>
          </div>

          <div className="admin-card">
            <h2>🛒</h2>
            <h3>Manage Buyers</h3>
            <p>View buyer information.</p>
          </div>

          <div className="admin-card">
            <h2>🌾</h2>
            <h3>Manage Crops</h3>
            <p>Total Listed Crops:{totalCrops} </p>
          </div>

          <div className="manage-crops-section">
  <h2>All Crop Listings</h2>

  {crops.length === 0 ? (
    <p>No crops available.</p>
  ) : (
    crops.map((crop) => (
      <div className="admin-crop-item" key={crop.id}>
        <div>
          <h3>{crop.cropName}</h3>
          <p>Quantity: {crop.quantity}</p>
          <p>Price: ₹{crop.price}</p>
          <p>Location: {crop.location}</p>
        </div>

        <button
          onClick={() => onDeleteCrop(crop.id)}
        >
          Delete
        </button>
      </div>
    ))
  )}
</div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
