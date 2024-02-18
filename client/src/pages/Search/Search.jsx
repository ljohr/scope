import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Search.module.css";

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selection, setSelection] = useState("Professor");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    navigate(
      `/results?query=${encodeURIComponent(searchQuery)}&type=${selection}`
    );
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
        <form onSubmit={handleSubmit} className={style.searchForm}>
          <input
            type="search"
            id={selection === "Professor" ? "profQuery" : "courseQuery"}
            placeholder={`Enter a ${selection}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>
    </main>
  );
};

export default Search;
