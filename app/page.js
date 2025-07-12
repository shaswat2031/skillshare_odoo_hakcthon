"use client";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import UserCard from "./components/UserCard";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import RequestModal from "./components/RequestModal";

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [availability, setAvailability] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const usersPerPage = 3;

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, availability, searchTerm]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (availability) {
      filtered = filtered.filter((user) => user.availability === availability);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.skillsOffered?.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          user.skillsWanted?.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  const handleRequest = (userId) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user);
    setIsRequestModalOpen(true);
  };

  const handleSubmitRequest = async (requestData) => {
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Request sent successfully!");
      } else {
        alert("Failed to send request: " + data.error);
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request");
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Skill Swap Platform
          </h1>
          <p className="text-gray-600">Find people to exchange skills with</p>
        </div>

        <SearchBar
          onSearch={setSearchTerm}
          availability={availability}
          setAvailability={setAvailability}
        />

        <div className="space-y-4">
          {currentUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No users found matching your criteria.
              </p>
            </div>
          ) : (
            currentUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                currentUser={currentUser}
                onRequest={handleRequest}
                showRequestButton={currentUser !== null}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        targetUser={selectedUser}
        currentUser={currentUser}
        onSubmit={handleSubmitRequest}
      />
    </div>
  );
}
