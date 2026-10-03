import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function SearchForm() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const name = query.trim().toLowerCase();
    if (!name) {
      setError("Type a Pokémon name first.");
      return;
    }
    setError(null);
    navigate(`/pokemon/${name}`);
  }

  return (
    <div className="search">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or number…"
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      <div className="search-hint">Press <kbd>/</kbd> to focus search</div>
      {error && <p className="status status-error">{error}</p>}
    </div>
  );
}

export default SearchForm;
