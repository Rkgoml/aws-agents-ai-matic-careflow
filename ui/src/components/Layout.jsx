import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
