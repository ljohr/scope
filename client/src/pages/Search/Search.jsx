import axios from "axios";
import { useState, useEffect } from "react";
import style from "./Search.module.css";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selection, setSelection] = useState("Professor");

  useEffect(() => {
    const fetchQueries = async () => {
      if (searchQuery == "Professor") {
        const res = await axios.get(`/search/profSearch/${searchQuery}`);
        console.log(searchQuery);
      } else if (searchQuery == "Course") {
        const res = await axios.get(`/search/courseSearch/${searchQuery}`);
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

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
  };

  return (
    <main className={style.searchPage}>
      <h1>Search</h1>
      <section className={style.searchBlock}>
        <select
          name="search"
          id="searchSelect"
          value={selection}
          onChange={handleSelectionChange}
        >
          <option value="Professor">Professor</option>
          <option value="Course">Course</option>
        </select>
        {selection === "Professor" && (
          <form onSubmit={handleSubmit} className={style.searchForm}>
            <input
              type="search"
              id="profQuery"
              placeholder="Enter a Professor's Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        )}
        {selection === "Course" && (
          <form onSubmit={handleSubmit} className={style.searchForm}>
            <input
              type="search"
              id="courseQuery"
              placeholder="Enter a Course"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        )}
      </section>
    </main>
  );
};

export default Search;
