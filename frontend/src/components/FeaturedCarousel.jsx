import { useState, useEffect, useRef, useCallback } from "react"
import { useFeaturedPhotos } from "../hooks/useFeaturedPhotos"
import "./FeaturedCarousel.css"

const AUTOPLAY_MS = 2500
const RESUME_AFTER_INTERACTION_MS = 3000

export default function FeaturedCarousel({ fallbackImage }) {
  const { photos, loading } = useFeaturedPhotos()

  // Build an extended array with a clone of the last slide at the front and
  // a clone of the first slide at the back — this is what makes "last slide
  // -> first slide" loop seamlessly instead of visibly snapping backwards.
  const hasMultiple = photos.length > 1
  const slides = hasMultiple ? [photos[photos.length - 1], ...photos, photos[0]] : photos

  const [index, setIndex] = useState(hasMultiple ? 1 : 0)
  const [withTransition, setWithTransition] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const resumeTimeoutRef = useRef(null)
  const trackRef = useRef(null)

  // keep index valid if the photo list changes size after fetch
  useEffect(() => {
    setIndex(hasMultiple ? 1 : 0)
  }, [photos.length, hasMultiple])

  const goTo = useCallback((newIndex) => {
    setWithTransition(true)
    setIndex(newIndex)
  }, [])

  const goNext = useCallback(() => goTo(index + 1), [index, goTo])
  const goPrev = useCallback(() => goTo(index - 1), [index, goTo])

  // Autoplay
  useEffect(() => {
    if (!hasMultiple || isHovering || isInteracting) return
    const id = setInterval(() => {
      setIndex((i) => i + 1)
      setWithTransition(true)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [hasMultiple, isHovering, isInteracting])

  // When the track finishes sliding onto a clone, snap invisibly to the real
  // matching slide so the loop feels infinite in both directions.
  const handleTransitionEnd = (e) => {
    if (e.target !== trackRef.current || e.propertyName !== "transform") return
    if (index === slides.length - 1) {
      setWithTransition(false)
      setIndex(1)
    } else if (index === 0) {
      setWithTransition(false)
      setIndex(slides.length - 2)
    }
  }

  // re-enable transitions on the next frame after a transition-less jump
  useEffect(() => {
    if (withTransition) return
    const raf = requestAnimationFrame(() => setWithTransition(true))
    return () => cancelAnimationFrame(raf)
  }, [withTransition])

  const markInteracting = () => {
    setIsInteracting(true)
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(() => setIsInteracting(false), RESUME_AFTER_INTERACTION_MS)
  }

  useEffect(() => () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
  }, [])

  const handlePrevClick = () => { markInteracting(); goPrev() }
  const handleNextClick = () => { markInteracting(); goNext() }
  const handleDotClick = (realIdx) => {
    markInteracting()
    goTo(hasMultiple ? realIdx + 1 : realIdx)
  }

  const activeDot = hasMultiple
    ? (((index - 1) % photos.length) + photos.length) % photos.length
    : 0

  if (loading) {
    return (
      <div className="fc-root fc-skeleton" aria-busy="true" aria-label="Loading featured photos" />
    )
  }

  if (photos.length === 0) {
    return (
      <div
        className="fc-root fc-fallback"
        style={fallbackImage ? { backgroundImage: `url("${fallbackImage}")` } : undefined}
      />
    )
  }

  return (
    <div
      className="fc-root"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={trackRef}
        className="fc-track"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: withTransition ? "transform 0.6s ease" : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((photo, i) => (
          <div className="fc-slide" key={`${photo.id}-${i}`}>
            <img src={photo.url} alt={photo.title || "Featured photo"} loading={i === 1 ? "eager" : "lazy"} />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            className="fc-arrow fc-arrow--prev"
            onClick={handlePrevClick}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            className="fc-arrow fc-arrow--next"
            onClick={handleNextClick}
            aria-label="Next slide"
          >
            ›
          </button>

          <div className="fc-dots" role="tablist" aria-label="Slide navigation">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                role="tab"
                aria-selected={i === activeDot}
                aria-label={`Go to slide ${i + 1}`}
                className={`fc-dot ${i === activeDot ? "is-active" : ""}`}
                onClick={() => handleDotClick(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
