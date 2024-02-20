import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ className }) => {
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
    <section className={className}>
      <select
        name="search"
        id="searchSelect"
        value={selection}
        onChange={handleSelectionChange}
      >
        <option value="Professor">Professor</option>
        <option value="Course">Course</option>
      </select>
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          id={selection === "Professor" ? "profQuery" : "courseQuery"}
          placeholder={`Find a ${selection}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>
    </section>
  );
};

export default SearchBar;
