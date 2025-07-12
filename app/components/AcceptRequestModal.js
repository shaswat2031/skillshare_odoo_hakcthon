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
    setGoogleMeetLink("");
    setMeetingDate("");
    setMeetingTime("");
    setMessage("");
    onClose();
  };

  if (!isOpen || !request || !fromUser) return null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

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
              Google Meet Link *
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={googleMeetLink}
                onChange={(e) => setGoogleMeetLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="button"
                onClick={generateGoogleMeetLink}
                disabled={isGeneratingLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isGeneratingLink ? "Generating..." : "Generate Link"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              You can manually enter a Google Meet link or generate one
              automatically
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                min={minDate}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time
              </label>
              <input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Let them know you're excited to swap skills..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {googleMeetLink && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
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
                  Meeting Link Ready!
                </span>
              </div>
              <p className="text-sm text-green-700">
                Meeting link:{" "}
                <a
                  href={googleMeetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-900"
                >
                  {googleMeetLink}
                </a>
              </p>
            </div>
          )}

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
