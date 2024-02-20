import style from "./Search.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import searchStyles from "../../components/SearchBar/SearchBar.module.css";

const Search = () => {
  return (
    <main className={style.searchPage}>
      <h1>Search</h1>

      <SearchBar className={searchStyles.searchBlock} />
    </main>
  );
};

export default Search;
