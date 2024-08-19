import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format, parse } from "date-fns"; // Import date-fns for formatting

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
    setDate(
      employee.date ? parse(employee.date, "dd/MM/yyyy", new Date()) : null
    ); // Parse date
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

    const formattedDate = date ? format(date, "dd/MM/yyyy") : null; // Format date

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
      const employeeDate = new Date(
        employee.date.split("/").reverse().join("/")
      ).getTime(); // Convert date format
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
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">To Date:</label>
              <DatePicker
                selected={filterEndDate}
                onChange={(date) => setFilterEndDate(date)}
                className="w-full p-2 border rounded"
                dateFormat="dd/MM/yyyy"
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
                  Employee Id
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
                    {employee.employeeNumber}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="py-2 px-4 bg-gray-300 text-white rounded hover:bg-gray-400"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="py-2 px-4 bg-gray-300 text-white rounded hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>

      {editingEmployee && (
        <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white mt-8">
          <h2 className="text-2xl font-bold mb-4">Edit Employee</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-medium mb-2">Date:</label>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                className="w-full p-2 border rounded"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Employee Number:
              </label>
              <input
                type="text"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">State:</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Referral Person:
              </label>
              <input
                type="text"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Shift:</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="A Shift">A Shift</option>
                <option value="B Shift">B Shift</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Resigned">Resigned</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Phone Number:
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setEditingEmployee(null)}
              className="py-2 px-4 bg-gray-300 text-white rounded hover:bg-gray-400 mr-4"
            >
              Back
            </button>
            <button
              onClick={handleUpdate}
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default EmployeeTableData;
