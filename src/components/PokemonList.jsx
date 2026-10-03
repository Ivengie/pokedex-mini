import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { capitalize, getSpriteUrl, getTypeColor } from "../utils.js";

const PAGE_SIZE = 20;

const ALL_TYPES = [
  "normal","fire","water","electric","grass","ice","fighting","poison",
  "ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy"
];

function PokeballSpinner({ label = "Loading…" }) {
  return (
    <div className="spinner-wrap">
      <svg className="pokeball-spinner" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#e63946" stroke="#222" strokeWidth="3"/>
        <path d="M2,50 A48,48 0 0,0 98,50" fill="#f5f5f5" stroke="#222" strokeWidth="3"/>
        <rect x="2" y="47" width="96" height="6" fill="#222"/>
        <circle cx="50" cy="50" r="14" fill="#f5f5f5" stroke="#222" strokeWidth="3"/>
        <circle cx="50" cy="50" r="7" fill="#ddd" stroke="#222" strokeWidth="2"/>
      </svg>
      <div className="spinner-label">{label}</div>
    </div>
  );
}

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  async function fetchPage(off, isMore) {
    if (isMore) setIsLoadingMore(true);
    else setIsLoading(true);
    setError(null);

    try {
      const listRes = await fetch(`${API_BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${off}`);
      if (!listRes.ok) throw new Error(`Server responded with status ${listRes.status}`);
      const listData = await listRes.json();

      setHasMore(!!listData.next);

      const detailed = await Promise.all(
        listData.results.map(async (p) => {
          const id = p.url.split("/").filter(Boolean).pop();
          try {
            const res = await fetch(`${API_BASE_URL}/pokemon/${id}`);
            if (!res.ok) return { ...p, id, types: [] };
            const data = await res.json();
            return { ...p, id, types: data.types.map((t) => t.type.name) };
          } catch {
            return { ...p, id, types: [] };
          }
        })
      );

      setPokemons((prev) => (isMore ? [...prev, ...detailed] : detailed));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }

  useEffect(() => { fetchPage(0, false); }, []);

  function handleLoadMore() {
    const next = offset + PAGE_SIZE;
    setOffset(next);
    fetchPage(next, true);
  }

  function handleTypeClick(type) {
    setActiveType((prev) => (prev === type ? null : type));
  }

  const filtered = activeType
    ? pokemons.filter((p) => p.types.includes(activeType))
    : pokemons;

  if (isLoading) return <PokeballSpinner label="Scanning National Dex…" />;
  if (error) return <p className="status status-error">Couldn't load the list: {error}</p>;

  return (
    <>
      <div className="type-filters">
        {ALL_TYPES.map((type) => (
          <button
            key={type}
            className={`type-chip${activeType === type ? " active" : ""}`}
            style={{ background: getTypeColor(type), color: "#fff" }}
            onClick={() => handleTypeClick(type)}
          >
            {type}
          </button>
        ))}
        {activeType && (
          <button
            className="type-chip active"
            style={{ background: "#444", color: "#fff" }}
            onClick={() => setActiveType(null)}
          >
            ✕ clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="no-results">
          <div className="no-results-emoji">🔍</div>
          <p>No <strong style={{ textTransform: "capitalize" }}>{activeType}</strong>-type Pokémon loaded yet.<br/>Load more to expand the registry.</p>
        </div>
      ) : (
        <ul className="pokemon-list">
          {filtered.map((pokemon) => {
            const primaryType = pokemon.types[0] ?? "normal";
            const accent = getTypeColor(primaryType);
            return (
              <li key={pokemon.name} className="pokemon-list-item">
                <Link
                  to={`/pokemon/${pokemon.name}`}
                  className="pokemon-link"
                  style={{ "--card-accent": accent }}
                >
                  <img
                    className="pokemon-sprite"
                    src={getSpriteUrl(pokemon.id)}
                    alt={pokemon.name}
                    width={48}
                    height={48}
                    loading="lazy"
                  />
                  <div className="pokemon-info">
                    <div className="pokemon-id">#{String(pokemon.id).padStart(3, "0")}</div>
                    <div className="pokemon-name">{capitalize(pokemon.name)}</div>
                    <div className="pokemon-types">
                      {pokemon.types.map((t) => (
                        <span
                          key={t}
                          className="type-badge"
                          style={{ background: getTypeColor(t) }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {isLoadingMore ? (
        <PokeballSpinner label="Fetching next batch…" />
      ) : hasMore ? (
        <div className="load-more-wrap">
          <button className="load-more-btn" onClick={handleLoadMore}>
            Load More ↓
          </button>
        </div>
      ) : null}
    </>
  );
}

export default PokemonList;
