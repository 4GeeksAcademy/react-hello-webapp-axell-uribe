import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { Home } from "./Home";
import { Single } from "./Single";
import { Demo } from "./Demo";

const Layout = () => {
  return (
    <Router>
      <ScrollToTop>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/:category/:uid" element={<Single />} />
        </Routes>
        <Footer />
      </ScrollToTop>
    </Router>
  );
};

export default Layout;
