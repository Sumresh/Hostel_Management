import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import { CSVLink } from "react-csv";

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

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

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

  // Calculate total pages
  const totalPages = Math.ceil(employees.length / recordsPerPage);

  // Get current records
  const currentRecords = employees.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const headers = [
    { label: "ID", key: "id" },
    { label: "Date", key: "date" },
    { label: "Employee Number", key: "employeeNumber" },
    { label: "Name", key: "name" },
    { label: "State", key: "state" },
    { label: "Referral", key: "referral" },
    { label: "Shift", key: "shift" },
    { label: "Status", key: "status" },
    { label: "Phone Number", key: "phoneNumber" }, // Added Phone Number field
  ];

  return (
    <div className="container mx-auto my-8 px-4 md:px-8 lg:px-16 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Employee Details
        </h1>
        <div className="mb-4 text-center">
          <CSVLink
            data={employees} // Provide the full data for download
            headers={headers}
            filename={"employee_details.csv"}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Download CSV
          </CSVLink>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords.map((employee) => (
                <tr key={employee.id}>
                  {headers.map((header) => (
                    <td
                      key={header.key}
                      className="px-4 py-2 text-sm font-medium text-gray-900"
                    >
                      {employee[header.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
