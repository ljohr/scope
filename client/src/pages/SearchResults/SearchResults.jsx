import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const query = useQuery();
  const searchQuery = query.get("query");
  const type = query.get("type");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (type == "Professor") {
          const response = await axios.get(`/search/profSearch/${searchQuery}`);
          setResults(response.data);
        } else if (type == "Course") {
          const response = await axios.get(
            `/search/courseSearch/${searchQuery}`
          );
          setResults(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      }
    };

    fetchResults();
  }, [searchQuery, type]);

  return (
    <div>
      <h2>Search Results</h2>
      {results.map((result, index) => {
        return (
          <div key={index}>
            {result.professorName} - {result.department}
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;
