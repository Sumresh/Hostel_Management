import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [date, setDate] = useState(null);
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [referral, setReferral] = useState("");
  const [shift, setShift] = useState("A Shift");
  const [status, setStatus] = useState("Active");
  const [phoneNumber, setPhoneNumber] = useState(""); // Added phone number state

  // Filter states
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const dbRef = ref(database, "employeeDetails/");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const formattedData = Object.keys(data || {}).map((key) => ({
        id: key,
        ...data[key],
      }));
      setEmployees(formattedData);
      setFilteredEmployees(formattedData);
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
    setStatus(employee.status || "Active");
    setPhoneNumber(employee.phoneNumber || ""); // Set phone number for editing
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
      status,
      phoneNumber, // Include phone number in the update
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
      setStatus("Active");
      setPhoneNumber(""); // Reset phone number field
    } catch (error) {
      toast.error("Error updating data: " + error.message);
    }
  };

  const handleFilter = () => {
    if (!filterStartDate || !filterEndDate) {
      toast.error("Please select both start and end dates for filtering.");
      return;
    }

    const startDate = filterStartDate.getTime();
    const endDate = filterEndDate.getTime();

    const filtered = employees.filter((employee) => {
      const employeeDate = new Date(employee.date).getTime();
      return employeeDate >= startDate && employeeDate <= endDate;
    });

    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  };

  // Pagination logic
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="container mx-auto my-8 px-4 md:px-8 lg:px-16">
      <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-4">Employee Details</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Filter by Date Range:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-lg font-medium mb-2">
                From Date:
              </label>
              <DatePicker
                selected={filterStartDate}
                onChange={(date) => setFilterStartDate(date)}
                className="w-full p-2 border rounded"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">To Date:</label>
              <DatePicker
                selected={filterEndDate}
                onChange={(date) => setFilterEndDate(date)}
                className="w-full p-2 border rounded"
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>
          <button
            onClick={handleFilter}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Filter
          </button>
        </div>

        <div className="mb-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2">Employee List:</h2>
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Of Joining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.status}
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
              <div>
                <label
                  htmlFor="status"
                  className="block text-lg font-medium mb-2"
                >
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
                  type="text"
                  className="w-full p-2 border rounded"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only digits and restrict to 10 characters
                    if (/^\d{0,10}$/.test(value)) {
                      setPhoneNumber(value);
                    }
                  }}
                  required
                />
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

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-l hover:bg-blue-600 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeeTableData;
