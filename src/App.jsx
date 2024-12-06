import React from "react";
import { Routes, Route } from "react-router-dom"; // Only import Routes and Route
import Navbar from "./Navbar/Navbar";
import Service from "./Service/Service";
import Home from './Home/Home'
import Cashbook from "./Home/Cashbook";
import NotificationButton from "./components/Notification";
import Mainpage from "./components/Mainpage";
import Todo from "./Todo/Todo";
import ActivityTracker from "./components/ActivityTracker";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Cashbook />} />
        <Route path="/home" element={<Mainpage/>} />
        <Route path="/service" element={<Service />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/activityTracker" element={<ActivityTracker />} />


      </Routes>

    </>
  );
}

export default App;
