import { useState } from "react"
import { useEffect } from "react"
import { usePhotos } from "../hooks/usePhotos"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

function PhotoSkeleton() {
  return Array.from({ length: 8 }).map((_, i) => (
    <Skeleton key={i} className="photo-skeleton" />
  ))
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
        <div style={{width:"10%"}}><img src="/watermark.png" alt="" /></div>
        <div className="nav-links">
          <a href="#gallery">Gallery</a>
          <a href="#">About</a>
          <Link to={"/Contact"}>Contact</Link>
        </div>
      </nav>

      {/* Hero — dynamic featured images grid */}
      <section className="hero">
        <div
            className="hero-grid hero-grid--fallback"
            style={{
              backgroundImage: `url("bgImg2.jpeg")`,//https://images.unsplash.com/photo-1500530855697-b586d89ba3ee
              
            }}
          />

        <div className="overlay">
          <h1>Some moments deserve<br/>more than memory</h1>
          <p>Photography that freezes moments and emotions forever.</p>
          <Button
            variant="outline"
            className="hero-cta"
            onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
          >
            Featured Work
          </Button>
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery" id="gallery">
        <h2>Collections</h2>

        {/* Category filter pills */}
        <div className="category-pills">
          <Badge
            variant={activeCategory === null ? "default" : "outline"}
            className="pill"
            onClick={() => setActiveCategory(null)}
          >
            All
          </Badge>
          {categories.map(cat => (
            <Badge
              key={cat.id}
              variant={activeCategory === cat.slug ? "default" : "outline"}
              className="pill"
              onClick={() => setActiveCategory(cat.slug)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>

        {/* Photo grid */}
        <div className="photo-grid">
          {loading ? (
            <PhotoSkeleton />
          ) : photos.length === 0 ? (
            <p className="empty-state">
              No photos yet — upload some to Supabase Storage!
            </p>
          ) : (
            photos.map(photo => (
              <div key={photo.id} className="photo-card">
                <img src={photo.url} alt={photo.title || "photo"} loading="lazy" />
                {photo.title && (
                  <div className="photo-info">
                    <span>{photo.title}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}