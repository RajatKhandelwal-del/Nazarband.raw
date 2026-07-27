import { useState, useEffect } from "react"
import { supabase, getPhotoUrl } from "../lib/supabase"

export function useFeaturedPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from("photos")
          .select("id, title, storage_path, sort_order")
          .eq("is_featured", true)
          .order("sort_order", { ascending: true })

        if (error) throw error
        if (cancelled) return

        setPhotos((data ?? []).map((p) => ({ ...p, url: getPhotoUrl(p.storage_path) })))
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  return { photos, loading, error }
}
