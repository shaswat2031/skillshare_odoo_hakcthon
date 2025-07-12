"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Notification from "../components/Notification";
import AcceptRequestModal from "../components/AcceptRequestModal";

export default function RequestsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const requestsPerPage = 2;

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      fetchRequests(user.id);
      fetchUsers();
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchRequests = async (userId) => {
    try {
      const response = await fetch(`/api/requests?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getUserById = (id) => {
    return users.find((user) => user.id === id);
  };

  const showNotification = (message, type = "success") => {
    setNotification({
      message,
      type,
      isVisible: true,
    });
  };

  const hideNotification = () => {
    setNotification({
      ...notification,
      isVisible: false,
    });
  };

  const handleAccept = (request) => {
    setSelectedRequest(request);
    setIsAcceptModalOpen(true);
  };

  const handleAcceptSubmit = async (acceptData) => {
    try {
      const response = await fetch("/api/requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(acceptData),
      });

      const data = await response.json();
      if (data.success) {
        // Update the request in state with new data including Google Meet link
        setRequests((prev) =>
          prev.map((req) =>
            req.id === acceptData.requestId ? { ...req, ...data.request } : req
          )
        );

        showNotification(
          "Request accepted successfully! Google Meet link has been set up.",
          "success"
        );
      } else {
        showNotification("Failed to accept request: " + data.error, "error");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      showNotification("Failed to accept request", "error");
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await fetch("/api/requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, status: "rejected" }),
      });

      const data = await response.json();
      if (data.success) {
        // Update the request in state
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "rejected" } : req
          )
        );
        showNotification("Request rejected successfully", "info");
      } else {
        showNotification("Failed to reject request: " + data.error, "error");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      showNotification("Failed to reject request", "error");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  // Filter requests
  const filteredRequests = filterStatus
    ? requests.filter((req) => req.status === filterStatus)
    : requests;

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
  const startIndex = (currentPage - 1) * requestsPerPage;
  const currentRequests = filteredRequests.slice(
    startIndex,
    startIndex + requestsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Please log in to view your requests.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Skill Swap Platform
          </h1>
          <a
            href="/"
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            Home
          </a>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Swap Requests</h2>
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200">
                Search
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {currentRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No skill swap requests found.
                </p>
              </div>
            ) : (
              currentRequests.map((request) => {
                const fromUser = getUserById(request.fromUserId);
                return (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {fromUser?.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {fromUser?.name || "Unknown User"}
                          </h3>
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600">
                              Skills Offered:{" "}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {request.offeredSkill}
                            </span>
                          </div>
                          <div className="mt-1 text-sm">
                            <span className="text-gray-600">
                              Skills wanted:{" "}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {request.wantedSkill}
                            </span>
                          </div>
                          {request.message && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Message: </span>
                              {request.message}
                            </div>
                          )}
                          {request.status === "accepted" &&
                            request.googleMeetLink && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                <div className="flex items-center space-x-2 mb-2">
                                  <svg
                                    className="w-5 h-5 text-green-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="font-medium text-green-800">
                                    Meeting Scheduled!
                                  </span>
                                </div>
                                <div className="text-sm text-green-700">
                                  <p className="font-medium">
                                    {request.meetingTitle}
                                  </p>
                                  <p className="mt-1">
                                    {request.meetingInstructions}
                                  </p>
                                  {request.scheduledFor && (
                                    <p className="mt-1">
                                      <span className="font-medium">
                                        Scheduled for:{" "}
                                      </span>
                                      {new Date(
                                        request.scheduledFor
                                      ).toLocaleDateString()}{" "}
                                      at{" "}
                                      {new Date(
                                        request.scheduledFor
                                      ).toLocaleTimeString()}
                                    </p>
                                  )}
                                  <div className="mt-2">
                                    <a
                                      href={request.googleMeetLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      <span>Join Google Meet</span>
                                    </a>
                                    <button
                                      onClick={() =>
                                        navigator.clipboard.writeText(
                                          request.googleMeetLink
                                        )
                                      }
                                      className="ml-2 text-green-600 hover:text-green-800 text-sm font-medium"
                                    >
                                      Copy Link
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          <div className="mt-2 text-xs text-gray-500">
                            Rating: {fromUser?.rating || 0}/5
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              request.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            Status:{" "}
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                        </div>
                        {request.status === "pending" && (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleAccept(request)}
                              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 flex items-center space-x-1"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 flex items-center space-x-1"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
