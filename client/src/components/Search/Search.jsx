import axios from "axios";
import { useState, useEffect } from "react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchQueries = async () => {
      if (searchQuery) {
        const res = await axios.get(`/search/profSearch/${searchQuery}`);
        console.log(searchQuery);
      }
    };

    const timerId = setTimeout(() => {
      fetchQueries();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="search"
        id="profQuery"
        placeholder="Enter a Professor's Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default Search;
