import React, { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background2 from "./Image.jpeg";
import { format } from "date-fns"; // Import format from date-fns for date formatting
import { Link } from "react-router-dom";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHBA7J8LLc8-ry-sHcy5_t3OjURzBSsEg",
  authDomain: "hostel-management-system-87b61.firebaseapp.com",
  databaseURL:
    "https://hostel-management-system-87b61-default-rtdb.firebaseio.com/",
  projectId: "hostel-management-system-87b61",
  storageBucket: "hostel-management-system-87b61.appspot.com",
  messagingSenderId: "474643085278",
  appId: "1:474643085278:web:9380e5c41bc605900a8f4f",
  measurementId: "G-442DLJQ799",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const EmployeeForm = () => {
  const [date, setDate] = useState(null);
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [referral, setReferral] = useState("");
  const [shift, setShift] = useState("A Shift");
  const [status, setStatus] = useState("Active");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format date as DD/MM/YYYY
    const formattedDate = date ? format(date, "dd/MM/yyyy") : null;

    const data = {
      date: formattedDate,
      employeeNumber,
      name,
      state,
      referral,
      shift,
      status,
      phoneNumber, // Include phone number in the data
    };

    try {
      const dbRef = ref(database, "employeeDetails/" + Date.now()); // Unique identifier
      await set(dbRef, data);
      toast.success("Data saved successfully!");
    } catch (error) {
      toast.error("Error saving data: " + error.message);
    }
  };

  return (
    <div className="container mx-auto my-8 px-4 md:px-8 lg:px-16">
      <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-transparent">
        <h1 className="text-2xl font-bold mb-4">Employee Details</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-lg font-medium mb-2">
              Date:
            </label>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="dd/MM/yyyy" // Update date format
              className="w-full p-2 border rounded"
              id="date"
              required
            />
          </div>
          <div>
            <label
              htmlFor="employeeNumber"
              className="block text-lg font-medium mb-2"
            >
              Employee Number (Optional):
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              id="employeeNumber"
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-lg font-medium mb-2">
              Name of Employee:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-lg font-medium mb-2">
              State:
            </label>
            <select
              className="w-full p-2 border rounded"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            >
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="referral"
              className="block text-lg font-medium mb-2"
            >
              Referral Person Name:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              id="referral"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="shift" className="block text-lg font-medium mb-2">
              Shift:
            </label>
            <select
              className="w-full p-2 border rounded"
              id="shift"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              required
            >
              <option value="A Shift">A Shift</option>
              <option value="B Shift">B Shift</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-lg font-medium mb-2">
              Status:
            </label>
            <select
              className="w-full p-2 border rounded"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Active">Active</option>
              <option value="Resigned">Resigned</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-lg font-medium mb-2"
            >
              Phone Number:
            </label>
            <input
              type="tel"
              className="w-full p-2 border rounded"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setPhoneNumber(value);
                }
              }}
              required
            />
          </div>
          <button
            type="submit"
            className="w-40 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EmployeeForm;
