import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Users from "./components/Users";
import Projects from "./components/Projects";
import Defects from "./components/Defects";
import Reports from "./components/Reports";
import Dashboard from "./components/Dashboard";
import { ChangePassword } from "./components/changePassword";
import ForgotPassword from "./components/forgotPassword";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";

function App() {
  const selectspinner = (rootstate) => rootstate.spinner;
  const spinner = useSelector(selectspinner);

  return (
    <>
      {spinner.display && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            zIndex: "1000",
            background: "rgba(0,0,0,0.5)",
            padding: "25% 48%",
          }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>

          <Route path="/users" element={<Users />}></Route>
          <Route path="/projects" element={<Projects />}></Route>
          <Route path="/defects" element={<Defects />}></Route>
          <Route path="/reports" element={<Reports />}></Route>
          <Route path="/changepassword" element={<ChangePassword />}></Route>
          <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
