"use client";
import { useState } from "react";

export default function Header({ currentUser, onLogout }) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Skill Swap Platform
            </h1>
          </div>

          <nav className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <a
                  href="/"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="/profile"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </a>
                <a
                  href="/requests"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Swap Requests
                </a>
                <div className="flex items-center space-x-3">
                  <img
                    src={currentUser.profilePhoto || "/placeholder-avatar.svg"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full bg-gray-300 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-avatar.svg";
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser.name}
                  </span>
                  <button
                    onClick={onLogout}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <a
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100"
                >
                  Register
                </a>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
