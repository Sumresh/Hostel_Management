import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const EmployeeTableData = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [date, setDate] = useState(null);
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [referral, setReferral] = useState("");
  const [shift, setShift] = useState("A Shift");

  useEffect(() => {
    const dbRef = ref(database, "employeeDetails/");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const formattedData = Object.keys(data || {}).map((key) => ({
        id: key,
        ...data[key],
      }));
      setEmployees(formattedData);
    });
  }, []);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setDate(employee.date ? new Date(employee.date) : null);
    setEmployeeNumber(employee.employeeNumber || "");
    setName(employee.name || "");
    setState(employee.state || "");
    setReferral(employee.referral || "");
    setShift(employee.shift || "A Shift");
  };

  const handleUpdate = async () => {
    if (!editingEmployee) return;

    const formattedDate = date ? date.toISOString().split("T")[0] : null;

    const updatedData = {
      date: formattedDate,
      employeeNumber,
      name,
      state,
      referral,
      shift,
    };

    try {
      const dbRef = ref(database, "employeeDetails/" + editingEmployee.id);
      await set(dbRef, updatedData);
      toast.success("Data updated successfully!");
      setEditingEmployee(null);
      setDate(null);
      setEmployeeNumber("");
      setName("");
      setState("");
      setReferral("");
      setShift("A Shift");
    } catch (error) {
      toast.error("Error updating data: " + error.message);
    }
  };

  return (
    <div className="container mx-auto my-8 px-4 md:px-8 lg:px-16">
      <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-4">Employee Details</h1>

        <div className="mb-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2">Employee List:</h2>
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingEmployee && (
          <div className="border-t border-gray-300 pt-6">
            <h2 className="text-xl font-semibold mb-4">Edit Employee:</h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-lg font-medium mb-2"
                >
                  Date:
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
                  id="date"
                  value={editingEmployee.date}
                  readOnly
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
                <label
                  htmlFor="name"
                  className="block text-lg font-medium mb-2"
                >
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
                <label
                  htmlFor="state"
                  className="block text-lg font-medium mb-2"
                >
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
                <label
                  htmlFor="shift"
                  className="block text-lg font-medium mb-2"
                >
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
                type="button"
                onClick={handleUpdate}
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update
              </button>
            </form>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeeTableData;
