import React from "react";
import { Routes, Route } from "react-router-dom"; // Only import Routes and Route
import Navbar from "./Navbar/Navbar";
import Service from "./Service/Service";
import Home from './Home/Home'
import Cashbook from "./Home/Cashbook";
import NotificationButton from "./components/Notification";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
      <Route path="/" element={<Cashbook />} />
        <Route path="/home" element={<Home />} />
        <Route path="/service" element={<Service />} />
      </Routes>

        
    </>
  );
}

export default App;
