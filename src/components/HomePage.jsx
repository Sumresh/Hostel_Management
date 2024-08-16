import React from "react";
import { Link } from "react-router-dom";

const HomePage = ({ user, designation, handleLogout }) => {
  // Convert designation to lowercase and check if it is "warden" or "manager"
  const isWarden = designation.toLowerCase() === "warden";
  const isManager = designation.toLowerCase() === "manager";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10 lg:p-12">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-4 text-gray-800">
          Welcome, {user.displayName || user.email}!
        </h1>
        <h2 className="text-lg md:text-xl text-center mb-6 text-gray-600">
          Designation: {designation}
        </h2>
        <div className="flex flex-col items-center space-y-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleLogout}
          >
            Logout
          </button>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            {(isManager || isWarden) && (
              <Link
                to="/EmployeeForm"
                className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
              >
                Employee Form
              </Link>
            )}
            {isManager && (
              <Link
                to="/EmployeeTable"
                className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
              >
                Employee Table
              </Link>
            )}
            {isManager && (
              <Link
                to="/Register"
                className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
