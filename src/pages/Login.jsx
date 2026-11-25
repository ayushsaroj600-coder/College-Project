
import { useState } from "react";
import "./Login.css";


import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";


function Login() {

  const [name, setName] = useState("");
  const [role, setRole] = useState("farmer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Login or Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      let result;

      if (isSignup) {
        if (!name.trim()) {
          setMessage("Please enter your name.");
          return;
        }

        result = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        // Save user profile in Firestore
        await setDoc(doc(db, "users", result.user.uid), {
          name: name.trim(),
          email: result.user.email,
          role: role,
          uid: result.user.uid,
          createdAt: new Date().toISOString()
        });

        setMessage("Account and profile created successfully!");
      }

      //   console.log("Logged in user:", result.user);

    } catch (error) {
      console.error("Authentication error:", error);

      switch (error.code) {
        case "auth/email-already-in-use":
          setMessage("This email is already registered. Please login.");
          break;

        case "auth/invalid-email":
          setMessage("Please enter a valid email address.");
          break;

        case "auth/invalid-credential":
          setMessage("Incorrect email or password.");
          break;

        case "auth/weak-password":
          setMessage("Please choose a stronger password.");
          break;

        case "auth/user-not-found":
          setMessage("Account not found. Please create an account.");
          break;

        case "auth/network-request-failed":
          setMessage("Network error. Please check your internet.");
          break;

        default:
          setMessage(error.message);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <h1>🌱 FasalMitra</h1>

      <h2>{isSignup ? "Create Account" : "Welcome Back!"}</h2>

      <p>
        {isSignup
          ? "Create your FasalMitra account"
          : "Login using your email and password"}
      </p>

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
            </select>
          </>
        )}



        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isSignup
              ? "Create Account"
              : "Login"}
        </button>

      </form>

      <p>{message}</p>

      <p>
        {isSignup
          ? "Already have an account?"
          : "Don't have an account?"}

        <button
          type="button"
          onClick={() => {
            setIsSignup(!isSignup);
            setMessage("");
          }}
        >
          {isSignup ? "Login" : "Sign Up"}
        </button>
      </p>

    </div>
  );
}

export default Login;
