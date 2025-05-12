import React from "react";
import NavbarRoutes from "./navbar-routes";
import MobileSideBar from "./mobile-sidebar";

const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-lg">
      {/* mobile view */}
      <MobileSideBar />
      {/* sidebar routes */}
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
