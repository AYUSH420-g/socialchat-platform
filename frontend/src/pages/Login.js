import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';
import loginImage from '../assets/loginpage_image.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // CALL BACKEND 
      const res = await axios.post("/api/auth/login", { email, password });

      // SAVE TOKEN IN LOCAL STORAGE
      localStorage.setItem("token", res.data.token);

      // SAVE USER DATA
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // REDIRECT TO HOME PAGE (YOU CAN CHANGE IT)
      navigate("/home");

    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-image-container">
        <img
          src={loginImage}
          alt="here"
          className="login-image"
        />
      </div>
    
      <div className="login-container">
        <div className="login-box">
          <div className="login-title">Chat With Us</div>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Phone number, username, or email"
            />

            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Password"
            />

            {error && <p className="error">{error}</p>}

            <button type="submit">Log in</button>
          </form>

          <div className="login-footer">
            Don’t have an account? <span>Sign up</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
