import { Link } from 'react-router-dom';
import { usePhotos } from "../hooks/usePhotos"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import { useEffect } from "react"

function PhotoSkeleton() {
  return Array.from({ length: 8 }).map((_, i) => (
    <Skeleton key={i} className="photo-skeleton" />
  ))
}

export default function Services(){

    const [activeCategory, setActiveCategory] = useState(null)
    const { photos, featured, categories, loading } = usePhotos(activeCategory)

    return(
        <div >
            <nav className="navbar">
                <Link to={"/"} style={{width:"10%"}}><img src="/watermark.png" alt="" /></Link>
                <div className="nav-links">
                <Link to={"/Contact"}>Book session</Link>
                </div>
            </nav>
            <section className="gallery" id="gallery" style={{marginTop:"2rem"}}>
                    <h2>Services Offered</h2>
            
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