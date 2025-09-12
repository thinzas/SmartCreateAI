import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { SignIn, useUser } from "@clerk/clerk-react";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  // Define background for each route
  const getPageBackground = () => {
    switch (location.pathname) {
      case "/ai":
        return "bg-gradient-to-r from-[#3588F2] to-[#0BB0D7]";
      case "/ai/write-article":
        return "bg-gradient-to-r from-[#93bded] to-[#226BFF]";
      case "/ai/generate-images":
        return "bg-gradient-to-r from-green-100 to-green-400";
      case "/ai/blog-titles":
        return "bg-gradient-to-r from-pink-100 to-pink-500";
      case "/ai/review-resume":
        return "bg-gradient-to-r from-purple-100 to-purple-500";
      case "/ai/remove-background":
        return "bg-gradient-to-r from-[#e4bbb8] to-[#FF4938]";
      case "/ai/remove-object":
        return "bg-gradient-to-r from-amber-100 to-amber-300";

      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600";
    }
  };

  return user ? (
    <div
      className={`flex flex-col items-start justify-start h-screen ${getPageBackground()}`}
    >
      {/* Glass effect navbar */}
      <nav className="w-full h-14  min-h-14 flex items-center justify-between   px-1 sm:px-5 xl:px-8 bg-white/60 backdrop-blur-xl shadow-lg">
        <img
          src={assets.logo}
          className="w-50 sm:w-52 py-3  cursor-pointer"
          onClick={() => navigate("/")}
        />
        {sidebar ? (
          <X
            onClick={() => setSidebar(false)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        ) : (
          <Menu
            onClick={() => setSidebar(true)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        )}
      </nav>
      <div className="flex-1 w-full flex h-[calc(100vh-64px)]">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div>
      <SignIn />
    </div>
  );
};

export default Layout;
