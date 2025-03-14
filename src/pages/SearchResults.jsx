import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import { SearchIcon, MoonIcon, SunIcon } from "@heroicons/react/outline";
import SkeletonLoader from "../components/SkeletonLoader";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [newQuery, setNewQuery] = useState(query || "");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const geminiApiKey = "AIzaSyC0uSlEkliGDzOZBP4s_NGmfsoLTLdAQ-s";

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `Provide short, educational summaries about: ${query}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("API Response:", data);

        if (data.candidates && data.candidates.length > 0) {
          setResults(
            data.candidates[0].content.parts[0].text
              .split("\n")
              .filter((item) => item.trim() !== "")
              .map((item, index) => ({
                title: `Result ${index + 1}`,
                snippet: item,
              }))
          );
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (newQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(newQuery)}`);
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } min-h-screen`}
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-3xl font-bold text-blue-600">EduSearch AI</h1>
        <form onSubmit={handleSearch} className="relative flex-1 mx-4">
          <input
            type="text"
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring focus:ring-blue-300 bg-white dark:bg-gray-700"
            placeholder="Ask AI about educational topics..."
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-300" />
        </form>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-500" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-800" />
          )}
        </button>
      </nav>

      {/* Search Results */}
      <div className="container mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold mb-4">
          AI Search Results for "{query}"
        </h1>

        {loading ? (
          <SkeletonLoader />
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition transform hover:scale-[1.02]"
              >
                <p className="text-lg font-semibold text-blue-600">
                  {result.title}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {result.snippet}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-500 text-lg">No results found.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 text-white font-bold rounded-md ${
              page === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <span className="text-lg font-semibold">Page {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 text-white font-bold rounded-md bg-blue-600 hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
