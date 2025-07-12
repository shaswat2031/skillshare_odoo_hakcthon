"use client";
import { useState } from "react";

export default function AcceptRequestModal({
  isOpen,
  onClose,
  request,
  fromUser,
  onAccept,
}) {
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const acceptData = {
      requestId: request.id,
      status: "accepted",
      responseMessage,
    };
    onAccept(acceptData);

    // Reset form
    setResponseMessage("");
    onClose();
  };

  if (!isOpen || !request || !fromUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          Accept Skill Swap Request
        </h2>

        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-900 mb-2">Request Details:</h3>
          <p className="text-sm text-gray-600">
            <span className="font-medium">From:</span> {fromUser.name}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">They offer:</span>{" "}
            {request.offeredSkill}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">They want:</span>{" "}
            {request.wantedSkill}
          </p>
          {request.message && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Message:</span> {request.message}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Message (Optional)
            </label>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder="Let them know you're excited to swap skills..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <p className="text-sm text-gray-600 mt-2">
            <span className="font-bold">Note:</span> A Google Meet link will be
            generated automatically when you accept this request.
          </p>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Accept Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
