import React, { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background2 from "./Image.jpeg";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format date as YYYY-MM-DD
    const formattedDate = date ? date.toISOString().split("T")[0] : null;

    const data = {
      date: formattedDate,
      employeeNumber,
      name,
      state,
      referral,
      shift,
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
    // container mx-auto my-8 px-4 md:px-8 lg:px-16
    <div
      className=" container mx-auto my-8 px-4 md:px-8 lg:px-16"
      //   style={{
      //     backgroundImage: `url(${background2})`,
      //     backgroundSize: "cover",
      //     backgroundPosition: "center",
      //   }}
    >
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
              dateFormat="yyyy/MM/dd"
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
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
