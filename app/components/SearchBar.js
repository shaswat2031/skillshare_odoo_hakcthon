"use client";

export default function SearchBar({ onSearch, availability, setAvailability }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center space-x-4">
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Availability</option>
            <option value="weekends">Weekends</option>
            <option value="weekdays">Weekdays</option>
            <option value="evenings">Evenings</option>
          </select>
        </div>

        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search skills..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
          Search
        </button>
      </div>
    </div>
  );
}
