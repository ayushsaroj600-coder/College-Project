import {
  listenToCrops,
  addCropToFirestore,
  deleteCrop
} from "./services/cropService";

import RoleSelection from "./pages/RoleSelection";
import FarmerDashboard from "./pages/FarmerDashboard";
import './App.css'

import Login from './pages/Login'
import { useState, useEffect } from 'react'
import BuyerDashboard from "./pages/BuyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./services/firebase";
import { doc, getDoc } from "firebase/firestore";
//import { db } from "./services/firebase";
//import { listenToCrops, addCropToFirestore } from "./services/cropService";



function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [crops, setCrops] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);


      if (user) {
        setShowLogin(false);

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }

          else {
            setUserProfile(null);
          }
        }
        catch (error) {
          console.error("Profile fetch error:", error);
          setUserProfile(null);
        }
      }
      else {
        setUserProfile(null);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (!currentUser) {
      setRequests([]);
      return;
    }

    const unsubscribe = listenToRequests(
      (requestList) => {
        setRequests(requestList);
      },
      (error) => {
        console.error("Failed to load requests:", error);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);




  useEffect(() => {
    if (!currentUser) {
      setCrops([]);
      return;
    }

    const unsubscribe = listenToCrops(
      (cropList) => {
        setCrops(cropList);
      },
      (error) => {
        console.error("Failed to load crops:", error);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);



  const handleLogout = async () => {
    try {
      await signOut(auth);

      setSelectedRole("");
      setShowRole(false);
      setShowLogin(false);

      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };


  // Update Purchase Request and Crop Stock
  const handleUpdateRequest = (requestId, newStatus) => {

    const request = requests.find(
      (item) => item.id === requestId
    );

    // Check request exists and is still pending
    if (!request || request.status !== "Pending") {
      return;
    }

    // Reduce stock only when farmer accepts
    if (newStatus === "Accepted") {

      const crop = crops.find(
        (item) => item.id === request.cropId
      );

      if (!crop) {
        alert("Crop not found!");
        return;
      }

      const availableQuantity = Number(crop.quantity);
      const requestedQuantity = Number(request.requestedQuantity);

      if (requestedQuantity > availableQuantity) {
        alert("Not enough crop stock available!");
        return;
      }

      // Update remaining crop quantity
      setCrops((previousCrops) =>
        previousCrops.map((item) =>
          item.id === request.cropId
            ? {
              ...item,
              quantity:
                Number(item.quantity) - requestedQuantity
            }
            : item
        )
      );
    }

    // Update request status
    setRequests((previousRequests) =>
      previousRequests.map((item) =>
        item.id === requestId
          ? { ...item, status: newStatus }
          : item
      )
    );

    alert(`Request ${newStatus} successfully!`);
  };


  // Admin: Delete Crop
  const handleDeleteCrop = (cropId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this crop?"
    );

    if (!confirmDelete) return;

    setCrops((previousCrops) =>
      previousCrops.filter((crop) => crop.id !== cropId)
    );

    alert("Crop deleted successfully!");
  };


  if (authLoading) {
    return (
      <div className="app">
        <h2>🌱 Loading FasalMitra...</h2>
      </div>
    );
  }


  // Login Page
  if (showLogin) {
    return (
      <div>
        <button onClick={() => setShowLogin(false)}>
          ← Back to Home
        </button>

        <Login />
      </div>
    );
  }

  // Farmer Dashboard
  if (selectedRole === "farmer") {
    return (
      <FarmerDashboard
        crops={crops}
        requests={requests}
        onUpdateRequest={handleUpdateRequest}
        onAddCrop={(newCrop) => {
          setCrops((previousCrops) => [
            ...previousCrops,
            newCrop
          ]);
        }}
        onBack={() => {
          setSelectedRole("");
          setShowRole(true);
        }}
      />
    );
  }


  // Buyer Dashboard
  if (selectedRole === "buyer") {
    return (
      <BuyerDashboard
        crops={crops}
        requests={requests}
        onCreateRequest={async (crop, quantity) => {
          try {
            if (!currentUser) {
              throw new Error("Please login first.");
            }

            await createPurchaseRequest(
              crop,
              quantity,
              currentUser,
              userProfile
            );

            alert("Purchase request sent successfully!");

          } catch (error) {
            console.error(error);
            alert(error.message || "Request failed.");
          }
        }}
        onBack={() => {
          setSelectedRole("");
          setShowRole(true);
        }}
      />
    );
  }

  if (selectedRole === "admin") {
    return (
      <AdminDashboard
        crops={crops}
        requests={requests}
        onDeleteCrop={handleDeleteCrop}
        onBack={() => {
          setSelectedRole("");
          setShowRole(true);
        }}
      />
    );
  }

  // Role Selection Page
  if (showRole) {
    return (
      <RoleSelection
        onSelect={(role) => {
          setSelectedRole(role);
          setShowRole(false);
        }}
      />
    );
  }



  return (


    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          🌱 Fasal<span>Mitra</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-buttons">
          {!currentUser && (
            <button
              className="login-btn"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          )}

          <button
            className="signup-btn"
            onClick={() => setShowRole(true)}
          >
            Get Started
          </button>

          {currentUser && (
            <button
              className="login-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}


        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">

          <div className="hero-badge">
            🌾 Smart Agriculture Platform
          </div>

          <h1>
            Grow Better.
            <br />
            <span>Sell Smarter.</span>
          </h1>

          <p>
            Connect directly with markets and buyers.
            Discover the best crop prices and make smarter
            selling decisions with FasalMitra.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              Explore Markets →
            </button>

            <button className="secondary-btn">
              Learn More
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <h3>Live</h3>
              <p>Mandi Prices</p>
            </div>

            <div>
              <h3>Smart</h3>
              <p>Price Comparison</p>
            </div>

            <div>
              <h3>Direct</h3>
              <p>Buyer Connection</p>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000"
            alt="Green agricultural field"
          />

          <div className="floating-card">
            <span>🌱</span>
            <div>
              <strong>Smart Farming</strong>
              <p>Better Market Opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">

        <div className="section-heading">
          <span>OUR FEATURES</span>
          <h2>Everything Farmers Need</h2>
          <p>
            Powerful tools to make agricultural marketing
            easier and more profitable.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Live Mandi Prices</h3>
            <p>
              Check the latest crop prices from different
              agricultural markets.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Price Comparison</h3>
            <p>
              Compare market prices and find better selling
              opportunities.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Direct Buyers</h3>
            <p>
              Connect farmers directly with traders and
              institutional buyers.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚜</div>
            <h3>Smart Recommendation</h3>
            <p>
              Find suitable markets based on price,
              transport and other costs.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏬</div>
            <h3>Storage & Logistics</h3>
            <p>
              Discover transport and storage opportunities
              for your crops.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Trusted Marketplace</h3>
            <p>
              Explore verified buyers and track your
              selling offers.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" id="how-it-works">

        <div className="section-heading">
          <span>SIMPLE PROCESS</span>
          <h2>How FasalMitra Works</h2>
          <p>Three simple steps to smarter crop selling.</p>
        </div>

        <div className="steps-grid">

          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Register Your Account</h3>
            <p>Create your farmer account and add your crop details.</p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Compare Market Prices</h3>
            <p>Explore mandi prices and compare nearby markets.</p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Connect With Buyers</h3>
            <p>Choose a suitable buyer and get better selling opportunities.</p>
          </div>

        </div>
      </section>

      {/* About */}
      <section className="about-section" id="about">
        <h2>Empowering Farmers With Technology</h2>
        <p>
          FasalMitra aims to strengthen market linkages,
          improve price discovery and help farmers make
          informed selling decisions.
        </p>
        <button className="primary-btn">
          Join FasalMitra →
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <h2>🌱 FasalMitra</h2>
        <p>Smart Agriculture. Better Markets. Better Future.</p>
        <p className="copyright">
          © 2026 FasalMitra. All Rights Reserved.
        </p>
      </footer>

    </div>
  )
}

export default App
