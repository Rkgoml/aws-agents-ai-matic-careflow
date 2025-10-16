"use client";

import React from "react";
import { Database, Bot, Brain } from "lucide-react";
import { NavLink } from "react-router-dom";

const registryItems = [
  { title: "LLM Providers", icon: Brain, href: "/agentspinner/registry/llms" },
  {
    title: "Databases",
    icon: Database,
    href: "/agentspinner/registry/databases",
  },
  { title: "Agents", icon: Bot, href: "/agentspinner/registry/agents" },
];

export default function Registry() {
  return (
    <div className="px-6 py-12 scrollbar-hide">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-black mb-2">
            Registry Dashboard
          </h1>
          <p className="text-gray-600">
            Browse and manage all your available connections and AI components.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {registryItems.map(({ title, icon: Icon, href }) => (
            <NavLink
              key={title}
              to={href}
              className="flex flex-col items-center justify-center gap-3 border border-gray-200 rounded-xl p-8 bg-white hover:bg-orange-50 hover:border-orange-400 transition shadow-sm cursor-pointer"
            >
              <div className="p-4 rounded-full bg-orange-100">
                <Icon className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-lg font-semibold text-black">{title}</h2>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
