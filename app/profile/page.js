"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    skillsOffered: [],
    skillsWanted: [],
    availability: "",
    profile: "public",
  });
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setFormData({
        name: user.name || "",
        location: user.location || "",
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: user.availability || "",
        profile: user.profile || "public",
      });
    } else {
      window.location.href = "/login";
    }
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkillOffered = () => {
    if (
      newSkillOffered.trim() &&
      !formData.skillsOffered.includes(newSkillOffered.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()],
      }));
      setNewSkillOffered("");
    }
  };

  const addSkillWanted = () => {
    if (
      newSkillWanted.trim() &&
      !formData.skillsWanted.includes(newSkillWanted.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()],
      }));
      setNewSkillWanted("");
    }
  };

  const removeSkillOffered = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter((s) => s !== skill),
    }));
  };

  const removeSkillWanted = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter((s) => s !== skill),
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Update localStorage
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        setCurrentUser(data.user);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile: " + data.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        location: currentUser.location || "",
        skillsOffered: currentUser.skillsOffered || [],
        skillsWanted: currentUser.skillsWanted || [],
        availability: currentUser.availability || "",
        profile: currentUser.profile || "public",
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

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
        <div className="text-lg">Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleDiscard}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Discard
              </button>
              <a
                href="/requests"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Swap request
              </a>
              <a
                href="/"
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Home
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills Offered
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skillsOffered.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkillOffered(skill)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newSkillOffered}
                      onChange={(e) => setNewSkillOffered(e.target.value)}
                      placeholder="Add a skill"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === "Enter" && addSkillOffered()}
                    />
                    <button
                      onClick={addSkillOffered}
                      className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills Wanted
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skillsWanted.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkillWanted(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newSkillWanted}
                      onChange={(e) => setNewSkillWanted(e.target.value)}
                      placeholder="Add a skill"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === "Enter" && addSkillWanted()}
                    />
                    <button
                      onClick={addSkillWanted}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select availability</option>
                    <option value="weekends">Weekends</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="evenings">Evenings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile
                  </label>
                  <select
                    name="profile"
                    value={formData.profile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-600 font-medium text-2xl">
                  {formData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-500 text-center">Profile Photo</p>
              <p className="text-xs text-gray-400 text-center mt-1">
                Add/Edit Resume
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
