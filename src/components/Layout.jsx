import { Outlet, Link } from "react-router-dom";

function PokeballIcon() {
  return (
    <svg className="pokeball-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#e63946" stroke="#222" strokeWidth="3"/>
      <rect x="2" y="47" width="96" height="6" fill="#222"/>
      <path d="M2,50 A48,48 0 0,0 98,50" fill="#f5f5f5" stroke="#222" strokeWidth="3"/>
      <rect x="2" y="47" width="96" height="6" fill="#222"/>
      <circle cx="50" cy="50" r="16" fill="#f5f5f5" stroke="#222" strokeWidth="3"/>
      <circle cx="50" cy="50" r="9" fill="#e8e8f0" stroke="#222" strokeWidth="2"/>
      <circle cx="46" cy="46" r="4" fill="white" opacity="0.7"/>
    </svg>
  );
}

function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-title-link">
          <PokeballIcon />
          <div>
            <h1>PokéDex Mini</h1>
            <div className="header-subtitle">National Registry Terminal v2.1</div>
          </div>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
