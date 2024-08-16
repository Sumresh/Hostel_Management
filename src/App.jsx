import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
import { getDatabase, ref, get } from "firebase/database";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeTable from "./components/EmployeeTable";
import Register from "./components/Register";
import EmployeeTableData from "./components/EmployeeTableData";
// import "./App.css"; // Import your styles here

function App() {
  const [user, setUser] = useState(null);
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);

      // Fetch user designation from the database
      const db = getDatabase();
      const userRef = ref(db, "users/" + currentUser.uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        setDesignation(userData.designation || "Unknown");
      } else {
        setDesignation("Unknown");
      }
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <HomePage
                  user={user}
                  designation={designation}
                  handleLogout={handleLogout}
                />
              ) : (
                <LoginForm handleLogin={handleLogin} />
              )
            }
          />

          <Route path="/EmployeeForm" element={<EmployeeForm />} />
          <Route path="/EmployeeTable" element={<EmployeeTable />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/EmployeeTableData" element={<EmployeeTableData />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
