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

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const apiURL = "https://quizzie-5r0l.onrender.com/api";

  const toggleForm = () => {
    setFormType(formType === "signup" ? "login" : "signup");
    clearErrors("");
  };

  const navigate = useNavigate("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const clearErrors = () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };
  const handleSignup = async (userData) => {
    const { name, email, password, confirmPassword } = userData;

    clearErrors("");

    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }
    if (!nameRegex.test(name.trim())) {
      setNameError("Invalid name format. Use only alphabets");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError("Weak Password");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Password and confirm password not matched");
      return;
    }
    try {
      const response = await axios.post(
        `${apiURL}/auth/signup`,
        userData
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (userData) => {
    try {
      const response = await axios.post(
        `${apiURL}/auth/login`,
        userData
      );

      console.log("Full Response:", response);

      if (response.data.message === "Login successful") {
        localStorage.setItem("authToken", response.data.token);

        console.log("Login Successful");
        navigate("/dashboard");
        return true;
      } else {
        setEmailError(response.data.message || "Invalid Credentials");
        console.log(
          "Login Failed:",
          response.data.message || "Invalid Credentials"
        );
        return false;
      }
    } catch (error) {
      console.error(error);
      setEmailError("Authentication failed. Please try again");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearErrors("");

    if (
      formType === "signup" &&
      formData.password !== formData.confirmPassword
    ) {
      setConfirmPasswordError("Passwords do not match");
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
      setEmailError("Authentication failed. Please try again.");
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
            {nameError && <p className={style.errorMessage}>{nameError}</p>}
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
          {emailError && <p className={style.errorMessage}>{emailError}</p>}
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
          {passwordError && (
            <p className={style.errorMessage}>{passwordError}</p>
          )}
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
            {confirmPasswordError && (
              <p className={style.errorMessage}>{confirmPasswordError}</p>
            )}
          </div>
        )}

        <button type="submit" className={style.btn}>
          {formType === "signup" ? "Sign-Up" : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
