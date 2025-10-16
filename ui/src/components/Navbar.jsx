import React from "react";
import { NavLink } from "react-router-dom";
import goml from "../assets/goml.webp";
import ai from "../assets/ai.webp";

function Navbar() {
  const navLinks = [
    { href: "/home", label: "Create New Agent", exact: true },
    { href: "/home/workflows", label: "Workflows" },
    // { href: "/home/registry", label: "Registry" },
    { href: "/home/schedular", label: "Schedular" },
  ];

  return (
    <header className="relative  border-gray-200  py-6">
      {/* <img
        src={ai}
        alt="AI Logo"
        width={90}
        height={90}
        className="absolute top-1 left-6"
      /> */}
      <img
        src={goml}
        alt="GoML Logo"
        width={120}
        height={120}
        className="absolute top-6 right-6"
      />

      <nav className="flex justify-center gap-10 text-lg font-semibold">
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            end={link.exact}
            className={({ isActive }) =>
              `pb-1 border-b-2 transition ${
                isActive
                  ? "text-orange-600 border-orange-500"
                  : "text-black border-transparent hover:text-orange-500"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
