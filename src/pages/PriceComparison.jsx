
import { useState } from "react";
import "./PriceComparison.css";

function PriceComparison() {
  const [selectedCrop, setSelectedCrop] = useState("Wheat");

  // Demo data: real-time mandi prices nahi hain
  const mandiData = [
    {
      mandi: "Lucknow Mandi",
      crop: "Wheat",
      price: 2400,
      transport: 100
    },
    {
      mandi: "Kanpur Mandi",
      crop: "Wheat",
      price: 2550,
      transport: 200
    },
    {
      mandi: "Sitapur Mandi",
      crop: "Wheat",
      price: 2500,
      transport: 80
    },
    {
      mandi: "Lucknow Mandi",
      crop: "Rice",
      price: 3200,
      transport: 100
    },
    {
      mandi: "Kanpur Mandi",
      crop: "Rice",
      price: 3300,
      transport: 200
    }
  ];

  const filteredData = mandiData
    .filter((item) => item.crop === selectedCrop)
    .map((item) => ({
      ...item,
      netPrice: item.price - item.transport
    }))
    .sort((a, b) => b.netPrice - a.netPrice);

  return (
    <div className="price-page">
      <h1>📊 Mandi Price Comparison</h1>
      <p>Compare mandi prices and find the best option.</p>

      <label>Select Crop</label>

      <select
        value={selectedCrop}
        onChange={(e) => setSelectedCrop(e.target.value)}
      >
        <option value="Wheat">Wheat</option>
        <option value="Rice">Rice</option>
      </select>

      <h2>Available Mandi Prices</h2>

      <div className="price-table">
        <table>
          <thead>
            <tr>
              <th>Mandi</th>
              <th>Market Price</th>
              <th>Transport Cost</th>
              <th>Net Price</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.mandi}</td>
                <td>₹{item.price}</td>
                <td>₹{item.transport}</td>
                <td>₹{item.netPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length > 0 && (
        <div className="best-mandi">
          <h3>🏆 Best Mandi Recommendation</h3>
          <h2>{filteredData[0].mandi}</h2>
          <p>
            Expected net price: ₹{filteredData[0].netPrice}
            {" "}per quintal
          </p>
        </div>
      )}

      <p className="demo-note">
        Note: These are sample demo prices, not live market rates.
      </p>
    </div>
  );
}

export default PriceComparison;
