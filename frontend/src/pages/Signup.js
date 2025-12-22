// Signup.js
import React, { useState } from "react";
import axios from "axios";
import { href, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);
    try {

      const payload = {
        fullName,
        username,
        email,
        password,
      };

      const res = await axios.post("/api/auth/signup", payload);

      alert(res.data.message || "Account created successfully. Please log in.");

      navigate("/login");
    } catch (err) {

        const msg = err.response?.data?.message || "Signup failed. Try again.";
      setError(msg);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h1 className="signup-title">Chat With Us</h1>

        <div>
          <span>Have an account?</span>
          <br></br>
            <a className="sign-login"
              href="/Login">Log in
            </a>

        </div>
        <div className="or-line">
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <p className="info-text">
            This is just a sentence for making this page's feel more real. {" "}
            <a href="#" className="link">
              Learn more
            </a>
          </p>

          <p className="terms">
            By signing up, you agree to our{" "}
            <a href="#" className="link">
              Terms
            </a>
            ,{" "}
            <a href="#" className="link">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="link">
              Cookies Policy
            </a>
            .
          </p>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
