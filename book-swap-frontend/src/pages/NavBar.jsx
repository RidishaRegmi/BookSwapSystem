import logo from "../assets/bookswaplogo.jpg";

export const Navbar = () => {
  return (
    <header>
      <div className="container">
        <div className="grid navbar-grid">
          <div className="logo">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img
                src={logo}
                alt="BookSwap logo"
                style={{ width: "32px", height: "32px", objectFit: "contain" }}
              />
              <h1>BookSwap</h1>
            </div>
          </div>
          <nav>
            <ul>
              <li>
                <a href="#">Profile</a>
              </li>
              <li>
                <a href="#">Logout</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
