import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { capitalize, getTypeColor } from "../utils.js";

const STAT_COLORS = {
  hp: "#ff6b6b",
  attack: "#ffa94d",
  defense: "#ffd43b",
  "special-attack": "#69db7c",
  "special-defense": "#4dabf7",
  speed: "#da77f2",
};

const STAT_LABELS = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

function PokeballSpinner({ label }) {
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

function DetailPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadPokemon() {
      setIsLoading(true);
      setError(null);
      setPokemon(null);

      try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);
        if (!response.ok) {
          throw new Error(`No Pokémon named "${name}" — check the spelling.`);
        }
        const data = await response.json();
        if (isCurrent) setPokemon(data);
      } catch (err) {
        if (isCurrent) setError(err.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadPokemon();
    return () => { isCurrent = false; };
  }, [name]);

  if (isLoading) return <PokeballSpinner label={`Retrieving ${capitalize(name)}…`} />;
  if (error) return <p className="status status-error">{error}</p>;

  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  const accent = getTypeColor(primaryType);
  const id = pokemon.id;

  const prevId = Math.max(1, id - 1);
  const nextId = id + 1;

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">← Back to list</Link>

      <div
        className="detail-hero"
        style={{
          background: `linear-gradient(135deg, ${accent}22 0%, var(--surface) 60%)`,
          color: accent,
          borderColor: `${accent}44`,
        }}
      >
        <div className="detail-id">#{String(id).padStart(3, "0")}</div>
        <img
          className="detail-artwork"
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          width={180}
          height={180}
        />
        <h2 className="detail-name" style={{ color: "var(--text)" }}>
          {capitalize(pokemon.name)}
        </h2>
        <div className="detail-types">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className="type-badge"
              style={{
                background: getTypeColor(t.type.name),
                fontSize: "0.8rem",
                padding: "4px 14px",
              }}
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <p className="stats-title">Base Stats</p>
        {pokemon.stats.map((s, i) => {
          const statName = s.stat.name;
          const pct = Math.min((s.base_stat / 255) * 100, 100);
          const barColor = STAT_COLORS[statName] ?? accent;
          return (
            <div className="stat-row" key={statName}>
              <span className="stat-label">{STAT_LABELS[statName] ?? statName}</span>
              <div className="stat-bar-track">
                <div
                  className="stat-bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
              <span className="stat-value">{s.base_stat}</span>
            </div>
          );
        })}
      </div>

      <div className="detail-nav">
        {id > 1 && (
          <Link to={`/pokemon/${prevId}`} className="nav-btn prev">
            <div>
              <span className="nav-btn-label">← Prev</span>
              <span className="nav-btn-name">#{String(prevId).padStart(3, "0")}</span>
            </div>
          </Link>
        )}
        <Link to={`/pokemon/${nextId}`} className="nav-btn next">
          <div>
            <span className="nav-btn-label">Next →</span>
            <span className="nav-btn-name">#{String(nextId).padStart(3, "0")}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default DetailPage;
