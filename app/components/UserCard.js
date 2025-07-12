"use client";

export default function UserCard({
  user,
  onRequest,
  currentUser,
  showRequestButton = true,
}) {
  const handleRequest = () => {
    if (onRequest && currentUser) {
      onRequest(user.id);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-lg">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <div className="mt-2">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Skills Offered:</span>
                {user.skillsOffered?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-sm text-gray-600">Skills Wanted:</span>
                {user.skillsWanted?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          {showRequestButton && currentUser && currentUser.id !== user.id && (
            <button
              onClick={handleRequest}
              className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700"
            >
              Request
            </button>
          )}
          <div className="mt-2 text-sm text-gray-500">
            Rating: {user.rating}/5
          </div>
        </div>
      </div>
    </div>
  );
}
