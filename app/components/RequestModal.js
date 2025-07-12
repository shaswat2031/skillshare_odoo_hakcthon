"use client";
import { useState } from "react";

export default function RequestModal({
  isOpen,
  onClose,
  targetUser,
  currentUser,
  onSubmit,
}) {
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState("");
  const [selectedWantedSkill, setSelectedWantedSkill] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOfferedSkill && selectedWantedSkill) {
      onSubmit({
        fromUserId: currentUser.id,
        toUserId: targetUser.id,
        offeredSkill: selectedOfferedSkill,
        wantedSkill: selectedWantedSkill,
        message,
      });

      // Reset form
      setSelectedOfferedSkill("");
      setSelectedWantedSkill("");
      setMessage("");
      onClose();
    }
  };

  if (!isOpen || !targetUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">Send Skill Swap Request</h2>
        <p className="text-gray-600 mb-4">
          Request a skill swap with {targetUser.name}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose one of your offered skills
            </label>
            <select
              value={selectedOfferedSkill}
              onChange={(e) => setSelectedOfferedSkill(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select a skill you offer</option>
              {currentUser.skillsOffered?.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose one of their wanted skills
            </label>
            <select
              value={selectedWantedSkill}
              onChange={(e) => setSelectedWantedSkill(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select a skill they want</option>
              {targetUser.skillsWanted?.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell them why you'd like to swap skills..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
