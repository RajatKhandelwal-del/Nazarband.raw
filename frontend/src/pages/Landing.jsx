import { useState } from "react"
import { useEffect } from "react"
import { usePhotos } from "../hooks/usePhotos"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from 'react-router-dom';
import "./landing.css"

function HeroSkeleton() {
  return (
    <div className="hero-grid">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="hero-skeleton" />
      ))}
    </div>
  )
}

export default function Landing() {
  const [activeCategory, setActiveCategory] = useState(null)
  const { photos, featured, categories, loading } = usePhotos(activeCategory)

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

      {/* Hero — dynamic featured images grid */}
      <section className="hero">
        <div
            className="hero-grid hero-grid--fallback"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee")`,//https://images.unsplash.com/photo-1500530855697-b586d89ba3ee
              
            }}
          />

        <div className="overlay">
          <h1>Some moments deserve<br/>more than memory</h1>
          <p>Photography that freezes moments and emotions forever.</p>
          {/* <Button
            variant="outline"
            className="hero-cta"
            onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
          >
            Featured Work
          </Button> */}
        </div>
      </section>
    </div>
  )
}