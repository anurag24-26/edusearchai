import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, MoonIcon, SunIcon } from "@heroicons/react/outline";

export default function Home() {
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true); // Dark mode enabled by default
  const [language, setLanguage] = useState("English"); // Default language
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}&lang=${language}`);
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen flex flex-col items-center justify-center px-4 transition-all duration-500`}
    >
      {/* Toggle Dark Mode */}
      <div className="absolute top-4 right-4">
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
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-5 text-center">
        <span className="text-blue-400">Ed</span>
        <span className="text-green-400">uS</span>
        <span className="text-yellow-400">ea</span>
        <span className="text-red-400">rc</span>
        <span className="text-orange-400">h</span>
      </h1>

      {/* Search Bar with Glassmorphism Effect */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-md sm:max-w-lg backdrop-blur-lg bg-white/10 dark:bg-gray-700/30 p-3 rounded-lg shadow-lg flex flex-col gap-2"
      >
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-4 h-5 w-5 text-gray-600 dark:text-gray-300" />
          <input
            type="text"
            className="w-full p-3 pl-12 pr-4 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-400 bg-white/30 dark:bg-gray-800/50 transition-all text-sm md:text-base"
            placeholder="Search topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Search Button (Visible Only on Mobile) */}
        <button
          type="submit"
          className="md:hidden mt-2 p-3 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all"
        >
          Search
        </button>

        {/* Language Selector */}
        <select
          className="p-3 bg-gray-700 text-white border border-gray-500 rounded-lg text-sm md:text-base"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
        </select>
      </form>

      {/* Quick Search Buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {["Math", "Science", "Coding", "History"].map((tag) => (
          <button
            key={tag}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-400 transition-all text-sm md:text-base"
            onClick={() => navigate(`/search?q=${tag}`)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* About Section */}
      <div className="mt-10 p-4 bg-gray-800 text-white rounded-lg max-w-md text-center">
        <h2 className="text-xl font-bold mb-2">About EduSearch</h2>
        <p className="text-sm md:text-lg text-gray-300">
          EduSearch is an AI-powered educational search engine designed to
          provide accurate and concise explanations for any topic.
        </p>
      </div>
    </div>
  );
}
