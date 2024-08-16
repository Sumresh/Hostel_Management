import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import background1 from "./Image.jpeg";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVv4TSNJcwdxsxADEDxcQbZuDPnTY49Ms",
  authDomain: "ifi-attendance.firebaseapp.com",
  databaseURL: "https://ifi-attendance-default-rtdb.firebaseio.com/",
  projectId: "ifi-attendance",
  storageBucket: "ifi-attendance.appspot.com",
  messagingSenderId: "851583311048",
  appId: "1:851583311048:web:bc892d4139c91dfaf2d9fd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Sign up new user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store additional user information in the Realtime Database
      const userRef = ref(database, "users/" + user.uid);
      await set(userRef, {
        email: email,
        designation: designation,
      });

      setMessage("Signup successful! Please log in.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${background1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card p-3 sm shadow"
        style={{
          maxWidth: "100%",
          width: "25rem",
          backgroundColor: "hsla(0, 0%, 10%, 0.1)",
          border: "2px solid white",
          marginInline: "1.5rem",
          padding: "2.5rem 1.5rem",
          borderRadius: "1rem",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="card-body">
          <h2 className="card-title text-center text-white mb-4">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-white">
                Email:
              </label>
              <input
                type="email"
                className="form-control bg-transparent text-white"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label text-white">
                Password:
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control bg-transparent text-white"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={handleTogglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="designation" className="form-label text-white">
                Designation:
              </label>
              <select
                className="form-select bg-gray-800 text-white border-white bg-transparent"
                id="designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              >
                <option value="" className="bg-gray-800 text-white">
                  Select Designation
                </option>
                <option value="Manager" className="bg-gray-800 text-white">
                  Manager
                </option>
                <option value="Warden" className="bg-gray-800 text-white">
                  Warden
                </option>
                {/* <option value="Team Admin" className="bg-gray-800 text-white">Team Admin</option> */}
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-light w-100"
              style={{ borderColor: "white" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
            {message && (
              <p
                className={`mt-3 text-center ${
                  message.includes("successful")
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
