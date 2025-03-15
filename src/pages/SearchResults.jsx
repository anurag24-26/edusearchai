import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SearchIcon } from "@heroicons/react/outline";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Supports GitHub Flavored Markdown (tables, code blocks)
import SkeletonLoader from "../components/SkeletonLoader";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const languageParam = searchParams.get("lang") || "English"; // Default to English
  const [query, setQuery] = useState(queryParam);
  const [language, setLanguage] = useState(languageParam);
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const geminiApiKey = "AIzaSyC0uSlEkliGDzOZBP4s_NGmfsoLTLdAQ-s";

  useEffect(() => {
    if (!queryParam) return;

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
                      text: `Provide a structured, educational response about ${queryParam} in ${languageParam}. If relevant, include code snippets in proper markdown format.`,
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
            data.candidates[0].content.parts[0].text || "No data found."
          );
        } else {
          setResults("No results found.");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults("Error fetching results.");
      }
      setLoading(false);
    };

    fetchResults();
  }, [queryParam, languageParam]); // Only fetch when the URL query changes

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}&lang=${language}`);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col transition-all">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <h1
          className="text-3xl text-center font-extrabold cursor-pointer"
          onClick={() => navigate(`/`)}
        >
          <span className="text-blue-400">Ed</span>
          <span className="text-green-400">uS</span>
          <span className="text-yellow-400">ea</span>
          <span className="text-red-400">rc</span>
          <span className="text-orange-400">h</span>
        </h1>

        {/* Language Selector */}
        <select
          className="p-2 bg-gray-700 text-white border border-gray-500 rounded-lg"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
        </select>
      </nav>

      {/* Search Results */}
      <div className="container mx-auto px-6 py-6 flex-grow">
        <h1 className="text-xl font-bold mb-4">
          AI Search Results for "{queryParam}"
        </h1>

        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="bg-gray-800 shadow-md rounded-lg p-6 border border-gray-600 hover:scale-[1.02] transition-transform">
            {/* Render Markdown safely */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre: ({ children }) => (
                  <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                    {children}
                  </pre>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-700 text-green-400 p-1 rounded">
                    {children}
                  </code>
                ),
              }}
            >
              {results}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Search Bar at Bottom (for Mobile UI) */}
      <div className="fixed bottom-4 left-0 w-full px-4">
        <form
          onSubmit={handleSearch}
          className="relative flex w-full bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700"
        >
          <SearchIcon className="absolute left-3 top-6 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-20 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-400 transition-all"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Only update local state
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-400 transition-all"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
