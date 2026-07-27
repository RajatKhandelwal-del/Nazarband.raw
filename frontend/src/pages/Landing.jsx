import { useEffect } from "react"
import FeaturedCarousel from "../components/FeaturedCarousel"
import { Link } from 'react-router-dom';
import "./landing.css"

export default function Landing() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);

      setTimeout(() => {
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, []);


  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="navbar">
        <Link to={"/"} style={{width:"10%"}}><img src="/watermark.png" alt="" /></Link>
        <div className="nav-links">
          <Link to={"/Services"}>Services </Link>
          <Link to={"/Contact"}>Book session</Link>
        </div>
      </nav>

      {/* Hero — featured photos carousel */}
      <section className="hero">
        <FeaturedCarousel fallbackImage="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" />

        {/* <div className="overlay">
          <h1>Some moments deserve<br/>more than memory</h1>
          <p>Photography that freezes moments and emotions forever.</p>
        </div> */}
      </section>
    </div>
  )
}


