import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cafe from "./pages/CafeComponent";
import Employee from "./pages/EmployeeComponent";
import NoPage from "./pages/NoPage";
import "./App.css"
import CafeForm from "./pages/CafeForm";
import EmployeeForm from "./pages/EmployeeForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={< Cafe />} />
        <Route exact path="/employee" element={< Employee />} />
        <Route exact path="/cafeform" element={< CafeForm />} />
        <Route exact path="/cafeform/:id" element={< CafeForm />} />
        <Route exact path="/employeeform" element={< EmployeeForm />} />
        <Route exact path="/employeeform/:id" element={< EmployeeForm />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
