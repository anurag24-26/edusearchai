import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, MoonIcon, SunIcon } from "@heroicons/react/outline";

export default function Home() {
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
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
      } min-h-screen flex flex-col items-center justify-center`}
    >
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-500" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-800" />
          )}
        </button>
      </div>

      <h1>
        <span className="text-3xl text-blue-500 font-bold mb-6">Ed</span>
        <span className="text-3xl text-green-500 font-bold mb-6">uS</span>
        <span className="text-3xl text-yellow-500 font-bold mb-6">ea</span>
        <span className="text-3xl text-red-500 font-bold mb-6">rc</span>
        <span className="text-3xl text-orange-500 font-bold mb-6">h</span>
      </h1>
      <form onSubmit={handleSearch} className="w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 pl-10 rounded-4xl border border-gray-300 focus:ring focus:ring-blue-300"
            placeholder="Search educational topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchIcon className="absolute right-3 top-4 h-5 w-5 text-black-500" />
        </div>
      </form>

      <div className="mt-5 flex space-x-3">
        {["Math", "Science", "Coding", "History"].map((tag) => (
          <button
            key={tag}
            className="px-5 py-2 bg-gray-500 text-black rounded-lg"
            onClick={() => navigate(`/search?q=${tag}`)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
