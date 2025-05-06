import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SearchIcon } from "@heroicons/react/outline";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Supports GitHub Flavored Markdown (tables, code blocks)
import SkeletonLoader from "../components/SkeletonLoader";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const languageParam = searchParams.get("lang") || "English";
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
                      text: `Briefly explain the topic '${queryParam}' in ${languageParam} in a structured and clear way. Include code snippets in markdown format only if the topic is technical and code is essential for understanding. Keep the answer concise, beginner-friendly, and avoid unnecessary details.`,
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
  }, [queryParam, languageParam]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}&lang=${language}`);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
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

      {/* Chat Interface */}
      <div className="flex flex-col px-4 py-6 gap-4 flex-grow overflow-y-auto">
        {/* User Message Bubble */}
        {queryParam && (
          <div className="self-end max-w-[80%] bg-blue-600 text-white p-4 rounded-xl rounded-br-none shadow-md">
            {queryParam}
          </div>
        )}

        {/* Assistant Message Bubble */}
        {!loading && (
          <div className="self-start max-w-[80%] bg-gray-700 text-white p-4 rounded-xl rounded-bl-none shadow-md">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre: ({ children }) => (
                  <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                    {children}
                  </pre>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-800 text-green-400 px-1 py-0.5 rounded">
                    {children}
                  </code>
                ),
              }}
            >
              {results}
            </ReactMarkdown>
          </div>
        )}

        {loading && <SkeletonLoader />}
      </div>

      {/* Chat Input */}
      <div className="w-full p-4 bg-gray-900 border-t border-gray-700">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 border border-gray-600 shadow-md"
        >
          <input
            type="text"
            placeholder="Send a message..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow bg-transparent text-white outline-none px-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-400 transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
