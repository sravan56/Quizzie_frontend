import React, { useState } from "react";
import style from "../styles/AuthForm.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AuthForm = () => {
  const [formType, setFormType] = useState("signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const toggleForm = () => {
    setFormType(formType === "signup" ? "login" : "signup");
    setError("");
  };

  const navigate = useNavigate("");
  const handleSignup = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        userData
      );
      console.log(response.data); // Handle success response
    } catch (error) {
      console.error(error); // Handle error
    }
  };

  // Function to handle login
  const handleLogin = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        userData
      );
      console.log(response.data); // Handle success response
      navigate("/dashboard");
    } catch (error) {
      console.error(error); // Handle error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      formType === "signup" &&
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }
    try {
      if (formType === "signup") {
        await handleSignup(formData);
      } else if (formType === "login") {
        await handleLogin(formData);
      }
    } catch (error) {
      console.error(error);
      setError("Authentication failed. Please try again.");
    }
    console.log(`Form submitted: ${formType}`, formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={style.authContainer}>
      <h1>QUIZZIE</h1>
      <div className={style.toggleButtons}>
        <button
          className={formType === "signup" ? style.active : ""}
          onClick={() => toggleForm("signup")}
        >
          Sign Up
        </button>
        <button
          className={formType === "login" ? style.active : ""}
          onClick={() => toggleForm("login")}
        >
          Log In
        </button>
      </div>

      <form className={style.formContainer} onSubmit={handleSubmit}>
        {formType === "signup" && (
          <div className={style.formGroup}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className={style.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={style.formGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {formType === "signup" && (
          <div className={style.formGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {error && <p className={style.errorMessage}>{error}</p>}

        <button type="submit" className={style.btn}>
          {formType === "signup" ? "Sign-Up" : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
