import { useState } from "react";
import "./AddCrop.css";

function AddCrop({ onAddCrop, onCancel }) {
  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    price: "",
    location: "",
    farmerPhone: "",
    harvestDate: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddCrop({
      ...formData,
      id: Date.now()
    });

    alert("Crop added successfully!");
  };

  return (
    <div className="add-crop-container">
      <form className="crop-form" onSubmit={handleSubmit}>
        <h1>🌾 Add Your Crop</h1>
        <p>Enter your crop details below.</p>

        <label>Crop Name</label>
        <select
          name="cropName"
          value={formData.cropName}
          onChange={handleChange}
          required
        >
          <option value="">Select Crop</option>
          <option value="Wheat">Wheat</option>
          <option value="Rice">Rice</option>
          <option value="Potato">Potato</option>
          <option value="Tomato">Tomato</option>
          <option value="Mustard">Mustard</option>
          <option value="Other">Other</option>
        </select>

        <label>Quantity (Quintal)</label>
        <input
          type="number"
          name="quantity"
          placeholder="Enter quantity"
          min="1"
          value={formData.quantity}
          onChange={handleChange}
          required
        />

        <label>Expected Price (₹ per quintal)</label>
        <input
          type="number"
          name="price"
          placeholder="Enter expected price"
          min="1"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          placeholder="Enter your village or city"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label>Farmer Mobile Number</label>

        <input
          type="tel"
          name="farmerPhone"
          placeholder="Enter 10 digit mobile number"
          value={formData.farmerPhone}
          onChange={handleChange}
          pattern="[6-9][0-9]{9}"
          maxLength="10"
          required
        />


        <label>Harvest Date</label>
        <input
          type="date"
          name="harvestDate"
          value={formData.harvestDate}
          onChange={handleChange}
          required
        />

        <div className="crop-form-buttons">
          <button type="submit">Add Crop</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCrop;