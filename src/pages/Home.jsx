import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, MoonIcon, SunIcon } from "@heroicons/react/outline";

export default function Home() {
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true); // Dark mode enabled by default
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen flex flex-col items-center justify-center transition-all duration-500`}
    >
      {/* Toggle Dark Mode */}
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-900" />
          )}
        </button>
      </div>

      {/* Logo */}
      <h1 className="text-5xl font-extrabold tracking-wide mb-6">
        <span className="text-blue-400">Ed</span>
        <span className="text-green-400">uS</span>
        <span className="text-yellow-400">ea</span>
        <span className="text-red-400">rc</span>
        <span className="text-orange-400">h</span>
      </h1>

      {/* Search Bar with Glassmorphism Effect */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-lg backdrop-blur-lg bg-white/10 dark:bg-gray-700/30 p-2 rounded-lg shadow-lg"
      >
        <div className="relative">
          <input
            type="text"
            className="w-full p-4 pl-12 rounded-xl border border-gray-400 focus:ring-2 focus:ring-blue-400 bg-white/30 dark:bg-gray-800/50 transition-all"
            placeholder="Search educational topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchIcon className="absolute left-4 top-4 h-5 w-5 text-gray-600 dark:text-gray-300" />
        </div>
      </form>

      {/* Quick Search Buttons */}
      <div className="mt-6 flex space-x-3">
        {["Math", "Science", "Coding", "History"].map((tag) => (
          <button
            key={tag}
            className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-400 transition-all"
            onClick={() => navigate(`/search?q=${tag}`)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* About Section */}
      <div className="mt-10 p-6 bg-gray-800 text-white rounded-lg max-w-lg text-center">
        <h2 className="text-2xl font-bold mb-3">About EduSearch</h2>
        <p className="text-lg text-gray-300">
          EduSearch is an AI-powered educational search engine designed to
          provide accurate and concise explanations for any topic you search.
        </p>
      </div>
    </div>
  );
}
