import "./landing.css";

const photos = [
  "/images/photo1.jpg",
  "/images/photo2.jpg",
  "/images/photo3.jpg",
  "/images/photo4.jpg",
  "/images/photo5.jpg",
  "/images/photo6.jpg",
];

export default function Landing() {
  return (
    <div className="landing">
      <nav className="navbar">
        <h1 className="logo">Nazarband</h1>

        <div className="nav-links">
          <a href="#">Gallery</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      </nav>

      <section className="hero">
        <div className="overlay">
          <h1>Capturing Stories Beyond Sight</h1>

          <p>
            Photography that freezes moments and emotions forever.
          </p>

          <button>Explore Gallery</button>
        </div>
      </section>

      <section className="categories">
        <h2>Featured Collections</h2>

        <div className="cards">
          <div className="card">Portraits</div>
          <div className="card">Street</div>
          <div className="card">Nature</div>
          <div className="card">Travel</div>
        </div>
      </section>
    </div>
  );
}